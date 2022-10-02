package main

import (
	"time"

	"github.com/AllenDang/gform"
)

var (
	progressBar *gform.ProgressBar
	btn         *gform.PushButton
)

func onclick(arg *gform.EventArg) {
	go setProgress()
}

func setProgress() {
	btn.SetEnabled(false)
	for i := 0; i < 100; i++ {
		progressBar.SetValue(uint(i))
		time.Sleep(50 * 1e6)
	}
	btn.SetEnabled(true)
	progressBar.SetValue(0)
}

// func main() {
// 	gform.Init()

// 	mainWindow := gform.NewForm(nil)
// 	mainWindow.SetPos(300, 100)
// 	mainWindow.SetSize(500, 300)
// 	mainWindow.SetCaption("Multi thread demo")

// 	btn := gform.NewPushButton(mainWindow)
// 	btn.SetPos(10, 10)
// 	btn.SetCaption("Click me")
// 	btn.OnLBUp().Bind(onclick)

// 	progressBar = gform.NewProgressBar(mainWindow)
// 	progressBar.SetPos(10, 40)
// 	progressBar.SetSize(300, 25)

// 	mainWindow.Show()

// 	gform.RunMainLoop()
// }
