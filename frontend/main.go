package frontend

import (
	"fmt"
	"net/http"
	"os"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
)

func formatAsDate(t time.Time) string {
	year, month, day := t.Date()
	return fmt.Sprintf("%d/%02d/%02d", year, month, day)
}

func ShowIndexPage() {
	r := gin.Default()
	r.Delims("{[{", "}]}")
	workingDirPath, err := os.Getwd()

	if err != nil {
		fmt.Println(err)
	}
	r.SetFuncMap(template.FuncMap{
		"formatAsDate": formatAsDate,
	})

	// r.LoadHTMLFiles(workingDirPath + "\\frontend\\templates\\index.tmpl")
	r.LoadHTMLGlob(workingDirPath + "\\frontend\\templates\\**\\*.tmpl")
	// r.LoadHTMLGlob(workingDirPath + "\\frontend\\templates\\*.tmpl")

	r.Static("/assets", "./assets")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"now":            time.Date(2022, 010, 006, 0, 0, 0, 0, time.UTC),
			"workingDirPath": workingDirPath,
		})

	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}
