const style = new PIXI.TextStyle();
PIXI.BitmapFont.from("foo", style);
// var hardCodedState = {
//     ['0', '0', '_', 'r', '1o'],
//     []
// };
var currentHeadIndex = 0;
var firstTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var secondTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var thirdTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var fourthTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var fifthTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var sixthTapeSquare = new PIXI.BitmapText((Math.floor(Math.random() * (1 - 0)) + 0).toString(), { fontName: "foo" });
var seventhTapeSquare = new PIXI.BitmapText("L", { fontName: "foo" });
var stateValText = new PIXI.BitmapText("Current State Value: NA", { fontName: "foo" });
var tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];


const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a new Sprite from an image path
const tape_pointer = PIXI.Sprite.from('examples/assets/up-arrow-icon.png');

// center the sprite's anchor point
tape_pointer.anchor.set(0.5);

// move the sprite to the center of the screen
tape_pointer.x = app.screen.width / 2 + 5;
tape_pointer.y = (app.screen.height / 2) + 45;
tape_pointer.width = 30;
tape_pointer.height = 30;

app.stage.addChild(tape_pointer);

RenderTapeWPixi();
StartTape();

function RenderTapeWPixi() {
    const style = new PIXI.TextStyle();

    for(var i = 0 ; i < 7 ; i++){
        // Apply the font to our text
        tapeSquaresArr[i]
        style.x = app.screen.width / 2;
        style.y = app.screen.height / 2;
    
        tapeSquaresArr[i].x = app.screen.width / 2 + (i * 25);
        tapeSquaresArr[i].y = app.screen.height / 2;
    
        // Update the font style
        style.fill = 'black';
    
        // Update text
        tapeSquaresArr[i].updateText();
		
        app.stage.addChild(tapeSquaresArr[i])
    }
}


function StartTape(){
    var moveTape = setInterval(() => {
        
        if(tapeSquaresArr[currentHeadIndex].text == "L"){
            clearInterval(moveTape);
            MoveTapeInReverse();
        }
        
        if (currentHeadIndex == (tapeSquaresArr.length - 1)){
            clearInterval(moveTape);
        }else{
            ProcessInput();
            tape_pointer.x += 25;
            currentHeadIndex++;
        }
    
    }, 1000);

}

function MoveTapeInReverse() {
    var moveTape = setInterval(() => {
        tape_pointer.x -= 25;
        
        if (currentHeadIndex == 0){
            clearInterval(moveTape);
        }
        currentHeadIndex--;

    }, 1000);
}

function ProcessInput() {
    tapeSquaresArr[currentHeadIndex]
}