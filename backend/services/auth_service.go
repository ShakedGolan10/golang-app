package services

import (
	"time"

	"mybackend/config"

	jwt "github.com/golang-jwt/jwt/v4"
)

func GenerateToken(cfg config.Config, userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(), // 1 day
		"iat":     time.Now().Unix(),
		"iss":     "mybackend-fiber",
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}
