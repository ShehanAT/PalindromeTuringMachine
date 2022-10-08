package frontend

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"time"

	gintemplate "github.com/foolin/gin-template"
	"github.com/gin-gonic/gin"
)

func ShowIndexPage() {
	r := gin.Default()

	workingDir, err := os.Getwd()

	if err != nil {
		fmt.Print(err)
	}

	r.HTMLRender = gintemplate.New(gintemplate.TemplateConfig{
		Root:      workingDir + "/frontend/templates",
		Extension: ".html",
		Master:    "index",
		Partials:  []string{"partials/dashboard"},
		Funcs: template.FuncMap{
			"copy": func() string {
				return time.Now().Format("2006")
			},
		},
		DisableCache: true,
	})

	r.GET("/", func(ctx *gin.Context) {
		gintemplate.HTML(ctx, http.StatusOK, "index", gin.H{
			"title": "Turing Machine on the Web!",
		})
	})

	r.GET("/create-rules", func(ctx *gin.Context) {
		gintemplate.HTML(ctx, http.StatusOK, "partials/create-rules.html", gin.H{
			"title": "Create Rules Page",
		})
	})

	r.POST("/create-rules", func(ctx *gin.Context) {
		fmt.Print(ctx)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}
