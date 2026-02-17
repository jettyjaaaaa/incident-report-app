package model

import "time"

type Incident struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
	Category string `json:"category"`
	Status string `json:"status"`
	CreatedBy string `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	DeletedBy *string `json:"deleted_by,omitempty"`
}