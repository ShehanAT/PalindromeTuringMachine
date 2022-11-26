const app = new PIXI.Application({ 
    antialias: true,
    backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
const style = new PIXI.TextStyle();
PIXI.BitmapFont.from("foo", style);
var palindromePrgStateRules = [
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
const stageHeight = app.screen.height;
const stageWidth = app.screen.width;
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
var gameSpeedSlider = null;
const tape_pointer = PIXI.Sprite.from('./assets/up-arrow-icon.png');


var startBtn = PIXI.Sprite.from("./assets/start-icon.png")
startBtn.buttonMode = true;
startBtn.anchor.set(0.5);
startBtn.position.x = 200;
startBtn.position.y = 150;
startBtn.width = 50;
startBtn.height = 50;
startBtn.interactive = true;
startBtn.on('mousedown', startPalindromeProgram);
app.stage.addChild(startBtn);

var restartBtn = PIXI.Sprite.from("./assets/restart-icon-v2.png")
restartBtn.buttonMode = true;
restartBtn.anchor.set(0.5);
restartBtn.position.x = 200;
restartBtn.position.y = 150;
restartBtn.width = 50;
restartBtn.height = 50;
restartBtn.interactive = true;
restartBtn.on('mousedown', restartPalindromeProgram);
app.stage.addChild(restartBtn);
restartBtn.visible = false;

var stopBtn = PIXI.Sprite.from("./assets/stop-icon.png")
stopBtn.buttonMode = true;
stopBtn.anchor.set(0.5);
stopBtn.position.x = 400;
stopBtn.position.y = 150;
stopBtn.width = 50;
stopBtn.height = 50;
stopBtn.interactive = true;
stopBtn.on('mousedown', stopProgram);
app.stage.addChild(stopBtn);

var resumeBtn = PIXI.Sprite.from("./assets/resume-icon.png")
resumeBtn.buttonMode = true;
resumeBtn.anchor.set(0.5);
resumeBtn.position.x = 600;
resumeBtn.position.y = 150;
resumeBtn.width = 50;
resumeBtn.height = 50;
resumeBtn.interactive = true;
resumeBtn.on('mousedown', resumeProgram);
app.stage.addChild(resumeBtn);

var moveTapeInterval = null;

function stopProgram() {
    moveTapeInterval.pause();
    toggleGameSpeedSliderVisible(true);
}

function resumeProgram() {
    moveTapeInterval.resume(gameSpeed);
    toggleGameSpeedSliderVisible(false);
}

function restartPalindromeProgram() {
    ResetGame();
    StartTape();
    restartBtn.visible = false;
    restartBtnLabel.visible = false;
}

function ResetGame() {
    // Reset tape numbers to defaults
    const tapeNumDefaults = ["1", "0", "0", "1", "0", "0", "1"];

    for (var i = 0; i < tapeSquaresArr.length; i++) {
        // Apply the font to our text
        tapeSquaresArr[i].text = tapeNumDefaults[i];

        // Update text
        tapeSquaresArr[i].updateText();
    }

    // Reset tape pointer to default position
    tape_pointer.x = app.screen.width / 2 - 45;
    tape_pointer.y = (app.screen.height / 2) + 150;

    // Reset current head index and current state variables to 0 
    currentHeadIndex = 0;
    currentState = '0';

    toggleStartBtnVisible(false);
    toggleGameSpeedSliderVisible(false);
}

function startPalindromeProgram() {
    RenderTapePointer();
    RenderTapeWPixi();
    RenderStateText();
    StartTape();
    toggleStartBtnVisible(false);
    toggleGameSpeedSliderVisible(false);
    startBtnLabel.visible = false;
}

function toggleStartBtnVisible(visible){
    startBtn.visible = visible;
}

function toggleGameSpeedSliderVisible(visible){
    handle.visible = visible;
    slider.visible = visible;
    gameSpeedTitle.visible = visible;
    fasterSpeedText.visible = visible;
    slowerSpeedText.visible = visible;
}

function toggleRestartButton(visible){
    restartBtn.visible = visible;
    restartBtnLabel.visible = visible;
}


function RenderTapePointer() {


    // center the sprite's anchor point
    tape_pointer.anchor.set(0.5);
    // move the sprite to the center of the screen
    tape_pointer.x = app.screen.width / 2 - 45;
    tape_pointer.y = (app.screen.height / 2) + 150;
    tape_pointer.width = 30;
    tape_pointer.height = 30;

    app.stage.addChild(tape_pointer);
}


function SetupPalindromeTape() {
    firstTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    secondTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    thirdTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    fourthTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    fifthTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    sixthTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    seventhTapeSquare = new PIXI.Text("1", { fontName: "foo" });

    tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];



    for (var i = 0; i < tapeSquaresArr.length; i++) {
        // Apply the font to our text
        style.x = app.screen.width / 2;
        style.y = app.screen.height / 2;

        tapeSquaresArr[i].x = app.screen.width / 2 + (i * 25);
        tapeSquaresArr[i].y = app.screen.height / 6;

        // Update the font style
        style.fill = 'black';

        // Update text
        tapeSquaresArr[i].updateText();

        app.stage.addChild(tapeSquaresArr[i])
    }
}

function SetupBinaryAdditionTape() {

}

function RenderStateText() {
    stateText.x = 50;
    stateText.y = 400;
    
    stateText.width = 100;
    stateText.height = 50;

    app.stage.addChild(stateText);

    stateValText.x = 170;
    stateValText.y = 400;
    stateValText.width = 50;
    stateValText.height = 50;

    app.stage.addChild(stateValText);
}


function RenderTapeWPixi() {
    firstTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    secondTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    thirdTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    fourthTapeSquare = new PIXI.Text("1", { fontName: "foo" });
    fifthTapeSquare = new PIXI.Text("0".toString(), { fontName: "foo" });
    sixthTapeSquare = new PIXI.Text("0", { fontName: "foo" });
    seventhTapeSquare = new PIXI.Text("1", { fontName: "foo" });

    tapeSquaresArr = [firstTapeSquare, secondTapeSquare, thirdTapeSquare, fourthTapeSquare, fifthTapeSquare, sixthTapeSquare, seventhTapeSquare];

    const style = new PIXI.TextStyle();

    for (var i = 0; i < 7; i++) {
        // Apply the font to our text
        style.x = app.screen.width / 2;
        style.y = app.screen.height / 2;
        console.log(app.screen.height / 2);
        tapeSquaresArr[i].x = (app.screen.width - 100) / 2 + (i * 25);
        tapeSquaresArr[i].y = 400;

        // Update the font style
        style.fill = 'black';

        // Update text
        tapeSquaresArr[i].updateText();

        app.stage.addChild(tapeSquaresArr[i])
    }
}

function moveTapeLogic() {
    var moveTapeDirection = ProcessInput();
    var counter = 0;
    console.log("moveTapeDirection: " + moveTapeDirection);
    switch (moveTapeDirection) {
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
            moveTapeInterval.clear();
            toggleRestartButton(true);
            break;
        default:
            break;
    }
    counter++;
}

function StartTape() {

    // moveTapeInterval = setInterval(() => {
    moveTapeInterval = new IntervalTimer(moveTapeLogic, gameSpeed);
    moveTapeInterval.start();
}

function ProcessInput() {
    var i = 0;
    var foundMatch = false;
    for (i = 0; i < palindromePrgStateRules.length; i++) {

        var textComparison = null;
        var currentTapeVal = null;
        if (currentHeadIndex >= tapeSquaresArr.length) {
            textComparison = compareTapeValues(" ", palindromePrgStateRules[i][1]);
            currentTapeVal = " ";
        } else {
            textComparison = compareTapeValues(tapeSquaresArr[currentHeadIndex].text, palindromePrgStateRules[i][1]);
            currentTapeVal = tapeSquaresArr[currentHeadIndex].text;
        }

        if (textComparison && currentState == palindromePrgStateRules[i][0]) {
            var newTapeSymbol = setNewTapeSymbol(currentTapeVal, palindromePrgStateRules[i][2]);

            try {
                console.log("BEFORE: tapeSquares[currentHeadIndex]: " + tapeSquaresArr[currentHeadIndex].text);
                tapeSquaresArr[currentHeadIndex].text = newTapeSymbol;
                tapeSquaresArr[currentHeadIndex].updateText();
                console.log("AFTER: tapeSquares[currentHeadIndex]: " + tapeSquaresArr[currentHeadIndex].text);
            } catch (err) {
                console.log("current head index is empty");
            }

            currentState = palindromePrgStateRules[i][4];
            stateValText.text = palindromePrgStateRules[i][4];
            foundMatch = true;
            break;
        }
    }
    if (foundMatch) {
        return palindromePrgStateRules[i][3];
    } else {
        return "halt-reject";
    }
}

function compareTapeValues(currentHeadVal, stateCurrentSymbolVal) {
    if ((currentState == "accept" || currentState == "accept2") && currentHeadVal == "_") {
        return true;
    }
    if (comparisonValues[currentHeadVal.toString()].includes(stateCurrentSymbolVal.toString())) {
        return true;
    } else {
        return false;
    }
}

function setNewSymbolOnTape(currentTapeSquare, newSymbol) {
    currentTapeSquare.text = newSymbol;
}

function setNewTapeSymbol(currentSymbol, newSymbol) {
    if (newSymbol == "*") {
        return currentSymbol;
    } else {
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

    resume(newGameSpeed) {
        if (this.paused) {
            if (this.remaining) {
                setTimeout(() => {
                    this.run();
                    this.paused = false;
                    this._delay = newGameSpeed;
                    this.start();
                }, this.remaining);
            } else {
                this.paused = false;
                this._delay = newGameSpeed;
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



const sliderWidth = 320;
const slider = new PIXI.Graphics()
    .beginFill(0x272d37)
    .drawRect(0, 0, sliderWidth, 4);

slider.x = (stageWidth - sliderWidth) / 2;
slider.y = stageHeight * 0.5;

// Draw the handle
const handle = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawCircle(0, 0, 8);
handle.y = slider.height / 2;
handle.x = sliderWidth / 2;
handle.interactive = true;
handle.cursor = 'pointer';

handle
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd);

app.stage.addChild(slider);
slider.addChild(handle);

function onDrag(e) {
    const halfHandleWidth = handle.width / 2;
    handle.x = Math.max(halfHandleWidth, Math.min(
        slider.toLocal(e.data.global).x,
        sliderWidth - halfHandleWidth,
    ));
    const t = Math.round((2 * ((handle.x / sliderWidth))) * 1000);
    gameSpeed = t;
}

// Listen to pointermove on stage once handle is pressed.
function onDragStart() {
    app.stage.interactive = true;
    app.stage.on('pointermove', onDrag)
}

// Stop dragging feedback once the handle is released.
function onDragEnd(e) {
    app.stage.interactive = false;
    // app.stage._events.removeEventListener('pointermove', onDrag);
}


// Add title
const title = new PIXI.Text('Palindrome Program Turing Machine', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});
title.roundPixels = true;
title.x = stageWidth / 2;
title.y = 40;
title.anchor.set(0.5, 0);
app.stage.addChild(title);

const gameSpeedTitle = new PIXI.Text('Select Game Speed', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

gameSpeedTitle.roundPixels = true;
gameSpeedTitle.x = stageWidth / 2;
gameSpeedTitle.y = 250;
gameSpeedTitle.anchor.set(0.5, 0);
app.stage.addChild(gameSpeedTitle);

const fasterSpeedText = new PIXI.Text('Faster', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

fasterSpeedText.roundPixels = true;
fasterSpeedText.x = (stageWidth / 2) - 150;
fasterSpeedText.y = 310;
fasterSpeedText.anchor.set(0.5, 0);
app.stage.addChild(fasterSpeedText);

const slowerSpeedText = new PIXI.Text('Slower', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

slowerSpeedText.roundPixels = true;
slowerSpeedText.x = (stageWidth / 2) + 150;
slowerSpeedText.y = 310;
slowerSpeedText.anchor.set(0.5, 0);
app.stage.addChild(slowerSpeedText);

const stopBtnLabel = new PIXI.Text('Pause', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

stopBtnLabel.roundPixels = true;
stopBtnLabel.x = (stageWidth / 2);
stopBtnLabel.y = 100;
stopBtnLabel.anchor.set(0.5, 0);
app.stage.addChild(stopBtnLabel);

const resumeBtnLabel = new PIXI.Text('Resume', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

resumeBtnLabel.roundPixels = true;
resumeBtnLabel.x = (stageWidth / 2) + 200;
resumeBtnLabel.y = 100;
resumeBtnLabel.anchor.set(0.5, 0);
app.stage.addChild(resumeBtnLabel);

const startBtnLabel = new PIXI.Text('Start', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

startBtnLabel.roundPixels = true;
startBtnLabel.x = (stageWidth / 2) - 200;
startBtnLabel.y = 100;
startBtnLabel.anchor.set(0.5, 0);
app.stage.addChild(startBtnLabel);


const restartBtnLabel = new PIXI.Text('Restart', {
    fill: '#272d37',
    fontFamily: 'Roboto',
    fontSize: 20,
    align: 'center',
});

restartBtnLabel.roundPixels = true;
restartBtnLabel.x = (stageWidth / 2) - 200;
restartBtnLabel.y = 100;
restartBtnLabel.anchor.set(0.5, 0);
app.stage.addChild(restartBtnLabel);
restartBtnLabel.visible = false;


