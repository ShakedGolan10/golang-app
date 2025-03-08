package services

import (
	"mybackend/database"
	"mybackend/models"
)

func DeletePostsByUserID(userID uint) error {
	if err := database.DB.Where("author_id = ?", userID).Delete(&models.Post{}).Error; err != nil {
		return err
	}
	return nil
}
