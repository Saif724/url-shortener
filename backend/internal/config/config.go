package config

import "os"

type Config struct {
	BaseURL   string
	DBURL     string
	RedisURL  string
	JWTSecret string
	Port      string
}

func mustEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		panic(key + " is required")
	}
	return val
}

func Load() Config {
	return Config{
		BaseURL:   mustEnv("BASE_URL"),
		DBURL:     mustEnv("DATABASE_URL"),
		RedisURL:  mustEnv("REDIS_URL"),
		JWTSecret: mustEnv("JWT_SECRET"),
		Port:      mustEnv("PORT"),
	}
}
