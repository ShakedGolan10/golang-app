package middlewares

import (
	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/jwt/v3"
	jwt "github.com/golang-jwt/jwt/v4"
)

func AuthMiddleware(jwtSecret string) fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey:   []byte(jwtSecret),
		ContextKey:   "user",
		TokenLookup:  "cookie:jwt",
		AuthScheme:   "Bearer",
		ErrorHandler: jwtError,
	})
}

func ExtractUserID() fiber.Handler {
	return func(c *fiber.Ctx) error {

		userToken, ok := c.Locals("user").(*jwt.Token)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token format"})
		}

		claims, ok := userToken.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "user_id not found in token claims"})
		}

		c.Locals("user", uint(userIDFloat))

		return c.Next()
	}
}

func jwtError(c *fiber.Ctx, err error) error {
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "Unauthorized or invalid token",
	})
}
