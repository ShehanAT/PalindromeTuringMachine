package turing_machine

import (
	"log"
	"os"

	"github.com/asticode/go-astilectron"
)

func functionA() {
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
