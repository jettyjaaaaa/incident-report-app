package main

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"incident-report-app/backend/internal/config"
	"incident-report-app/backend/internal/db"
	"incident-report-app/backend/internal/handler"
	"incident-report-app/backend/internal/middleware"
	"incident-report-app/backend/internal/repository"
	"incident-report-app/backend/internal/service"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()
	if cfg.DBUrl == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if cfg.CorsOrigin == "" {
		cfg.CorsOrigin = "*"
	}

	pool := db.NewPostgresPool(cfg.DBUrl)
	defer pool.Close()

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(requestLogger())
	r.Use(middleware.CORSMiddleware(cfg.CorsOrigin))

	incidentRepo := repository.NewIncidentRepository(pool)
	incidentSvc := service.NewIncidentService(incidentRepo)
	incidentHandler := handler.NewIncidentHandler(incidentSvc)

	incidentHandler.Register(r)

	port := cfg.Port
	log.Println("✅ API listening on :" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		c.Next()

		status := c.Writer.Status()
		lat := time.Since(start)

		log.Printf("%s %s -> %d (%s)", method, path, status, lat)
	}
}
