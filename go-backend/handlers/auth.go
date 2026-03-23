package handlers

import (
	"net/http"
	"time"

	"backend/database"
	"backend/middleware"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials. Please sign up first."})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate JWT
	expirationTime := time.Now().Add(7 * 24 * time.Hour)
	claims := &middleware.SessionPayload{
		ID:    user.ID,
		Email: user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(middleware.JWT_SECRET)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Error"})
		return
	}

	// Set Cookie matching Next.js cookie settings
	c.SetCookie("auth_token", tokenString, int(7*24*time.Hour/time.Second), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"id":    user.ID,
		"email": user.Email,
	})
}

// SignupHandler implements basic signup if necessary
func SignupHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username/Email and password are required"})
		return
	}

	var existingUser models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	newUser := models.User{
		ID:       uuid.New().String(),
		Email:    req.Email,
		Password: string(hashed),
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

func MeHandler(c *gin.Context) {
	userId, _ := c.Get("userID")
	userEmail, _ := c.Get("userEmail")

	// You could optionally do a DB lookup here, but decoding JWT is usually enough
	c.JSON(http.StatusOK, gin.H{
		"id":    userId,
		"email": userEmail,
	})
}

func LogoutHandler(c *gin.Context) {
	// Erase cookie
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"success": true})
}
