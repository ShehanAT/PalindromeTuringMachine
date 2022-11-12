const style = new PIXI.TextStyle();
PIXI.BitmapFont.from("foo", style);
var hardCodedState = [
    // [<current_state>, <current_symbol>, <new_symbol>, <direction>, <new_state>]
    ['0', '0', '_', 'r', '1o'],
    ['0', '1', '_', 'r', '1i'],
    ['0', '_', '_', '*', 'accept'],
    ['0', '1', '_', 'r', '1o'],
    ['1i', '_', '_', 'l', '2i'],
    ['1i', '*', '*', 'r', '1i'],
    ['1o', '*', '*', 'r', '1o'],
    ['1o', '_', '_', 'l', '2o'],
    ['2o', '0', '_', 'l', '3'],
    ['2o', '_', '_', '*', 'accept'],
    ['2o', '*', '*', '*', 'reject'],
    ['2i', '1', '_', 'l', '3'],
    ['2i', '*', '*', '*', 'reject'],
    ['3', '_', '_', '*', 'accept'],
    ['3', '*', '*', 'l', '4'],
    ['4', '*', '*', 'l', '4'],
    ['4', '_', '_', 'r', '0'],
    ['accept', '*', ':', 'r', 'accept2'],
    ['accept2', '*', ')', '*', 'halt-accept'],
    ['reject', '_', ':', 'r', 'reject2'],
    ['reject', '*', '_', 'l', 'reject'],
    ['reject2', '*', ')', '*', 'halt-reject'],
];
var currentHeadIndex = 0;
var firstTapeSquare = new PIXI.BitmapText("1", { fontName: "foo" });
var secondTapeSquare = new PIXI.BitmapText("0", { fontName: "foo" });
var thirdTapeSquare = new PIXI.BitmapText("0", { fontName: "foo" });
var fourthTapeSquare = new PIXI.BitmapText("1", { fontName: "foo" });
var fifthTapeSquare = new PIXI.BitmapText("0".toString(), { fontName: "foo" });
var sixthTapeSquare = new PIXI.BitmapText("0", { fontName: "foo" });
var seventhTapeSquare = new PIXI.BitmapText("1", { fontName: "foo" });
var stateValText = new PIXI.BitmapText("Current State Value: NA", { fontName: "foo" });
var currentState = '0';
var tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];
var nextSymbol = '0';
var prevSymbol = '0';



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
RenderStateText();
StartTape();



function RenderStateText() {
    stateValText.x = (app.screen.width / 2) + 50;
    stateValText.y = (app.screen.height / 2) + 100;
    stateValText.width = 50;
    stateValText.height = 50;
}

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
    var counter = 0;
    var moveTape = setInterval(() => {
        var moveTapeDirection = ProcessInput();
        console.log("moveTapeDirection: " + moveTapeDirection);
        switch(moveTapeDirection){
            case "r":
                tape_pointer.x += 25;
                currentHeadIndex++;
                break;
            case "l":
                tape_pointer.x -= 25;
                currentHeadIndex--;
                break;
            case "halt-reject":
                console.log("halt-reject");
                clearInterval(moveTape);
                break;
            default:
                break;
        }
        counter++;
    
    }, 2000);

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
    var i = 0;
    var foundMatch = false;
    for ( i = 0 ; i < hardCodedState.length ; i++){

        var textComparison = null;
        var currentTapeVal = null;
        if(currentHeadIndex >= tapeSquaresArr.length){
            textComparison = compareTapeValues(" ", hardCodedState[i][1]);
            currentTapeVal = " ";
        }else{
            textComparison = compareTapeValues(tapeSquaresArr[currentHeadIndex].text, hardCodedState[i][1]);
            currentTapeVal = tapeSquaresArr[currentHeadIndex].text;
        }
    
        if(textComparison && currentState == hardCodedState[i][0]){
            var newTapeSymbol = setNewTapeSymbol(currentTapeVal, hardCodedState[i][2]);
            if(currentTapeVal != " "){
                tapeSquaresArr[currentHeadIndex].text = newTapeSymbol;
            }
            
            currentState = hardCodedState[i][4];

            console.log("CHANGING STATE TO: " + hardCodedState[i][4] + ", hardCodedState[i]: " + hardCodedState[i]);
            stateValText.text = hardCodedState[i][4];
            foundMatch = true;
            break;
        }
    }
    if(foundMatch){
        return hardCodedState[i][3];
    }else{
        return "halt-reject";
    }
}

function compareTapeValues(currentHeadVal, stateCurrentSymbolVal){
    if(currentHeadVal == " " && stateCurrentSymbolVal == "_"){
        return true;
    }
    if(currentHeadVal == stateCurrentSymbolVal){
        return true;
    }else if(stateCurrentSymbolVal == "*"){
        return true;
    }else{
        return false;
    }
}

function setNewSymbolOnTape(currentTapeSquare, newSymbol){
    currentTapeSquare.text = newSymbol;
}

function setNewTapeSymbol(currentSymbol, newSymbol){
    if(newSymbol == "*"){
        return currentSymbol;
    }else{
        return newSymbol;
    }
}