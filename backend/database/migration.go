package database

import (
	"log"

	"mybackend/models"
)

func Migrate() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Post{},
	)
	if err != nil {
		log.Fatalf("Error migrating database: %v", err)
	}
	log.Println("Database migration completed.")
}
