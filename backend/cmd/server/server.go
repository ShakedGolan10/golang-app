package main

import (
	"fmt"
	"log"

	"mybackend/config"
	"mybackend/database"
	"mybackend/routes"
	"mybackend/services"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.LoadConfig()

	database.ConnectDB(cfg)

	database.Migrate()

	app := fiber.New()

	routes.SetupRoutes(app, cfg.JWTSecret)

	services.GeneratePostsJSON()
	services.GenerateUsersJSON()

	address := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server running on port %s\n", cfg.ServerPort)
	if err := app.Listen(address); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
