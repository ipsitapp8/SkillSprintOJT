package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID           string    `gorm:"primaryKey;column:id" json:"id"`
	Email        string    `gorm:"unique;column:email" json:"email"`
	Password     string    `gorm:"column:password" json:"-"`
	Username     string    `gorm:"column:username" json:"username"`
	Role         string    `gorm:"column:role;default:user" json:"role"`
	AuthProvider string    `gorm:"column:authProvider;default:local" json:"authProvider"`
	GoogleID     string    `gorm:"column:googleId" json:"-"`
	AvatarURL    string    `gorm:"column:avatarUrl" json:"avatarUrl,omitempty"`
	CreatedAt    time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt    time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

func (User) TableName() string {
	return "user"
}

func main() {
	db, err := gorm.Open(sqlite.Open("../dev.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte("password123"), 10)
	if err != nil {
		panic("failed to hash password")
	}

	user := User{
		ID:           uuid.New().String(),
		Email:        "harshit3156@polaris.com",
		Username:     "harshit3156",
		Password:     string(hashed),
		Role:         "admin",
		AuthProvider: "local",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	result := db.Create(&user)
	if result.Error != nil {
		fmt.Println("Error creating user:", result.Error)
	} else {
		fmt.Println("User created successfully with password: password123")
	}
}
