package main

import (
	"github.com/dtylman/gowd"

	"fmt"
	"time"

	"github.com/dtylman/gowd/bootstrap"
)

var body *gowd.Element

func main() {
	//creates a new bootstrap fluid container
	body = bootstrap.NewContainer(false)
	// add some elements using the object model
	div := bootstrap.NewElement("div", "well")
	row := bootstrap.NewRow(bootstrap.NewColumn(bootstrap.ColumnSmall, 3, div))
	body.AddElement(row)
	// add some other elements from HTML
	div.AddHTML(`<div class="dropdown">
	<style>
		* {
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			font-family: 'Source Sans Pro';
		}
		
		.wrapper {
			display:flex;
			width: 100%;
			margin-bottom: 2em;
		}
		
		.example1 .main-item{
			width:60%;
			outline: 1px solid black;
			order:2;
			-webkit-order: 2;
			-webkit-box-ordinal-group: 2;   /* OLD - iOS 6-, Safari 3.1-6 */
			-moz-box-ordinal-group: 2;      /* OLD - Firefox 19- */
			-ms-flex-order: 2; 
			min-height: 200px;
			text-align: center;
			padding: 1em;
		}
			
		.example1 .side-item {
			flex: 1;
			-webkit-box-flex: 1;  
			outline: 1px solid black;
			padding: 1em;
			text-align: center;
		}
		
		.example1 .nav {
			order: 1;
			-webkit-order: 1;
			-webkit-box-ordinal-group: 1;   /* OLD - iOS 6-, Safari 3.1-6 */
			-moz-box-ordinal-group: 1;      /* OLD - Firefox 19- */
			-ms-flex-order: 1; 
		}
		
		.example1 .right-rail{
			order: 3;
			-webkit-order: 3;
			-webkit-box-ordinal-group: 3;   /* OLD - iOS 6-, Safari 3.1-6 */
			-moz-box-ordinal-group: 3;      /* OLD - Firefox 19- */
			-ms-flex-order: 3; 
		}
		
		.example2 *{
			padding: 1em;
			text-align:center;
		}
			
		.example2 .item-1{
			flex:1;
			-webkit-box-flex: 1;
			outline: 1px solid black;
			height: 200px;
		}
		
		.example2 .item-2{
			flex: 2;
			-webkit-box-flex:2;
			outline: 1px solid black;
		}
		
		.example2 .item-3{
			flex: 3;
			-webkit-box-flex: 3;
			outline: 1px solid black;
		}
		
		.example3{
			display: flex; /* TODO: figure out why this needs 'flex' and doesn't work with 'box' */
			-webkit-flex-align: center;
			-ms-flex-align: center;
			-webkit-align-items: center;
			align-items: center;
			height: 200px;
			outline: 1px solid black;
			text-align:center;
		}
	</style>
	<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
	<span class="caret"></span></button>
	
	<ul class="dropdown-menu" id="dropdown-menu">
	<li><a href="#">HTML</a></li>
	<li><a href="#">CSS</a></li>
	<li><a href="#">JavaScript</a></li>
	</ul>




	
	</div>`, nil)
	second_div := bootstrap.NewElement("div", "well")
	second_row := bootstrap.NewRow(bootstrap.NewColumn(bootstrap.ColumnSmall, 3, second_div))
	body.AddElement(second_row)

	second_row.AddHTML(
		`
		<link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro' rel='stylesheet' type='text/css'>
		<h1>Example: Three-column Layout w/%-width center column.</h1>
		<div class="example1 wrapper">
			<div class="main-item">width: 60%</div>
			<div class="side-item nav">flex: 1</div>
			<div class="side-item right-rail">flex: 1</div>
		</div>
		`, nil)
	// add a button to show a progress bar
	btn := bootstrap.NewButton(bootstrap.ButtonPrimary, "Start")
	second_btn := bootstrap.NewButton(bootstrap.ButtonPrimary, "Create Rule")
	btn.OnEvent(gowd.OnClick, btnClicked)
	second_btn.OnEvent(gowd.OnClick, btnClicked)

	row.AddElement(bootstrap.NewColumn(bootstrap.ColumnSmall, 3, bootstrap.NewElement("div", "well"), second_div))
	row.AddElement(bootstrap.NewColumn(bootstrap.ColumnSmall, 3, bootstrap.NewElement("div", "well", btn)))
	row.AddElement(bootstrap.NewColumn(bootstrap.ColumnSmall, 3, bootstrap.NewElement("div", "well", second_btn)))
	//start the ui loop
	gowd.Run(body)
}

// happens when the 'start' button is clicked
func btnClicked(sender *gowd.Element, event *gowd.EventElement) {
	// adds a text and progress bar to the body
	sender.SetText("Working...")
	text := body.AddElement(gowd.NewStyledText("Working...", gowd.BoldText))
	progressBar := bootstrap.NewProgressBar()
	body.AddElement(progressBar.Element)

	// makes the body stop responding to user events
	body.Disable()

	// clean up - remove the added elements
	defer func() {
		sender.SetText("Start")
		body.RemoveElement(text)
		body.RemoveElement(progressBar.Element)
		body.Enable()
	}()

	// render the progress bar
	for i := 0; i <= 123; i++ {
		progressBar.SetValue(i, 123)
		text.SetText(fmt.Sprintf("Working %v", i))
		time.Sleep(time.Millisecond * 20)
		// this will cause the body to be refreshed
		body.Render()
	}

}
