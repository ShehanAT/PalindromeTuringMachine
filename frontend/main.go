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

// func formatAsDate(t time.Time) string {
// 	year, month, day := t.Date()
// 	return fmt.Sprintf("%d/%02d/%02d", year, month, day)
// }

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

	// r.Delims("{[{", "}]}")
	// workingDirPath, err := os.Getwd()

	// if err != nil {
	// 	fmt.Println(err)
	// }

	// r.LoadHTMLFiles(workingDirPath + "\\frontend\\templates\\index.tmpl")
	// r.LoadHTMLGlob(workingDirPath + "\\frontend\\templates\\**\\*.tmpl")
	// r.LoadHTMLGlob(workingDirPath + "\\frontend\\templates\\*.tmpl")

	// r.Static("/assets", "./assets")

	r.GET("/", func(ctx *gin.Context) {
		// c.HTML(http.StatusOK, "index.tmpl", gin.H{
		// 	"now":            time.Date(2022, 010, 006, 0, 0, 0, 0, time.UTC),
		// 	"workingDirPath": workingDirPath,
		// })
		gintemplate.HTML(ctx, http.StatusOK, "index", gin.H{
			"title": "Turing Machine on the Web!",
		})
	})

	r.GET("/create-rules", func(ctx *gin.Context) {
		// c.HTML(http.StatusOK, "index.tmpl", gin.H{
		// 	"now":            time.Date(2022, 010, 006, 0, 0, 0, 0, time.UTC),
		// 	"workingDirPath": workingDirPath,
		// })
		gintemplate.HTML(ctx, http.StatusOK, "partials/create-rules", gin.H{
			"title": "Create Rules Page",
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}
