package main

import (
	// stands for the Format package
	"os"

	// . "github.com/ShehanAT/TuringMachine/turing_machine"
	// "turing_machine"
	"log"

	"github.com/asticode/go-astilectron"
)

func main() {
	initAstilectron()

	// args := os.Args

	// nTM := NewTM()

	// //Input State and declare if it is final state
	// nTM.InputState("0", false)
	// nTM.InputState("1", true)

	// //Input config
	// // InputConfig parameter as follow:
	// //	- SourceState,
	// // - Input
	// // - Modified Value
	// // - DestinationState
	// // - Tape Head Move Direction
	// nTM.InputConfig("0", "1", "1", "1", MoveRight)
	// nTM.InputConfig("0", "0", "1", "0", MoveLeft)
	// nTM.InputConfig("1", "0", "1", "0", MoveLeft)
	// nTM.InputConfig("1", "1", "1", "1", MoveRight)

	// //Input tape data
	// nTM.InputTape(args[1:]...)

	// //Run TM to the finish (if exist)
	// nTM.Run()

	// fmt.Println("New Tape:=", nTM.ExportTape())

}

func initAstilectron() {
	// Initialize astilectron
	var a, _ = astilectron.New(log.New(os.Stderr, "", 0), astilectron.Options{
		AppName:            "astilectron-app",
		AppIconDefaultPath: "/c/Users/sheha/Downloads/randomIcon.png", // If path is relative, it must be relative to the data directory
		AppIconDarwinPath:  "/c/Users/sheha/Downloads/randomIcon.png", // Same here
		BaseDirectoryPath:  "/c/Users/sheha/go",
		VersionAstilectron: "0.33.0",
		VersionElectron:    "4.0.1",
	})
	defer a.Close()

	// Start astilectron
	a.Start()

	// Blocking pattern
	a.Wait()
}
