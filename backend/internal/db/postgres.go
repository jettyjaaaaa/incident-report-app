package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPostgresPool(url string) *pgxpool.Pool {
	ctx := context.Background()

	pool, err := pgxpool.New(ctx, url)
	if err != nil {
		log.Fatal("Cannot connect db:", err)
	}
	return pool
}
