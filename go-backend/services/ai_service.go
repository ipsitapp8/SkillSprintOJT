package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type AIResponse struct {
	Score                 int    `json:"score"`
	IsCorrect             bool   `json:"isCorrect"`
	Feedback              string `json:"feedback"`
	Explanation           string `json:"explanation"`
	ImprovementSuggestion string `json:"improvementSuggestion"`
}

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
