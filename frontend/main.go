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

type CreateRuleInput struct {
	StateValue string `form:"stateValue" binding: "required"`
	ReadValue  string `form:"readValue" binding: "required"`
	NextValue  string `form:"nextValue" binding: "required"`
	WriteValue string `form:"writeValue" binding: "required"`
	MoveValue  string `form:"moveValue" binding: "required"`
}

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
		createRules := &CreateRuleInput{}
		ctx.Bind(createRules)
		fmt.Println(createRules.StateValue)
		fmt.Println(createRules.MoveValue)
		fmt.Println(createRules.NextValue)
		fmt.Println(createRules.ReadValue)
		fmt.Println(createRules.WriteValue)
		gintemplate.HTML(ctx, http.StatusOK, "partials/dashboard.html", gin.H{
			"createRules": createRules,
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}

func main() {
	// Initialize the DbMap

}
