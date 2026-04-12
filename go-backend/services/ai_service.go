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

type GeneratedQuestion struct {
	Prompt        string   `json:"prompt"`
	Type          string   `json:"type"` // mcq, debug_code, fix_code, logic_explanation
	Options       []string `json:"options,omitempty"` // for mcq
	CorrectAnswer string   `json:"correctAnswer"`
	Explanation   string   `json:"explanation"`
	MaxScore      int      `json:"maxScore"`
}

func GenerateQuestions(topic, difficulty string, count int) ([]GeneratedQuestion, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// Mock fallback
		var questions []GeneratedQuestion
		for i := 0; i < count; i++ {
			questions = append(questions, GeneratedQuestion{
				Prompt:        fmt.Sprintf("Mock AI Question about %s (%d)", topic, i+1),
				Type:          "mcq",
				Options:       []string{"Opt A", "Opt B", "Opt C", "Opt D"},
				CorrectAnswer: "Opt A",
				Explanation:   "Mock explanation.",
				MaxScore:      10,
			})
		}
		return questions, nil
	}

	url := "https://api.openai.com/v1/chat/completions"
	prompt := fmt.Sprintf(`You are an expert technical interviewer.
Task: Generate %d high-quality, professional questions about '%s' for level '%s'.
Mixed Types: Provide a diverse mix of MCQ, code debugging, and logic explanation questions.

Output Format: Respond ONLY with a JSON object containing a "questions" array.
Each question must have:
- prompt: text
- type: one of [mcq, debug_code, fix_code, logic_explanation]
- options: array of strings (ONLY if type is mcq, otherwise empty)
- correctAnswer: string (For MCQ it's the exact text from options. For code it's the fixed code. For logic it's the summary.)
- explanation: educational reasoning
- maxScore: integer

Respond ONLY with valid JSON.`, count, topic, difficulty)

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

	var output struct {
		Questions []GeneratedQuestion `json:"questions"`
	}
	if err := json.Unmarshal([]byte(result.Choices[0].Message.Content), &output); err != nil {
		return nil, err
	}

	return output.Questions, nil
}
