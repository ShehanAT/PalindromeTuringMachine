package frontend

import (
	"fmt"
	"html/template"

	"net/http"
	"os"
	"time"

	"database/sql"
	"log"

	gintemplate "github.com/foolin/gin-template"
	"github.com/gin-gonic/gin"

	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
)

type CreateRuleInput struct {
	StateValue string `form:"stateValue" binding: "required"`
	ReadValue  string `form:"readValue" binding: "required"`
	NextValue  string `form:"nextValue" binding: "required"`
	WriteValue string `form:"writeValue" binding: "required"`
	MoveValue  string `form:"moveValue" binding: "required"`
}

func RenderFrontend() {
	r := gin.Default()

	workingDir, workingDirErr := os.Getwd()

	if workingDirErr != nil {
		fmt.Print(workingDirErr)
	}

	dbmap := initDb()
	defer dbmap.Db.Close()

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
		var rules []Rule
		_, err := dbmap.Select(&rules, "select * from rules order by rule_id")
		checkErr(err, "Select failed")
		log.Println("All rows:")
		var currentRules []CreateRuleInput
		for _, p := range rules {
			rule := CreateRuleInput{
				StateValue: p.StateValue,
				MoveValue:  p.MoveValue,
				ReadValue:  p.ReadValue,
				WriteValue: p.WriteValue,
				NextValue:  p.NextValue,
			}
			currentRules = append(currentRules, rule)
		}
		gintemplate.HTML(ctx, http.StatusOK, "index", gin.H{
			"title": "Coding Informer",
			"rules": currentRules,
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
		r1 := newRule(createRules.StateValue, createRules.ReadValue, createRules.WriteValue, createRules.MoveValue, createRules.NextValue)

		ruleErr := dbmap.Insert(&r1)
		checkErr(ruleErr, "Rule Insert failed")

		ctx.Redirect(http.StatusFound, "/")
	})

	r.GET("/add-one-to-binary-num", func(ctx *gin.Context) {
		gintemplate.HTML(ctx, http.StatusOK, "partials/add-one-to-binary-num.html", gin.H{})
	})

	r.GET("/css-turing-machine", func(ctx *gin.Context) {
		gintemplate.HTML(ctx, http.StatusOK, "partials/css-turing-machine.html", gin.H{})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}

type Rule struct {
	// Db tag lets you specify the column name if it differs from the struct field
	Id int64 `db:"rule_id"`

	StateValue string `db:"state_value"`
	ReadValue  string `db:"read_value"`
	NextValue  string `db:"next_value"`
	WriteValue string `db:"write_value"`
	MoveValue  string `db:"move_value"`
}

func newRule(stateValue, readValue, writeValue, moveValue, nextValue string) Rule {
	return Rule{
		StateValue: stateValue,
		ReadValue:  readValue,
		NextValue:  nextValue,
		WriteValue: writeValue,
		MoveValue:  moveValue,
	}
}

func initDb() *gorp.DbMap {
	// Connect to db using standard Go database/sql API
	// Use whatever database/sql driver you wish
	db, err := sql.Open("sqlite3", "tmp/rules_db.bin")
	checkErr(err, "sql.Open failed")

	// Construct a gorp DbMap
	dbmap := &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}

	// Add a table, setting the table name to 'posts' and
	// specifying that the Id property is an auto incrementing PK
	dbmap.AddTableWithName(Rule{}, "rules").SetKeys(true, "Id")

	// Create the table. In a production system you'd generally
	// Use a migration tool, or create the tables via scripts
	err = dbmap.CreateTablesIfNotExists()
	checkErr(err, "Create tables failed")

	return dbmap
}

func checkErr(err error, msg string) {
	if err != nil {
		log.Fatalln(msg, err)
	}
}

func main() {

}
