package routes

import (
	"mybackend/controllers"
	middlewares "mybackend/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App, jwtSecret string) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:8080",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Authorization, Content-Type, Accept, Origin",
	}))

	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)

	protected := app.Group("/api/protected")

	protected.Use(middlewares.AuthMiddleware(jwtSecret))
	protected.Use(middlewares.ExtractUserID())

	protected.Get("/posts", controllers.GetAllPosts)
	protected.Get("/posts/:id", controllers.GetSinglePost)
	protected.Post("/posts", controllers.CreatePost)
	protected.Put("/posts/:id", controllers.UpdatePost)

	protected.Get("/users", controllers.GetAllUsers)
	protected.Get("/users/:id", controllers.GetUser)
	protected.Delete("/users/:id", controllers.DeleteUser)
}
