package controllers

import (
	"strconv"

	"mybackend/database"
	"mybackend/models"
	"mybackend/services"

	"github.com/gofiber/fiber/v2"
)

type CreatePostInput struct {
	Title string `json:"title" validate:"required"`
	Body  string `json:"body" validate:"required"`
}

func CreatePost(c *fiber.Ctx) error {
	userID, ok := c.Locals("user").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var input CreatePostInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := validate.Struct(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": formatValidationError(err)})
	}

	post := models.Post{
		Title:    input.Title,
		Body:     input.Body,
		AuthorID: uint(userID),
	}

	if err := database.DB.Create(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Post created",
		"post":    post,
	})
}

func UpdatePost(c *fiber.Ctx) error {
	currentUserID, ok := c.Locals("user").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	postIDParam := c.Params("id")
	postID, err := strconv.ParseUint(postIDParam, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	if post.AuthorID != currentUserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "You do not have permission to edit this post"})
	}

	var input CreatePostInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := validate.Struct(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": formatValidationError(err)})
	}

	post.Title = input.Title
	post.Body = input.Body

	if err := database.DB.Save(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Post updated",
		"post":    post,
	})
}

func GetAllPosts(c *fiber.Ctx) error {
	var posts []models.Post
	if err := database.DB.Find(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"posts": posts})
}

func GetSinglePost(c *fiber.Ctx) error {
	postIDParam := c.Params("id")
	postID, err := strconv.ParseUint(postIDParam, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Post not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"post": post})
}
