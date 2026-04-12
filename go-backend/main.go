package main

import (
	"log"

	"backend/database"
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	r := gin.Default()

	// Setup CORS to allow Next.js proxying requests
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Note: We mount to /api to match Next.js routes
	api := r.Group("/api")

	// Auth Routes
	auth := api.Group("/auth")
	{
		auth.POST("/login", handlers.LoginHandler)
		auth.POST("/signup", handlers.SignupHandler)
		auth.POST("/logout", handlers.LogoutHandler)

		// Protected me route
		auth.GET("/me", middleware.JWTMiddleware(), handlers.MeHandler)
	}

	// Public Arena Routes
	api.GET("/arenas", handlers.GetArenas)
	api.GET("/arenas/:id", handlers.GetArenaDetail)
	api.GET("/arenas/:id/quizzes", handlers.GetArenaQuizzes)
	api.GET("/quizzes/:quizId/questions", handlers.GetQuizQuestions)

	// Leaderboard Route
	api.GET("/attempts/leaderboard", handlers.GetLeaderboard)

	// Protected Routes (Attempts & Evaluation)
	protected := api.Group("/")
	protected.Use(middleware.JWTMiddleware())
	{
		protected.POST("/attempts", handlers.SubmitAttempt)
		protected.GET("/attempts/:id", handlers.GetAttemptResult)
		protected.POST("/evaluate-answer", handlers.EvaluateAnswer)
		protected.POST("/training/verify", handlers.VerifyAnswer)
		protected.POST("/training/generate", handlers.GenerateTrainingSession)
	}

	log.Println("Starting Gin server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
