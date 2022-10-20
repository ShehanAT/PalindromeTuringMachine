package main

import (
	// stands for the Format package
	"database/sql"
	"fmt"
	"log"

	. "github.com/ShehanAT/TuringMachine/frontend"

	// "turing_machine"
	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/gorp.v1"
)

func main() {

	dbmap := initDb()
	defer dbmap.Db.Close()
	fmt.Println("passing main")
	r1 := newRule(5)
	// r2 := newRule(6)
	// r3 := newRule(7)
	fmt.Println(r1)
	insertErr := dbmap.TruncateTables()
	insertErr = dbmap.Insert(&r1)
	checkErr(insertErr, "Insert Failed")
	var rules []Rule
	_, err := dbmap.Select(&rules, "select * from rule")
	checkErr(err, "Select failed")
	fmt.Println("All rows:")
	fmt.Println(rules)
	for x, p := range rules {
		fmt.Println("	%d: %v\n", x, p)
	}
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
	stateValue int64 `db:"state_value"`
}

func newRule(stateValue int64) Rule {
	return Rule{
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
