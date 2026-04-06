package database

import (
	"backend/models"
	"log"
	"time"

	"github.com/google/uuid"
)

func SeedDB() {
	var count int64
	DB.Model(&models.Arena{}).Count(&count)
	if count > 0 {
		return // Data already exists
	}

	log.Println("Seeding initial Arena data...")

	// Categories
	cyberCat := models.QuizCategory{ID: uuid.New().String(), Name: "Cyber Security", Slug: "cyber-security"}
	codingCat := models.QuizCategory{ID: uuid.New().String(), Name: "Programming", Slug: "programming"}
	DB.Create(&cyberCat)
	DB.Create(&codingCat)

	// Arenas
	arena1 := models.Arena{
		ID:              uuid.New().String(),
		Title:           "Cybersecurity Fundamentals",
		Slug:            "cybersecurity-fundamentals",
		CategoryID:      cyberCat.ID,
		Difficulty:      "Intermediate",
		Status:          "live",
		MaxPlayers:      1000,
		CurrentPlayers:  124,
		DurationSeconds: 600,
		Description:     "Test your knowledge of firewalls, encryption, and network threats.",
	}
	arena2 := models.Arena{
		ID:              uuid.New().String(),
		Title:           "Advanced Go Programming",
		Slug:            "advanced-go",
		CategoryID:      codingCat.ID,
		Difficulty:      "Hard",
		Status:          "open",
		MaxPlayers:      500,
		CurrentPlayers:  45,
		DurationSeconds: 900,
		Description:     "Prove your mastery over Goroutines, Contexts, and Go syntax.",
	}
	DB.Create(&arena1)
	DB.Create(&arena2)

	// Quizzes
	q1 := models.Quiz{
		ID:         uuid.New().String(),
		Title:      "Network Defense",
		ArenaID:    arena1.ID,
		CategoryID: cyberCat.ID,
		Difficulty: "Intermediate",
		IsActive:   true,
	}
	q2 := models.Quiz{
		ID:         uuid.New().String(),
		Title:      "Go Concurrency",
		ArenaID:    arena2.ID,
		CategoryID: codingCat.ID,
		Difficulty: "Hard",
		IsActive:   true,
	}
	DB.Create(&q1)
	DB.Create(&q2)

	// Questions for Network Defense
	qn1 := models.Question{
		ID:            uuid.New().String(),
		QuizID:        q1.ID,
		Prompt:        "Which protocol is used for secure communication over a computer network?",
		Type:          "mcq",
		CorrectAnswer: "", // Handled by options
		Explanation:   "HTTPS is HTTP with encryption and verification.",
		MaxScore:      10,
	}
	DB.Create(&qn1)
	DB.Create(&models.Option{ID: uuid.New().String(), QuestionID: qn1.ID, Text: "HTTP", IsCorrect: false})
	DB.Create(&models.Option{ID: uuid.New().String(), QuestionID: qn1.ID, Text: "HTTPS", IsCorrect: true})
	DB.Create(&models.Option{ID: uuid.New().String(), QuestionID: qn1.ID, Text: "FTP", IsCorrect: false})
	DB.Create(&models.Option{ID: uuid.New().String(), QuestionID: qn1.ID, Text: "SMTP", IsCorrect: false})

	qn2 := models.Question{
		ID:            uuid.New().String(),
		QuizID:        q1.ID,
		Prompt:        "Explain how a SQL injection attack works.",
		Type:          "subjective",
		CorrectAnswer: "A SQL injection attack involves inserting unescaped user input into a database query. It allows the attacker to view, modify, or delete data unexpectedly.",
		Explanation:   "By manipulating input fields with SQL commands, attackers force the database to execute unintended instructions.",
		MaxScore:      20,
	}
	DB.Create(&qn2)

	// Need a dummy user for the attempt to not crash if foreign keys enabled
	dummyUser := models.User{
		ID:        uuid.New().String(),
		Email:     "dummy@skillsprint.io",
		Password:  "password",
		Username:  "RIVAL_X",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	DB.Create(&dummyUser)

	log.Println("Seed complete.")
}
