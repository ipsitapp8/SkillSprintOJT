package database

import (
	"log"

	"backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// Pointing to the Next.js SQLite database
	dsn := "../dev.db"
	database, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	// We only read from it, but if tables don't exist, this tries to migrate it based on the struct
	err = database.AutoMigrate(&models.User{})
	if err != nil {
		log.Println("Database migration error (ignoring if table already populated):", err)
	}

	DB = database
}
