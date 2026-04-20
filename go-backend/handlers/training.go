package handlers

import (
	"backend/database"
	"backend/models"
	"backend/services"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)


type VerifyRequest struct {
	QuestionID       string `json:"questionId"`
	SelectedOptionID string `json:"selectedOptionId,omitempty"`
	WrittenAnswer    string `json:"writtenAnswer,omitempty"`
}

type VerifyResponse struct {
	IsCorrect     bool   `json:"isCorrect"`
	Feedback      string `json:"feedback"`
	Explanation   string `json:"explanation"`
	CorrectOption string `json:"correctOptionId,omitempty"`
}

func VerifyAnswer(c *gin.Context) {
	var req VerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification data"})
		return
	}

	// First try TrainingQuestion (AI/Seeded for Training Module)
	var tq models.TrainingQuestion
	err := database.DB.Where("id = ?", req.QuestionID).First(&tq).Error
	if err == nil {
		// Found in Training Table
		handleTrainingVerification(c, tq, req)
		return
	}

	// Fallback to Arena Question (Vault)
	var mq models.Question
	if err := database.DB.Preload("Options").Where("id = ?", req.QuestionID).First(&mq).Error; err != nil {
		log.Printf("[Verify] Question sinkhole detected: ID=%s", req.QuestionID)
		c.JSON(http.StatusNotFound, gin.H{"error": "Neural Link Compromised. Question mapping failed."})
		return
	}

	handleArenaVerification(c, mq, req)
}

func NormalizeAnswer(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ToLower(s)
	// Collapse repeated whitespace
	for strings.Contains(s, "  ") {
		s = strings.ReplaceAll(s, "  ", " ")
	}
	// Remove accidental newline differences
	s = strings.ReplaceAll(s, "\r\n", " ")
	s = strings.ReplaceAll(s, "\n", " ")
	return s
}

func handleTrainingVerification(c *gin.Context, q models.TrainingQuestion, req VerifyRequest) {
	var optArr []string
	json.Unmarshal([]byte(q.Options), &optArr)

	resp := VerifyResponse{
		Explanation: q.Explanation,
	}

	userRaw := req.SelectedOptionID
	if userRaw == "" {
		userRaw = req.WrittenAnswer
	}

	log.Printf("[Verify] question_id=%s type=%s", req.QuestionID, q.Type)
	log.Printf("[Verify] raw user answer=%q", userRaw)
	log.Printf("[Verify] raw correct answer=%q", q.Answer)

	if q.Type == "mcq" {
		// The frontend sends either the option text directly or a synthetic ID like "OPT_13_2"
		// We need to compare the actual text content against the stored answer
		userText := userRaw

		// If userRaw looks like a synthetic ID (OPT_*), resolve it to text
		if strings.HasPrefix(userRaw, "OPT_") && len(optArr) > 0 {
			// Parse index from OPT_{id}_{index}
			parts := strings.Split(userRaw, "_")
			if len(parts) >= 3 {
				idxStr := parts[len(parts)-1]
				if idx, err := strconv.Atoi(idxStr); err == nil && idx >= 0 && idx < len(optArr) {
					userText = optArr[idx]
				}
			}
		}

		normalizedUser := NormalizeAnswer(userText)
		normalizedCorrect := NormalizeAnswer(q.Answer)
		isCorrect := normalizedUser == normalizedCorrect

		log.Printf("[Verify] answer comparison: user=%q correct=%q match=%v", normalizedUser, normalizedCorrect, isCorrect)

		resp.IsCorrect = isCorrect
		resp.CorrectOption = q.Answer
		if isCorrect {
			resp.Feedback = "Correct! Well done."
		} else {
			resp.Feedback = "Incorrect. The correct answer is: " + q.Answer
		}
	} else {
		// Subjective evaluation
		aiEval, err := services.EvaluateAnswer(q.Prompt, q.Answer, req.WrittenAnswer, 10)
		if err != nil {
			resp.IsCorrect = false
			resp.Feedback = "AI evaluation unavailable."
		} else {
			resp.IsCorrect = aiEval.IsCorrect
			resp.Feedback = aiEval.Feedback
		}
		log.Printf("[Verify] result=%v", resp.IsCorrect)
	}
	c.JSON(http.StatusOK, resp)
}

func handleArenaVerification(c *gin.Context, q models.Question, req VerifyRequest) {
	resp := VerifyResponse{
		Explanation: q.Explanation,
	}

	isCorrect := false
	for _, opt := range q.Options {
		if opt.IsCorrect {
			resp.CorrectOption = opt.ID
		}
		if opt.ID == req.SelectedOptionID && opt.IsCorrect {
			isCorrect = true
		}
	}
	resp.IsCorrect = isCorrect
	if isCorrect {
		resp.Feedback = "Vault Access Confirmed."
	} else {
		resp.Feedback = "Access Denied. Incorrect credentials."
	}
	c.JSON(http.StatusOK, resp)
}

type GenerateRequest struct {
	Topic      string `json:"topic"`
	Difficulty string `json:"difficulty"`
	Count      int    `json:"count"`
}

func GenerateTrainingSession(c *gin.Context) {
	var req GenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid generation parameters"})
		return
	}

	requestedCount := req.Count
	if requestedCount <= 0 {
		requestedCount = 10 // Default
	}
	minAI := (requestedCount * 6) / 10 // 60% floor

	var finalQuestions []services.GeneratedQuestion
	seenPrompts := make(map[string]bool)
	
	// Telemetry Tracker
	telemetry := struct {
		Requested       int
		AIFirst         int
		AIRetry         int
		AITotal         int
		FallbackAdded   int
		RemovedDuplicates int
		RepeatedPromptRejections int
	}{Requested: requestedCount}

	// 1. STAGE 1: Initial AI Generation
	aiRes, err := services.GenerateQuestions(req.Topic, req.Difficulty, requestedCount, nil)
	if err == nil {
		for _, q := range aiRes {
			norm := database.NormalizePrompt(q.Prompt)
			if seenPrompts[norm] {
				telemetry.RemovedDuplicates++
				continue
			}
			if database.CheckPromptExists(req.Topic, q.Prompt) {
				telemetry.RepeatedPromptRejections++
				continue
			}
			seenPrompts[norm] = true
			finalQuestions = append(finalQuestions, q)
		}
		telemetry.AIFirst = len(finalQuestions)
	} else {
		log.Printf("[AI] ERROR: First call failed: %v", err)
	}

	// 2. STAGE 2: AI Retry if deficiency detected
	if len(finalQuestions) < requestedCount {
		deficiency := requestedCount - len(finalQuestions)
		log.Printf("[AI] RETRY: Attempting to fill gap of %d questions", deficiency)
		
		excludeList := []string{}
		for p := range seenPrompts {
			excludeList = append(excludeList, p)
		}

		retryRes, err := services.GenerateQuestions(req.Topic, req.Difficulty, deficiency, excludeList)
		if err == nil {
			retryAdded := 0
			for _, q := range retryRes {
				norm := database.NormalizePrompt(q.Prompt)
				if seenPrompts[norm] {
					telemetry.RemovedDuplicates++
					continue
				}
				if database.CheckPromptExists(req.Topic, q.Prompt) {
					telemetry.RepeatedPromptRejections++
					continue
				}
				seenPrompts[norm] = true
				finalQuestions = append(finalQuestions, q)
				retryAdded++
			}
			telemetry.AIRetry = retryAdded
		} else {
			log.Printf("[AI] ERROR: Retry call failed: %v", err)
		}
	}

	telemetry.AITotal = len(finalQuestions)
	if telemetry.AITotal < minAI {
		log.Printf("[AI_QUOTA_FAIL] requested=%d min_ai=%d actual_ai=%d", requestedCount, minAI, telemetry.AITotal)
	}

	// 3. STAGE 3: Database Fallback (Top-up only)
	if len(finalQuestions) < requestedCount {
		gap := requestedCount - len(finalQuestions)
		log.Printf("[FALLBACK] Pulling %d questions from DB vault", gap)
		
		dbQuestions, _ := database.GetQuestions(req.Topic, req.Difficulty, gap + 10) // fetch extra for dedup
		fallbackCount := 0
		for _, dbq := range dbQuestions {
			if fallbackCount >= gap {
				break
			}
			norm := database.NormalizePrompt(dbq.Prompt)
			if seenPrompts[norm] {
				continue
			}
			
			seenPrompts[norm] = true
			var optArr []string
			json.Unmarshal([]byte(dbq.Options), &optArr)
			
			finalQuestions = append(finalQuestions, services.GeneratedQuestion{
				Type:        dbq.Type,
				Prompt:      dbq.Prompt,
				Options:     optArr,
				Answer:      dbq.Answer,
				Explanation: dbq.Explanation,
				Difficulty:  dbq.Difficulty,
			})
			fallbackCount++
		}
		telemetry.FallbackAdded = fallbackCount
	}

	// 4. Persistence & Session Creation
	questionIDs := []uint{}
	for _, q := range finalQuestions {
		// Check if we need to save (only if from AI and not in DB)
		// Actually, to keep it simple, we check if it exists in DB by prompt
		var existingID uint
		err := database.DB.Model(&models.TrainingQuestion{}).
			Select("id").
			Where("topic = ? AND LOWER(TRIM(prompt)) = ?", req.Topic, database.NormalizePrompt(q.Prompt)).
			Scan(&existingID).Error

		if err == nil && existingID > 0 {
			questionIDs = append(questionIDs, existingID)
		} else {
			// Save new AI question
			optJSON, _ := json.Marshal(q.Options)
			tq := models.TrainingQuestion{
				Topic:       req.Topic,
				Type:        q.Type,
				Difficulty:  q.Difficulty,
				Prompt:      q.Prompt,
				Options:     string(optJSON),
				Answer:      q.Answer,
				Explanation: q.Explanation,
				Source:      "ai",
			}
			if err := database.DB.Create(&tq).Error; err == nil {
				questionIDs = append(questionIDs, tq.ID)
			}
		}
	}

	// Logging Telemetry
	log.Printf("[COUNT] requested=%d ai_first=%d ai_retry=%d ai_total=%d fallback_added=%d final_returned=%d", 
		telemetry.Requested, telemetry.AIFirst, telemetry.AIRetry, telemetry.AITotal, telemetry.FallbackAdded, len(questionIDs))
	log.Printf("[DEDUP] removed_duplicates=%d", telemetry.RemovedDuplicates)
	log.Printf("[VARIETY] repeated_prompt_rejections=%d", telemetry.RepeatedPromptRejections)

	if len(questionIDs) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Failed to assemble session. Logic vault is empty."})
		return
	}

	// Create Session
	sessionID := uuid.New().String()
	qIDsJSON, _ := json.Marshal(questionIDs)
	session := models.TrainingSession{
		SessionID:   sessionID,
		Topic:       req.Topic,
		QuestionIDs: string(qIDsJSON),
		Status:      "active",
		CreatedAt:   time.Now(),
	}
	database.DB.Create(&session)

	// Build Response
	responseQuestions := make([]gin.H, len(finalQuestions))
	for i, q := range finalQuestions {
		responseQuestions[i] = gin.H{
			"id":          questionIDs[i], // Matching index order
			"topic":       req.Topic,
			"type":        q.Type,
			"difficulty":  q.Difficulty,
			"prompt":      q.Prompt,
			"options":     q.Options,
			"answer":      q.Answer,
			"explanation": q.Explanation,
			"source":      "ai",
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"session_id": sessionID,
		"sessionId":  sessionID,
		"topic":      req.Topic,
		"count":      len(responseQuestions),
		"questions":  responseQuestions,
	})
}


func GetTrainingSession(c *gin.Context) {
	sessionID := c.Param("id")
	
	session, questions, err := database.GetSession(sessionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session module missing or corrupted"})
		return
	}

	// Map to response format
	responseQuestions := make([]any, len(questions))
	for i, q := range questions {
		var optArr []string
		json.Unmarshal([]byte(q.Options), &optArr)

		responseQuestions[i] = gin.H{
			"id":          q.ID,
			"prompt":      q.Prompt,
			"type":        q.Type,
			"difficulty":  q.Difficulty,
			"options":     optArr,
			"explanation": q.Explanation,
			"source":      q.Source,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"sessionId": session.SessionID,
		"topic":     session.Topic,
		"status":    session.Status,
		"questions": responseQuestions,
	})
}
