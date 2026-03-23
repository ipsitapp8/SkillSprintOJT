package models

import (
	"time"
)

type User struct {
	ID        string    `gorm:"primaryKey;column:id" json:"id"`
	Email     string    `gorm:"unique;column:email" json:"email"`
	Password  string    `gorm:"column:password" json:"-"`
	CreatedAt time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`
}

// Ensure the table name exactly matches what's in dev.db
// The route.ts used "user" instead of "users" or "User". Gorm will use the method TableName()
func (User) TableName() string {
	return "user"
}
