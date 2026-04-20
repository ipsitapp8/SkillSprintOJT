package main

import (
	"log"

	"backend/database"
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("[ENV] No .env file found, using system environment variables")
	} else {
		log.Println("[ENV] Successfully loaded configuration from .env")
	}

	database.ConnectDB()

	r := gin.Default()

	// Setup CORS to allow Next.js proxying requests
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	r.Use(cors.New(config))

	api := r.Group("/api")
	
	// Administrative Utility
	api.GET("/admin/reload-env", func(c *gin.Context) {
		godotenv.Load()
		c.JSON(200, gin.H{"status": "Neural Configuration Refreshed"})
	})

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

	// Training Session (serves real DB-backed questions)
	api.POST("/train/session", handlers.CreateTrainSession)
	api.GET("/train/session/:id", handlers.GetTrainSessionDetail)

	// Protected Routes (Attempts & Evaluation)
	protected := api.Group("/")
	protected.Use(middleware.JWTMiddleware())
	{
		protected.POST("/attempts", handlers.SubmitAttempt)
		protected.GET("/attempts/:id", handlers.GetAttemptResult)
		protected.POST("/evaluate-answer", handlers.EvaluateAnswer)
		protected.POST("/training/verify", handlers.VerifyAnswer)
		protected.POST("/training/generate", handlers.GenerateTrainingSession)
		protected.GET("/training/session/:id", handlers.GetTrainingSession)
	}

	log.Println("Starting Gin server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
