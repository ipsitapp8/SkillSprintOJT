package handlers

import (
	"backend/database"
	"backend/models"
	"backend/services"
	"fmt"
	"net/http"

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

	var question models.Question
	if err := database.DB.Preload("Options").Where("id = ?", req.QuestionID).First(&question).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Question synchronization failed"})
		return
	}

	resp := VerifyResponse{
		Explanation: question.Explanation,
	}

	if question.Type == "mcq" {
		isCorrect := false
		for _, opt := range question.Options {
			if opt.IsCorrect {
				resp.CorrectOption = opt.ID
			}
			if opt.ID == req.SelectedOptionID && opt.IsCorrect {
				isCorrect = true
			}
		}
		resp.IsCorrect = isCorrect
		if isCorrect {
			resp.Feedback = "Neural Match Confirmed. Correct architecture identified."
		} else {
			resp.Feedback = "Neural Anomaly Detected. Selected configuration is insufficient."
		}
	} else {
		// Code / Subjective AI Evaluation
		aiEval, err := services.EvaluateAnswer(question.Prompt, question.CorrectAnswer, req.WrittenAnswer, question.MaxScore)
		if err != nil {
			resp.IsCorrect = false
			resp.Feedback = "AI Interface Offline. Immediate verification unavailable."
		} else {
			resp.IsCorrect = aiEval.IsCorrect
			resp.Feedback = aiEval.Feedback
			if aiEval.Explanation != "" {
				resp.Explanation = aiEval.Explanation
			}
		}
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

	// 1. Generate Questions via AI Service
	aiQuestions, err := services.GenerateQuestions(req.Topic, req.Difficulty, req.Count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Neural Synthesis Interface Offline"})
		return
	}

	// 2. Create a Dynamic Quiz Entry
	quizID := "AI_" + req.Topic + "_" + uuid.New().String()[:8]
	quiz := models.Quiz{
		ID:         quizID,
		Title:      "Neural Sync: " + req.Topic,
		Difficulty: req.Difficulty,
		IsActive:   true,
	}
	
	if err := database.DB.Create(&quiz).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize logic vault"})
		return
	}

	// 3. Transform and Save Questions
	for _, q := range aiQuestions {
		qID := uuid.New().String()
		newQ := models.Question{
			ID:            qID,
			QuizID:        quizID,
			Prompt:        q.Prompt,
			Type:          q.Type,
			CorrectAnswer: q.CorrectAnswer,
			Explanation:   q.Explanation,
			MaxScore:      q.MaxScore,
		}
		
		if err := database.DB.Create(&newQ).Error; err != nil {
			continue // Defensive: skip malformed questions
		}

		// Save Options if MCQ
		if q.Type == "mcq" {
			for idx, optText := range q.Options {
				isCorrect := optText == q.CorrectAnswer
				option := models.Option{
					ID:         fmt.Sprintf("%s_OPT_%d", qID, idx),
					QuestionID: qID,
					Text:       optText,
					IsCorrect:  isCorrect,
				}
				database.DB.Create(&option)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"quizId": quizID,
		"status": "SYNTHESIS_COMPLETE",
	})
}
