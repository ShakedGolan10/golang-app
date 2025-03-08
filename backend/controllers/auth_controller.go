package controllers

import (
	"mybackend/config"
	"mybackend/database"
	"mybackend/models"
	"mybackend/services"
	
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

var validate = validator.New()

type RegisterInput struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func Register(c *fiber.Ctx) error {
	cfg := config.LoadConfig()
	var input RegisterInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := validate.Struct(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": formatValidationError(err)})
	}

	hashed, err := services.HashPassword(input.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error hashing password"})
	}

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashed,
	}

	if result := database.DB.Create(&user); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	token, err := services.GenerateToken(cfg, user.ID)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}
	
	services.GenerateUsersJSON()

	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
	})
}

func Login(c *fiber.Ctx) error {
	cfg := config.LoadConfig()

	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	if err := validate.Struct(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": formatValidationError(err)})
	}

	var user models.User
	result := database.DB.Where("email = ?", input.Email).First(&user)
	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password"})
	}

	token, err := services.GenerateToken(cfg, user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
		SameSite: "Lax",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
	})
}

func Auth(c *fiber.Ctx) error {
	userID := c.Locals("user")

	var user models.User
	result := database.DB.Where("id = ?", userID).First(&user)
	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Couldnt find user"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
	})
}

func Logout(c *fiber.Ctx) error {
    c.Cookie(&fiber.Cookie{
        Name:     "jwt",
        Value:    "",
        Expires:  time.Now().Add(-time.Hour),
        Path:     "/",
        Secure:   true,
        HTTPOnly: true,
        SameSite: "Lax",
    })

    c.Locals("user", nil)

    return c.Status(fiber.StatusOK).JSON(fiber.Map{
        "message": "Logged out successfully",
    })
}

func formatValidationError(err error) fiber.Map {
	errorsMap := fiber.Map{}
	if errs, ok := err.(validator.ValidationErrors); ok {
		for _, e := range errs {
			errorsMap[e.Field()] = "Invalid or missing value"
		}
	}
	return fiber.Map{"validation_errors": errorsMap}
}
