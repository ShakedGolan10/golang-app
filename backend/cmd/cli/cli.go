package main

import (
	"encoding/json"
	"log"
	"os"

	"mybackend/config"
	"mybackend/database"
	"mybackend/models"
)

func main() {
	cfg := config.LoadConfig()

	database.ConnectDB(cfg)

	var posts []models.Post
	if err := database.DB.Find(&posts).Error; err != nil {
		log.Fatalf("Failed to fetch posts: %v", err)
	}

	data, err := json.MarshalIndent(posts, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal posts: %v", err)
	}

	fileName := "static_posts.json"
	err = os.WriteFile(fileName, data, 0644)
	if err != nil {
		log.Fatalf("Failed to write file: %v", err)
	}

	log.Printf("Exported %d posts to %s\n", len(posts), fileName)

}
