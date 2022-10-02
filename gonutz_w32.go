package main

import (
	"fmt"

	"github.com/gonutz/w32/v2"
)

func main() {
	w32.EnumWindows(func(w w32.HWND) bool {
		fmt.Println(w32.GetActiveWindow())
		// fmt.Println(w32.GetWindowText(w))
		return true
	})
}
