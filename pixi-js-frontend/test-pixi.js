const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
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
    ['2i', '_', '_', '*', 'accept'],
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
var comparisonValues = {
    "0": ["0", "*"],
    "1": ["1", "*"],
    "*": ["0", "1", "*"],
    " ": ["_"],
    "_": ["_"],
    ")": [")"]
}
var currentHeadIndex = 0;
var firstTapeSquare = null;
var secondTapeSquare = null;
var thirdTapeSquare = null;
var fourthTapeSquare = null;
var fifthTapeSquare = null;
var sixthTapeSquare = null;
var seventhTapeSquare = null;
var stateText = new PIXI.Text("Current State: ", 
{  
    fill: "#333333",
    fontSize: 40,
    fontWeight: 'bold', 
}
);
var stateValText = new PIXI.Text("N/A", 
{  
    fill: "#333333",
    fontSize: 40,
    fontWeight: 'bold', 
}
);
var currentState = '0';
var tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];
var nextSymbol = '0';
var prevSymbol = '0';
var gameSpeed = 500;
const tape_pointer = PIXI.Sprite.from('./assets/up-arrow-icon.png');


var palindromeBtn = PIXI.Sprite.from("./assets/palindrome-button.png")
palindromeBtn.buttonMode = true;
palindromeBtn.anchor.set(0.5);
palindromeBtn.position.x = 200;
palindromeBtn.position.y = 250;
palindromeBtn.width = 150;
palindromeBtn.height = 50;
palindromeBtn.interactive = true;
palindromeBtn.on('mousedown', startPalindromeProgram);
app.stage.addChild(palindromeBtn);


var stopBtn = PIXI.Sprite.from("./assets/stop-icon.jpg")
stopBtn.buttonMode = true;
stopBtn.anchor.set(0.5);
stopBtn.position.x = 250;
stopBtn.position.y = 250;
stopBtn.width = 150;
stopBtn.height = 50;
stopBtn.interactive = true;
stopBtn.on('mousedown', stopProgram);
app.stage.addChild(stopBtn);

var moveTapeInterval = null;

function stopProgram(){
    moveTapeInterval.pause();
}

function startPalindromeProgram() {
    SetupPalindromeTape();
    RenderTapePointer();
    RenderTapeWPixi();
    RenderStateText();
    StartTape();
    
}
// var pallindromeBtn = new PIXI.Button({
//     x: 500,
//     y: 10,
//     label: 'Pallindrome Program',
//     active: true
// });

// var binaryAddisionBtn = new PIXI.Button({
//     x: 540,
//     y: 10,
//     label: 'Binary Addision Program',
//     active: true
// });


// app.stage.addChild(binaryAddisionBtn);

function RenderTapePointer() {
    

    // center the sprite's anchor point
    tape_pointer.anchor.set(0.5);
    // move the sprite to the center of the screen
    tape_pointer.x = app.screen.width / 2 + 5;
    tape_pointer.y = (app.screen.height / 2) + 45;
    tape_pointer.width = 30;
    tape_pointer.height = 30;
    
    app.stage.addChild(tape_pointer);    
}


function SetupPalindromeTape(){
    firstTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    secondTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    thirdTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    fourthTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    fifthTapeSquare = new PIXI.Text("0".toString(), { fontName: "foo" });
    sixthTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    seventhTapeSquare = new PIXI.Text("1", { fontName: "foo" });

    tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];

    

    for(var i = 0 ; i < tapeSquaresArr.length ; i++){
        // Apply the font to our text
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

function SetupBinaryAdditionTape(){

}

function RenderStateText() {
    stateText.x = 90;
    stateText.y = 100;
    stateText.width = 100;
    stateText.height = 50;

    app.stage.addChild(stateText); 

    stateValText.x = 190;
    stateValText.y = 100;
    stateValText.width = 50;
    stateValText.height = 50;

    app.stage.addChild(stateValText);
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

function moveTapeLogic() {
    var counter = 0;
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
            clearInterval(moveTapeInterval);
            break;
        default:
            break;
    }
    counter++;
    console.log('passing')
}

function StartTape(){
    
    // moveTapeInterval = setInterval(() => {
    moveTapeInterval = new IntervalTimer(moveTapeLogic, gameSpeed);
    moveTapeInterval.start();
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
    
            try{
                console.log("BEFORE: tapeSquares[currentHeadIndex]: " + tapeSquaresArr[currentHeadIndex].text);
                tapeSquaresArr[currentHeadIndex].text = newTapeSymbol;
                tapeSquaresArr[currentHeadIndex].updateText();
                console.log("AFTER: tapeSquares[currentHeadIndex]: " + tapeSquaresArr[currentHeadIndex].text);
            }catch(err){
                console.log("current head index is empty");
            }
            
            currentState = hardCodedState[i][4];
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
    if((currentState == "accept" || currentState == "accept2") && currentHeadVal == "_"){
        return true;
    }
    if(comparisonValues[currentHeadVal.toString()].includes(stateCurrentSymbolVal.toString())){
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

class IntervalTimer {
    callbackStartTime;
    remaining = 0;
    paused = false;
    timerId = null;
    _callback;
    _delay;

    constructor(callback, delay) {
        this._callback = callback;
        this._delay = delay;
    }

    pause() {
        if (!this.paused) {
            this.clear();
            this.remaining = new Date().getTime() - this.callbackStartTime;
            this.paused = true;
        }
    }

    resume() {
        if (this.paused) {
            if (this.remaining) {
                setTimeout(() => {
                    this.run();
                    this.paused = false;
                    this.start();
                }, this.remaining);
            } else {
                this.paused = false;
                this.start();
            }
        }
    }

    clear() {
        clearInterval(this.timerId);
    }

    start() {
        this.clear();
        this.timerId = setInterval(() => {


            this.run();
        }, this._delay);
    }

    run() {
        this.callbackStartTime = new Date().getTime();
        this._callback();
    }
}