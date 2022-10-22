package frontend

import (
	"fmt"
	"html/template"
	"reflect"

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

	// delete any existing rows
	err := dbmap.TruncateTables()
	checkErr(err, "TruncateTables failed")

	// use convenience SelectInt
	// count, err := dbmap.SelectInt("select count(*) from posts")
	// checkErr(err, "select count(*) failed")
	// log.Println("Rows after inserting:", count)

	// checkErr(err, "Update failed")
	// log.Println("Rows updated:", count)

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
		_, err = dbmap.Select(&rules, "select * from rules order by rule_id")
		checkErr(err, "Select failed")
		log.Println("All rows:")
		var currentRules []CreateRuleInput
		for x, p := range rules {
			fmt.Println(p.StateValue)
			fmt.Println(p.MoveValue)
			fmt.Println(reflect.TypeOf(p))
			fmt.Println(x)
			rule := CreateRuleInput{
				StateValue: p.StateValue,
				MoveValue:  p.MoveValue,
				ReadValue:  p.ReadValue,
				WriteValue: p.WriteValue,
				NextValue:  p.NextValue,
			}
			currentRules = append(currentRules, rule)

			// fmt.Print("%v: %v\n", x, p)
		}
		gintemplate.HTML(ctx, http.StatusOK, "index", gin.H{
			"title": "Turing Machine on the Web!",
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
		fmt.Println(createRules.StateValue)
		fmt.Println(createRules.MoveValue)
		fmt.Println(createRules.NextValue)
		fmt.Println(createRules.ReadValue)
		fmt.Println(createRules.WriteValue)
		r1 := newRule(createRules.StateValue, createRules.ReadValue, createRules.WriteValue, createRules.MoveValue, createRules.NextValue)

		ruleErr := dbmap.Insert(&r1)
		checkErr(ruleErr, "Rule Insert failed")

		ctx.Redirect(http.StatusFound, "/")
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for Windows: "localhost:8080")
}

type Rule struct {
	// Db tag lets you specify the column name if it differs from the struct field
	Id int64 `db:"rule_id"`
	// Title      string `db:",size:50"`
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
