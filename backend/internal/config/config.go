package config

import "os"

type Config struct {
	DBUrl string
	CorsOrigin string
	MaintenanceToken string
	Port string
}

func Load() *Config {
	return &Config{
		DBUrl: os.Getenv("DATABASE_URL"),
		CorsOrigin: os.Getenv("CORS_ORIGIN"),
		MaintenanceToken: os.Getenv("MAINTENANCE_SECRET"),
		Port: getEnv("PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	v := os.Getenv(key)
	if v == "" {
		return fallback
	}
	return v
}