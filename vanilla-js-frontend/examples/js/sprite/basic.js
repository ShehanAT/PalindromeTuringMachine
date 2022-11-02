

const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

// create a new Sprite from an image path
const tape_pointer = PIXI.Sprite.from('examples/assets/up-arrow-icon.png');

// center the sprite's anchor point
tape_pointer.anchor.set(0.5);

// move the sprite to the center of the screen
tape_pointer.x = app.screen.width / 2;
tape_pointer.y = (app.screen.height / 2) + 45;
tape_pointer.width = 30;
tape_pointer.height = 30;

app.stage.addChild(tape_pointer);

// // Render number line numbers as PIXI.Text
// const text1 = new Text('1', {
//     fontFamily: 'Arial',
//     fontSize: 24,
//     fill: 0xff1010,
//     align: 'center',
// });

// text1.x = app.screen.width / 2;
// text1.y = app.screen.height / 2;

// Create the font
const style = new PIXI.TextStyle();
PIXI.BitmapFont.from("foo", style);

// Create 8 numbers using PIXI.BitmapText elements 
for(var i = 0 ; i < 8 ; i++){
    // Apply the font to our text
    const text = new PIXI.BitmapText((i + 1).toString(), { fontName: "foo" });
    style.x = app.screen.width / 2;
    style.y = app.screen.height / 2;

    text.x = app.screen.width / 2 + (i * 25);
    text.y = app.screen.height / 2;

    // Update the font style
    style.fill = 'black';
    PIXI.BitmapFont.from("foo", style);

    // Update text
    text.updateText();

    app.stage.addChild(text)
}

// Listen for animate update
app.ticker.add((delta) => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // tape_pointer.rotation += 0.1 * delta;
    tape_pointer.x += 0.1
});
