package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// AIResponse is used by the answer evaluation endpoint.
type AIResponse struct {
	Score                 int    `json:"score"`
	IsCorrect             bool   `json:"isCorrect"`
	Feedback              string `json:"feedback"`
	Explanation           string `json:"explanation"`
	ImprovementSuggestion string `json:"improvementSuggestion"`
}

// EvaluateAnswer scores a user's answer against the correct answer.
func EvaluateAnswer(question, correctAnswer, userAnswer string, maxScore int) (*AIResponse, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// Fallback to mock if no API key
		score := 0
		if len(userAnswer) > 10 {
			score = maxScore - 1
		}
		return &AIResponse{
			Score:                 score,
			IsCorrect:             score > maxScore/2,
			Feedback:              "Evaluated by SkillSprint AI (System Mock). Good effort!",
			Explanation:           fmt.Sprintf("Reference Answer: %s", correctAnswer),
			ImprovementSuggestion: "Try to include more technical keywords for a perfect score.",
		}, nil
	}

	// Real API Call logic (Simplified for OpenAI)
	url := "https://api.openai.com/v1/chat/completions"
	prompt := fmt.Sprintf(`You are an evaluator.
Question: %s
Correct Answer: %s
User Answer: %s

Task: Evaluate the User Answer against the Correct Answer.
Return a JSON object with:
- score: out of %d
- isCorrect: boolean
- feedback: short text on quality
- explanation: the correct reasoning
- improvementSuggestion: how to get a better score

Respond ONLY with JSON.`, question, correctAnswer, userAnswer, maxScore)

	payload := map[string]interface{}{
		"model": "gpt-4o-mini",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"response_format": map[string]string{"type": "json_object"},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI service error: %d", resp.StatusCode)
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Choices) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}

	var eval AIResponse
	if err := json.Unmarshal([]byte(result.Choices[0].Message.Content), &eval); err != nil {
		return nil, err
	}

	return &eval, nil
}

// ---------- Gemini Question Generation ----------

// GeneratedQuestion is the struct returned by GenerateQuestions.
type GeneratedQuestion struct {
	Type        string   `json:"type"`
	Prompt      string   `json:"prompt"`
	Options     []string `json:"options"`
	Answer      string   `json:"answer"`
	Explanation string   `json:"explanation"`
	Difficulty  string   `json:"difficulty"`
}

// GenerateQuestions calls the Gemini 1.5 Flash API to produce MCQ questions.
func GenerateQuestions(topic, difficulty string, count int, excludePrompts []string) ([]GeneratedQuestion, error) {
	// 1. Read API key from environment
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Println("[AI] CRITICAL: GEMINI_API_KEY is not set in environment")
		return nil, fmt.Errorf("GEMINI_API_KEY not found in environment")
	}

	log.Printf("[AI] Start: topic=%s difficulty=%s count=%d", topic, difficulty, count)

	// 2. Format subtopic variety guidance
	topicLower := strings.ToLower(topic)
	varietyGuidance := ""
	switch {
	case strings.Contains(topicLower, "dbms") || strings.Contains(topicLower, "database"):
		varietyGuidance = "Cover: normalization, indexing, joins, transactions, ACID, keys, clustered/non-clustered index, query output, isolation levels."
	case strings.Contains(topicLower, "dsa") || strings.Contains(topicLower, "algorithm") || strings.Contains(topicLower, "data structure"):
		varietyGuidance = "Cover: arrays, stacks, queues, trees, graphs, sorting, recursion, DP, hashing, complexity."
	case strings.Contains(topicLower, "os") || strings.Contains(topicLower, "operating"):
		varietyGuidance = "Cover: processes, threads, scheduling, deadlock, paging, memory, synchronization, semaphores."
	case strings.Contains(topicLower, "js") || strings.Contains(topicLower, "javascript"):
		varietyGuidance = "Cover: closures, async/await, event loop, hoisting, promises, scope, DOM, prototypes."
	case strings.Contains(topicLower, "aptitude") || strings.Contains(topicLower, "math"):
		varietyGuidance = "Cover: probability, percentages, ratios, time-speed-distance, permutations, logic."
	}

	excludeText := ""
	if len(excludePrompts) > 0 {
		excludeText = fmt.Sprintf("\nIMPORTANT: DO NOT generate questions similar to these existing prompts: %s", strings.Join(excludePrompts, " | "))
	}

	// 3. Build the strict prompt
	prompt := fmt.Sprintf(`Generate EXACTLY %d MCQ questions for topic: %s, difficulty: %s.
%s

Return ONLY JSON array:
[
  {
    "type": "mcq",
    "prompt": "Question text here (clear and technical)",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of the correct option (must match one of the options)",
    "explanation": "Brief technical explanation",
    "difficulty": "%s"
  }
]

Rules:
- Generate diverse questions covering different subtopics.
- Do not repeat the same concept phrased differently.
- No markdown formatting.
- No text outside JSON.
- No `+"`"+`json code fences.%s`, count, topic, difficulty, varietyGuidance, difficulty, excludeText)

	// 3. Build the Gemini API request payload
	type Part struct {
		Text string `json:"text"`
	}
	type Content struct {
		Parts []Part `json:"parts"`
	}
	type RequestBody struct {
		Contents []Content `json:"contents"`
	}

	reqBody := RequestBody{
		Contents: []Content{
			{Parts: []Part{{Text: prompt}}},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// 4. POST to gemini-2.5-flash with 30s timeout
	// Verifying availability: gemini-2.5-flash is the stable multimodal model in this environment.
	url := fmt.Sprintf(
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s",
		apiKey,
	)

	// Diagnostic masking: log first 4 and last 4 of key
	maskedKey := "EMPTY"
	if len(apiKey) > 8 {
		maskedKey = apiKey[:4] + "...." + apiKey[len(apiKey)-4:]
	}
	log.Printf("[AI] Calling Gemini v1beta: model=gemini-2.5-flash target_count=%d key=%s", count, maskedKey)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("[AI] ERROR: Network request failed: %v", err)
		return nil, fmt.Errorf("gemini network error: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("[AI] ERROR: Gemini API returned status %d. URL used: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", resp.StatusCode)
		return nil, fmt.Errorf("gemini API error: status %d", resp.StatusCode)
	}

	// 5. Decode the Gemini response envelope
	type GeminiResponse struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	var geminiResp GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		log.Printf("[AI] ERROR: Failed to decode response body: %v", err)
		return nil, fmt.Errorf("gemini decode error: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		log.Println("[AI] ERROR: Empty candidates in Gemini response")
		return nil, fmt.Errorf("gemini returned empty response")
	}

	rawText := geminiResp.Candidates[0].Content.Parts[0].Text
	log.Printf("[AI] Raw response received. Length: %d bytes", len(rawText))

	// 6. Clean and extract JSON from the raw text
	cleaned := cleanGeminiResponse(rawText)
	log.Printf("[AI] Cleaned JSON length: %d bytes", len(cleaned))

	// 7. Parse into []GeneratedQuestion
	var rawQuestions []GeneratedQuestion
	if err := json.Unmarshal([]byte(cleaned), &rawQuestions); err != nil {
		log.Printf("[AI ERROR] Failed to unmarshal JSON: %v | Raw start: %.100s", err, cleaned)
		return nil, fmt.Errorf("AI generation failed: could not parse response")
	}

	// 8. Safely Filter & Validate
	var questions []GeneratedQuestion
	for _, q := range rawQuestions {
		if q.Prompt == "" || len(q.Options) < 2 || q.Answer == "" {
			log.Printf("[AI SKIP] Dropping malformed question: prompt_len=%d options=%d", len(q.Prompt), len(q.Options))
			continue
		}
		questions = append(questions, q)
	}

	log.Printf("[AI] Generation Summary | Requested: %d | AI Returned: %d | Validated: %d", count, len(rawQuestions), len(questions))
	return questions, nil
}

// SummarizeNotes generates a concise technical summary of the provided text.
func SummarizeNotes(text string) (string, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY not found")
	}

	prompt := fmt.Sprintf(`Summarize the following technical notes. Focus on key concepts, definitions, and architectural details. 
Keep it concise but detailed enough to generate technical quiz questions later.
Notes Content:
%s`, text)

	type Part struct{ Text string `json:"text"` }
	type Content struct{ Parts []Part `json:"parts"` }
	type RequestBody struct{ Contents []Content `json:"contents"` }

	reqBody := RequestBody{Contents: []Content{{Parts: []Part{{Text: prompt}}}}}
	jsonData, _ := json.Marshal(reqBody)

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", apiKey)
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		log.Printf("[AI] Gemini Summary Error: %d | Body: %s", resp.StatusCode, string(body))
		return "", fmt.Errorf("gemini API error: %d", resp.StatusCode)
	}

	log.Printf("[AI] Gemini Summary Raw Body: %.200s", string(body))

	var result struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}


	if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty response from gemini")
	}

	return result.Candidates[0].Content.Parts[0].Text, nil
}

// GenerateQuestionsFromNotes derives MCQ questions from a technical summary.
func GenerateQuestionsFromNotes(summary string, count int, difficulty string) ([]GeneratedQuestion, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not found")
	}

	prompt := fmt.Sprintf(`Based on the technical summary below, generate EXACTLY %d MCQ questions. 
Difficulty: %s

Summary Context:
%s

Return ONLY a JSON array of objects:
[
  {
    "type": "mcq",
    "prompt": "Question text...",
    "options": ["A", "B", "C", "D"],
    "answer": "Correct option text",
    "explanation": "Reasoning...",
    "difficulty": "%s"
  }
]
Do not use markdown code fences.`, count, difficulty, summary, difficulty)

	type Part struct{ Text string `json:"text"` }
	type Content struct{ Parts []Part `json:"parts"` }
	type RequestBody struct{ Contents []Content `json:"contents"` }

	reqBody := RequestBody{Contents: []Content{{Parts: []Part{{Text: prompt}}}}}
	jsonData, _ := json.Marshal(reqBody)

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s", apiKey)
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Candidates) == 0 || len(result.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty response from gemini")
	}

	rawText := result.Candidates[0].Content.Parts[0].Text
	cleaned := cleanGeminiResponse(rawText)

	var questions []GeneratedQuestion
	if err := json.Unmarshal([]byte(cleaned), &questions); err != nil {
		return nil, fmt.Errorf("failed to parse AI questions: %w", err)
	}

	return questions, nil
}

// cleanGeminiResponse strips markdown fences and extracts the JSON array.
func cleanGeminiResponse(raw string) string {
	raw = strings.TrimSpace(raw)
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	raw = strings.TrimSpace(raw)

	first := strings.Index(raw, "[")
	last := strings.LastIndex(raw, "]")
	if first != -1 && last != -1 && last > first {
		return raw[first : last+1]
	}
	return raw
}

