package models

import (
	"time"
)

// ──────────────────────────────────────────────
// Topic — a category/subject grouping for tests
// Created by admins to organise tests.
// ──────────────────────────────────────────────
type Topic struct {
	ID          string    `gorm:"primaryKey;column:id" json:"id"`
	Name        string    `gorm:"unique;column:name" json:"name"`
	Slug        string    `gorm:"unique;column:slug" json:"slug"`
	Description string    `gorm:"column:description" json:"description"`
	CreatedBy   string    `gorm:"column:createdBy" json:"createdBy"`
	CreatedAt   time.Time `gorm:"column:createdAt;autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt;autoUpdateTime" json:"updatedAt"`

	Creator User   `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
	Tests   []Test `gorm:"foreignKey:TopicID" json:"tests,omitempty"`
}

func (Topic) TableName() string {
	return "topics"
}
