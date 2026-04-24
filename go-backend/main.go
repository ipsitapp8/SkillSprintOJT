package main

import (
	"log"

	"backend/arena"
	"backend/database"
	"backend/handlers"
	"backend/leaderboard"
	"backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	// Start leaderboard WebSocket hub
	hub := leaderboard.NewHub()
	handlers.LeaderboardHub = hub

	// Start arena session WebSocket hub
	arenaHub := arena.NewSessionHub()
	handlers.ArenaSessionHub = arenaHub

	// Start background auto-submit watcher for expired attempts
	handlers.StartAutoSubmitWatcher()

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
		auth.POST("/google", handlers.GoogleLoginHandler)
		auth.POST("/logout", handlers.LogoutHandler)

		// Protected me route
		auth.GET("/me", middleware.JWTMiddleware(), handlers.MeHandler)
	}

	// Public Arena Routes
	api.GET("/arenas", handlers.GetArenas)
	api.GET("/arenas/:id", handlers.GetArenaDetail)
	api.GET("/arenas/:id/quizzes", handlers.GetArenaQuizzes)
	api.GET("/quizzes/:quizId/questions", handlers.GetQuizQuestions)

	// Leaderboard Routes
	api.GET("/attempts/leaderboard", handlers.GetLeaderboard)
	api.GET("/leaderboard/global", handlers.GetGlobalLeaderboard)

	// Public Topics (for Arena)
	api.GET("/topics", handlers.ListPublicTopics)
	api.GET("/topics/:slug/tests", handlers.ListPublicTestsByTopic)

	// Protected Routes (Attempts & Evaluation)
	protected := api.Group("/")
	protected.Use(middleware.JWTMiddleware())
	{
		protected.POST("/attempts", handlers.SubmitAttempt)
		protected.GET("/attempts/:id", handlers.GetAttemptResult)
		protected.POST("/evaluate-answer", handlers.EvaluateAnswer)
		protected.POST("/training/verify", handlers.VerifyAnswer)
		protected.POST("/training/generate", handlers.GenerateTrainingSession)

		// User dashboard & results
		protected.GET("/dashboard/stats", handlers.GetUserDashboardStats)
		protected.GET("/dashboard/full", handlers.GetUserDashboardFull)
		protected.GET("/results", handlers.ListUserResults)
		protected.GET("/results/:attemptId", handlers.GetTestResult)
	}

	// Admin Routes (JWT + Admin role required)
	admin := api.Group("/admin")
	admin.Use(middleware.JWTMiddleware())
	admin.Use(middleware.AdminOnly())
	{
		// Topic CRUD
		admin.POST("/topics", handlers.CreateTopic)
		admin.GET("/topics", handlers.ListTopics)
		admin.PUT("/topics/:id", handlers.UpdateTopic)
		admin.DELETE("/topics/:id", handlers.DeleteTopic)

		// Test CRUD
		admin.POST("/tests", handlers.CreateTest)
		admin.GET("/tests", handlers.ListTests)
		admin.GET("/tests/:id", handlers.GetTestDetail)
		admin.PUT("/tests/:id", handlers.UpdateTest)
		admin.DELETE("/tests/:id", handlers.DeleteTest)
		admin.PATCH("/tests/:id/publish", handlers.PublishTest)
		admin.PATCH("/tests/:id/activate", handlers.ActivateTest)

		// Question management
		admin.POST("/tests/:id/questions", handlers.AddQuestion)
		admin.GET("/tests/:id/questions", handlers.ListQuestions)
		admin.PUT("/questions/:id", handlers.UpdateQuestion)
		admin.DELETE("/questions/:id", handlers.DeleteQuestion)

		// Testcase management
		admin.POST("/questions/:id/testcases", handlers.AddTestcase)
		admin.DELETE("/testcases/:id", handlers.DeleteTestcase)

		// Dashboard analytics
		admin.GET("/dashboard/stats", handlers.GetAdminDashboardStats)
		admin.GET("/dashboard/recent", handlers.GetRecentActivity)
	}

	// Arena Test Routes (JWT required)
	arena := api.Group("/arena")
	arena.Use(middleware.JWTMiddleware())
	{
		arena.GET("/active", handlers.GetActiveTest)
		arena.GET("/tests", handlers.ListPublishedTests)
		arena.GET("/languages", handlers.GetLanguages)
		arena.POST("/tests/:id/join", handlers.JoinTest)
		arena.GET("/attempts/:id", handlers.GetTestAttempt)
		arena.POST("/submissions/mcq", handlers.SaveMCQ)
		arena.POST("/submissions/run", handlers.RunCode)
		arena.POST("/submissions/code", handlers.SubmitCode)
		arena.POST("/submissions/draft", handlers.SaveDraft)
		arena.POST("/attempts/:id/submit", handlers.SubmitTestAttempt)
		arena.GET("/attempts/:id/status", handlers.GetAttemptStatus)
	}

	// Leaderboard Routes
	api.GET("/leaderboard/:testId", handlers.GetTestLeaderboard)

	// WebSocket route (outside /api — no JSON middleware needed)
	r.GET("/ws/leaderboard/:testId", handlers.LeaderboardWS)
	r.GET("/ws/arena/:attemptId", handlers.ArenaSessionWS)

	log.Println("Starting Gin server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
