package main

import (
	// stands for the Format package
	"database/sql"
	"log"
	"time"

	// . "github.com/ShehanAT/TuringMachine/frontend"

	// "turing_machine"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
)

// func main() {

// 	dbmap := initDb()
// 	defer dbmap.Db.Close()

// 	ShowIndexPage()

// }

func main() {
	dbmap := initDb()
	defer dbmap.Db.Close()

	// delete any existing rows
	err := dbmap.TruncateTables()
	checkErr(err, "TruncateTables failed")

	// create two posts
	p1 := newPost("Go 1.1 released!", "Lorem ipsum lorem ipsum")
	p2 := newPost("Go 1.2 released!", "Lorem ipsum lorem ipsum")

	r1 := newRule("5", "3", "2", "6", "Left")
	r2 := newRule("6", "1", "7", "2", "Right")
	// insert rows - auto increment PKs will be set properly after the insert
	err = dbmap.Insert(&p1, &p2)
	checkErr(err, "Insert failed")

	ruleErr := dbmap.Insert(&r1, &r2)
	checkErr(ruleErr, "Rule Insert failed")

	// use convenience SelectInt
	count, err := dbmap.SelectInt("select count(*) from posts")
	checkErr(err, "select count(*) failed")
	log.Println("Rows after inserting:", count)

	// update a row
	p2.Title = "Go 1.2 is better than ever"
	count, err = dbmap.Update(&p2)
	checkErr(err, "Update failed")
	log.Println("Rows updated:", count)

	// fetch one row - note use of "post_id" instead of "Id" since column is aliased
	//
	// Postgres users should use $1 instead of ? placeholders
	// See 'Known Issues' below
	//
	err = dbmap.SelectOne(&p2, "select * from posts where post_id=?", p2.Id)
	checkErr(err, "SelectOne failed")
	log.Println("p2 row:", p2)

	// fetch all rows
	var posts []Post
	_, err = dbmap.Select(&posts, "select * from posts order by post_id")
	checkErr(err, "Select failed")
	log.Println("All rows:")
	for x, p := range posts {
		log.Printf("    %d: %v\n", x, p)
	}

	// fetch all rules
	var rules []Rule
	_, err = dbmap.Select(&rules, "select * from rules order by rule_id")
	checkErr(err, "Select failed")
	log.Println("All rows:")
	for x, p := range rules {
		log.Printf("    %d: %v\n", x, p)
	}

	// delete row by PK
	count, err = dbmap.Delete(&p1)
	checkErr(err, "Delete failed")
	log.Println("Rows deleted:", count)

	// delete row manually via Exec
	_, err = dbmap.Exec("delete from posts where post_id=?", p2.Id)
	checkErr(err, "Exec failed")

	// confirm count is zero
	count, err = dbmap.SelectInt("select count(*) from posts")
	checkErr(err, "select count(*) failed")
	log.Println("Row count - should be zero:", count)

	log.Println("Done!")
}

type Post struct {
	// db tag lets you specify the column name if it differs from the struct field
	Id      int64 `db:"post_id"`
	Created int64
	Title   string `db:",size:50"`               // Column size set to 50
	Body    string `db:"article_body,size:1024"` // Set both column name and size
}

type Rule struct {
	// Db tag lets you specify the column name if it differs from the struct field
	Id int64 `db:"rule_id"`
	// Title      string `db:",size:50"`
	StateValue string `db:",size:20"`
	ReadValue  string `db:",size:20"`
	NextValue  string `db:",size:20"`
	WriteValue string `db:",size:20"`
	MoveValue  string `db:",size:20"`
}

func newPost(title, body string) Post {
	return Post{
		Created: time.Now().UnixNano(),
		Title:   title,
		Body:    body,
	}
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
	dbmap.AddTableWithName(Post{}, "posts").SetKeys(true, "Id")

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
