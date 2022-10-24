
<template>
  <div class="main-section">
    
        <div id="MachineTapeContainer">
          <div class="BoxTitle">Tape</div>
          <div id="MachineTape" class="MachineStatusBox" title="This is the Turing machine's tape. The head position is indicated by the highlighted cell and arrow.">
           <!-- the following pre elements must be on a single line with no whitespace between them !-->
           <div id="RunningTapeDisplay" aria-live="polite"><div id="TapeValues"><pre id="LeftTape" class="tape">11011y 10101</pre><div id="ActiveTapeArea"><pre id="ActiveTape" class="tape"> </pre><div id="MachineHead" ref="MachineHead"><div class="HeadTop"></div><div class="HeadBody">Head</div></div></div><pre id="RightTape" class="tape"> </pre></div></div>
          </div> <!-- div MachineTape !-->
        </div>

        <button @click="moveTapeRight">Start</button>
    <div class="controls-section">
      <div id="MachineControlBlock">
            <div class="BoxTitle">Controls</div>
            <div id="MachineButtonsBlock">
            <button id="RunButton" onclick="RunButton();" title="Start the machine running">Run</button> <!-- &#x25b8; !--> <!-- Unicode 'play' symbol !-->
            <span title="If enabled, runs as fast as your browser &amp; computer allow">
              <input type="checkbox" id="SpeedCheckbox" onclick="SpeedCheckbox();">Run at full speed
            </span>
            <br>
            <button id="StopButton" onclick="StopButton();" disabled="disabled" title="Pause the machine when running">Pause</button><br> <!-- &#x25fe; !-->
            <button id="UndoButton" onclick="Undo();" title="Undo one machine step" style="float: right;">Undo</button>
            <button id="StepButton" onclick="StepButton();" title="Run the machine for a single step and the pause">Step</button><br> <!-- &#x25b8;&#x2759; !-->
            <button id="ResetButton" onclick="ResetButton();" title="Reset the machine and tape to the initial state">Reset</button> <!-- &#x2759;&#x23ea; !-->
            <div id="InitialTapeDisplay"  title="This initial data will be loaded on the tape when the machine starts">
              Initial input:<input type="text" id="InitialInput" value="" onchange="ShowResetMsg(true);">
            </div>
            <div style="font-size: small;">
              <a href="javascript:" onclick="$('#AdvancedOptions').slideToggle();" title="Show advanced machine options">Advanced options</a>
            </div>
            <div id="AdvancedOptions" style="display: none; margin-top: 0.25em;">
              <div id="InitialStateDisplay"  title="This is the state that the machine will start in" style="margin-bottom: 0.5em;">
              Initial state:<input type="text" id="InitialState" value="0" onchange="ShowResetMsg(true);">
              </div>
              <div title="Choose between different Turing machine variants">
              Machine variant:
              <select onchange="VariantChanged(true);" id="MachineVariant">
                <option value="0" selected="selected">Standard</option>
                <option value="1">Semi-infinite tape</option>
                <option value="2">Non-deterministic</option>
              </select>
              <div id="MachineVariantDescription" style="font-size: small; font-style: italic;"></div>
              <span style="font-size: x-small;"><a href="javascript:" onclick="$('#AdvancedOptions').hide();">[Close]</a></span>
              </div>
            </div> 
            <div id="ResetMessage">Changes will take effect when the machine is reset.</div>
            <br>
            <br>
            <div id="LoadBlock">
              <a href="javascript:" onclick="$('#LoadMenu').slideToggle();" title="Load a pre-prepared example program">Load an example program</a>
              <div id="LoadMenu">
              <ul>
                <li><a href="javascript:" onclick="LoadSampleProgram('palindrome', 'Palindrome detector');">Palindrome detector</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('binaryadd', 'Binary addition machine');">Binary addition</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('binarymult', 'Binary multiplication machine');">Binary multiplication</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('bin2dec', 'Binary to decimal conversion machine');">Binary to decimal conversion</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('turingsequence', 'Turing\'s sequence machine');">Turing's sequence machine</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('parentheses', 'Parentheses checker machine');">Parentheses checker</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('reversepolishboolean', 'Reverse Polish Boolean calculator');">Reverse Polish Boolean calculator</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('primetest', 'Primality test machine');">Primality test</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('4statebeaver', '4-state busy beaver');">4-state busy beaver</a></li>
                <li><a href="javascript:" onclick="LoadSampleProgram('universal', 'Universal Turing machine');">Universal Turing machine</a></li>
                <!--<li><a href="javascript:" onclick="LoadSampleProgram('error', 'Error machine');">Error</a></li>!--> <!-- for testing !-->
              </ul>
              <span style="font-size: x-small;"><a href="javascript:" onclick="$('#LoadMenu').hide();">[Close]</a></span>
              </div>
            </div> <!-- div inputProg !-->
            <br>
            <a href="javascript:" onclick="SaveToCloud();" title="Save your machine to the cloud for sharing or bookmarking">Save to the cloud</a>
            <!--...<a href="javascript:" onclick="testsave(true);">test ok</a>...<a href="javascript:" onclick="testsave(false);">test error</a>!--> <!-- for testing !-->
            <div id="SaveStatus">
              <div id="SaveStatusFg">
              <div id="SaveStatusMsg"></div>
              <span style="font-size: x-small;"><a href="javascript:" onclick="ClearSaveMessage();">[Close]</a></span>
              </div> 
              <div id="SaveStatusBg"></div>
            </div>
            <!--<br><button id="DebugButton" onclick="x();">Debug</button><br>!-->
        </div> <!-- div MachineButtonsBlock !-->
     </div> <!-- div MachineControlBlock !-->


    </div>
  </div>

  
</template>

<script>
import { translateRight } from "./animate"
// import JQuery from 'jquery'
import $ from 'jquery' 
import { RunButton } from "./js-turing"
// window.$ = JQuery 

export default {
  name: 'TuringMachine',
  props: {
    msg: String,
  },
  data() {
    return {
        nDebugLevel : Boolean = 0,
      bFullSpeed : Boolean = false,	/* If true, run at full speed with no delay between steps */
      bIsReset : Boolean = false,		/* true if the machine has been reset, false if it is or has been running */
      sTape : Number = "",				/* Contents of TM's tape. Stores all cells that have been visited by the head */
      nTapeOffset : Number = 0,		/* the logical position on TM tape of the first character of sTape */
      nHeadPosition : Number = 0,		/* the position of the TM's head on its tape. Initially zero; may be negative if TM moves to left */
      sState : String = "0",
      nSteps : Number = 0,
      nVariant : Number = 0, /* Machine variant. 0 = standard infinite tape, 1 = tape infinite in one direction only, 2 = non-deterministic TM */
      hRunTimer : Number = null,
      aProgram : Object = new Object(),
    /* aProgram is a double asociative array, indexed first by state then by symbol.
      Its members are arrays of objects with properties newSymbol, action, newState, breakpoint and sourceLineNumber.
    */

      nMaxUndo : Number = 10,  /* Maximum number of undo steps */
      aUndoList : Array,
    /* aUndoList is an array of 'deltas' in the form {previous-state, direction, previous-symbol}. */

    /* Variables for the source line numbering, markers */
      nTextareaLines : String,
      oTextarea : String,
      bIsDirty : true	/* If true, source must be recompiled before running machine */,
      oNextLineMarker : $("<div class='NextLineMarker'>Next<div class='NextLineMarkerEnd'></div></div>"),
      oPrevLineMarker : $("<div class='PrevLineMarker'>Prev<div class='PrevLineMarkerEnd'></div></div>"),
      oPrevInstruction : String,
      sPreviousStatusMsg : String
    }
   
  },
  methods: {
    moveTapeRight() {
        translateRight(this.$refs.MachineHead, 10)

    },
    RunButton(){
      RunButton()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

/* CSS Stylesheet for Javascript Turing machine simulator */

body {
  text-align: center;
  
  font-family: sans-serif;
}

#Machine {
  border: 2px solid #ff6666;
/*  background-color: #dfdfda; */
/*  background-color: #ffe1e1; */
  background-color: #ffefda;
  padding-top: 0.5em;
  padding-bottom: 0.25em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 10px;
  margin-bottom: 10px;
/*  height: 10em; */
  text-align: center;
  display: inline-block;
}

.BoxTitle {
  position: relative;
  top : 12px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 1px;
  padding-bottom: 1px;
  height: 15px;
  display: inline; 
  background-color: #eeeeee;
/*  background: solid;*/
  border: 1px solid grey;
  font-family: sans-serif;
/*  font-variant: small-caps; */
  font-size: small;
  z-index: 3;
/*  font-weight: bold; */
}

#MachineTapeContainer {
  max-width: 90vw;	/* Max width 90% of window width */
  margin-left: 4%;
  margin-right: 4%;
}

#MachineTape {
  background-color: #eee8aa;
  padding-top: 10px;
  padding-left: 0px;
  font-size: x-large;
  margin-bottom: 1em;
  overflow: auto;
  position: relative;
}


.tape {
  display: inline;
  font-family: "Courier New", courier;
  padding: 0;
  margin: 0;
}

.OneDirectionalTape {
  border-left: 3px solid red;
}

#LeftTape {
  text-align: right;
  padding-left: 5px;
}

#RightTape {
  text-align: left;
  padding-right: 5px;
}

#ActiveTape {
  color: red;
  border: 1px solid LightGrey;
  font-weight: bold;
  background-color: #bbf8ff;
}

#ActiveTapeArea {
  position: relative;
  display: inline;
  padding: 0;
  margin: 0;
}

#RunningTapeDisplay {
/*  overflow: auto; */
  height: 2.5em;
  white-space: pre;
}

#InitialTapeDisplay {
  margin-bottom: 4px;
}

#InitialState {
  width: 50px;
}

.MachineStatusContainer {
  text-align: center;
  width: 150px;
  position: relative;
  top: -1em;
  margin: 0;
  padding: 0;
}

.MachineStatusBox {
  border: 1px solid grey;
  padding-top: 12px;
  padding-bottom: 0.25em;
  padding-left: 0.25em;
  padding-right: 0.25em;
  margin-top: 5px;
  margin-bottom: 8px;
  margin-left: 0;
  margin-right: 0;
/*  text-align: center; */
  font-family: "Courier New", courier;
  background-color: #C9F2C9;
  overflow: hidden;
}


#MachineStateContainer {
  float: left;
}

#MachineStepsContainer {
  float: right;
}

#MachineMiddleSection {
  text-align: center;
  height: 4em;
  position: relative;
  width: 100%;
}

#MachineStatusMsgWrapper {
  position: relative;
  display: inline;
/*  z-index: 10; */
}

#MachineStatusMsgBg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: #88eeee;
  display: none;
}

#MachineStatusMsgText {
  text-align: center;
  width: 60%;
  height: 3em;
  display: inline;
  position: relative;
  font-size: larger;
  z-index: 2;
  padding: 0.5em;
}

#MachineLowerSection {
  position: relative;
  display: table;
}

#MachineLowerSection2 {
  display: table-row;
}


#MachineProgramContainer {
  text-align: center;
  width: 100%;
  position: relative;
/*  top: -2em; */
  display: table-cell;
}

#MachineProgramBlock {
  padding-top: 8px;
  text-align: center;
  overflow: hidden;
}

#MachineProgramBlock2 {
  padding: 4px;
  display: inline-block;
}

#MachineControlBlock {
  width: 300px;
  display: table-cell;
}


#MachineButtonsBlock {
  min-width: 275px;
  max-width: 300px;
  height: 100%;
  text-align: left;
  margin-left: 10px;
  border: 1px solid grey;
  padding: 4px;
  margin-top: 4px;
  padding-top: 12px;
  padding-bottom: 15px;
  background: #dedede;
}

#LoadBlock {
}

button {
  min-width: 75px;
}

#MachineHead {
  position: absolute;
/*  left: -50%; */ /* Note: This works properly on Firefox but not on Chrome, IE - due to bugs? */
  left: -9px; /* Using this because of Chrome, IE bugs - see above */
  top: 100%;
  width: 32px;
/*  display: none; */
}

/* Triangle using css tricks */
.HeadTop {
  height: 10px;
  width: 0px;
}

/* Arrow outline */
.HeadTop:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-left: 17px solid transparent;
  border-right: 17px solid transparent;
  border-bottom: 10px solid #333333;
}

/* Arrow interior */
.HeadTop:after {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  margin-top:1px;
  margin-left:2px;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 9px solid #ff9933;
}

.HeadBody {
  width: 32px;
  height: 14px;
  text-align: center;
  font-size: small;
  background: #ff9933;
  border-left: 1px solid #333333;
  border-right: 1px solid #333333;
  border-bottom: 1px solid #333333;
}




/** Miscellaneous **/
#IntroText {
  text-align: left;
  padding-left: 10%;
  padding-right: 10%;
}

h1 {
  margin-bottom: 0.2em;
}

code {
/*  background: #e0e0e0;*/
  font-size: larger;
}

#SyntaxInfo {
  text-align: left;
  margin-top: 15px;
  margin-left: 2em;
  margin-bottom: 10px;
}

#AboutMenu {
  text-align: left;
  margin-left: 2em;
  margin-top: 2em;
  margin-bottom: 1em;
}

.AboutItem {
  display: inline;
}

.AboutContent {
  display: none;
}

#AboutContentContainer {
  margin-top: 8px;
  margin-left: 20px;
}

#MetaInfo div {
  margin-top: 0.5em;
}

#LoadMenu {
  display: none;  /* Initially hidden */
}

#SaveStatus {
  display: none;  /* Initially hidden */
  position: relative;
  margin-top: 5px;
  word-wrap: break-word;
}

#SaveStatusFg {
  background: transparent;
  position: relative;
  z-index: 10;
}

#SaveStatusBg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

#ResetMessage {
  color: red;
  display: none;
}

.glow {
  box-shadow: 0px 0px 3px red;
}

ul {
  margin-top: 0;
  margin-bottom: 0;
}

.backlinks {
  text-align: center;
  margin-bottom: 0.2em;
}

.Signature {
  text-align: right;
  font-style: italic;
  font-size: smaller;
}

#debugOuter {
  clear: both;
}

.DebugClass {
  display: none;
}

.clear {
  clear: both;
}

.disabled {
  color: grey;
}

.cleardiv {
  clear: both;
  height: 0px;
}

li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style>
