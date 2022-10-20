package main

import (
	// stands for the Format package
	"database/sql"
	"fmt"
	"log"
	"time"

	. "github.com/ShehanAT/TuringMachine/frontend"

	// "turing_machine"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
)

func main() {

	dbmap := initDb()
	defer dbmap.Db.Close()
	fmt.Println("passing main")

	ShowIndexPage()
	// 	initAstilectron()

	// 	// args := os.Args

	// 	// nTM := NewTM()

	// 	// //Input State and declare if it is final state
	// 	// nTM.InputState("0", false)
	// 	// nTM.InputState("1", true)

	// 	// //Input config
	// 	// // InputConfig parameter as follow:
	// 	// //	- SourceState,
	// 	// // - Input
	// 	// // - Modified Value
	// 	// // - DestinationState
	// 	// // - Tape Head Move Direction
	// 	// nTM.InputConfig("0", "1", "1", "1", MoveRight)
	// 	// nTM.InputConfig("0", "0", "1", "0", MoveLeft)
	// 	// nTM.InputConfig("1", "0", "1", "0", MoveLeft)
	// 	// nTM.InputConfig("1", "1", "1", "1", MoveRight)

	// 	// //Input tape data
	// 	// nTM.InputTape(args[1:]...)

	// 	// //Run TM to the finish (if exist)
	// 	// nTM.Run()

	// 	// fmt.Println("New Tape:=", nTM.ExportTape())

}

type Rule struct {
	// Db tag lets you specify the column name if it differs from the struct field
	Id         int64 `db:"rule_id"`
	created    int64
	stateValue int64
}

func newRule(stateValue int64) Rule {
	return Rule{
		created:    time.Now().UnixNano(),
		stateValue: stateValue,
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
	dbmap.AddTableWithName(Rule{}, "rule").SetKeys(true, "Id")

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
