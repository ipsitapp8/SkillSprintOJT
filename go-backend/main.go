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

	log.Println("Starting Gin server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
