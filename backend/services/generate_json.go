package services

import (
	"encoding/json"
	"log"
	"os"

	"mybackend/database"
	"mybackend/models"
)

const (
	postsJSONFile = "/app/public/data/posts.json"
	usersJSONFile = "/app/public/data/users.json"
)

func GeneratePostsJSON() error {
	var posts []models.Post
	if err := database.DB.Find(&posts).Error; err != nil {
		log.Printf("❌ Error fetching posts from DB: %v", err)
		return err
	}

	data, err := json.MarshalIndent(posts, "", "  ")
	if err != nil {
		log.Printf("❌ Error marshalling posts JSON: %v", err)
		return err
	}

	err = os.WriteFile(postsJSONFile, data, 0644)
	if err != nil {
		log.Printf("❌ Error writing posts JSON file: %v", err)
		return err
	}

	log.Println("✅ Successfully generated posts.json")
	return nil
}

func GenerateUsersJSON() error {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		log.Printf("❌ Error fetching users from DB: %v", err)
		return err
	}

	data, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		log.Printf("❌ Error marshalling users JSON: %v", err)
		return err
	}

	err = os.WriteFile(usersJSONFile, data, 0644)
	if err != nil {
		log.Printf("❌ Error writing users JSON file: %v", err)
		return err
	}

	log.Println("✅ Successfully generated users.json")
	return nil
}
