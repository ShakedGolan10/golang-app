package config

import (
	"fmt"
	"os"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	JWTSecret  string
	ServerPort string
}

func LoadConfig() Config {
	config := Config{
		DBHost:     getEnv("DB_HOST", "mysql_db"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", "secret"),
		DBName:     getEnv("DB_NAME", "apptimus-db"),
		JWTSecret:  getEnv("JWT_SECRET", "mysecretkey"),
		ServerPort: "8080",
	}

	fmt.Printf("***** DB Connection Details: %s:%s (DB: %s)\n", config.DBHost, config.DBPort, config.DBName)

	return config
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	fmt.Printf("⚠️  Warning: Environment variable %s not found, using default: %s\n", key, defaultVal)
	return defaultVal
}
