
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
// import { RunButton } from "./js-turing"
// window.$ = JQuery 

let nDebugLevel = 0;
let bFullSpeed = false;	/* If true, run at full speed with no delay between steps */
let bIsReset = false;		/* true if the machine has been reset, false if it is or has been running */
let sTape = "";				/* Contents of TM's tape. Stores all cells that have been visited by the head */
let nTapeOffset = 0;		/* the logical position on TM tape of the first character of sTape */
let nHeadPosition = 0;		/* the position of the TM's head on its tape. Initially zero; may be negative if TM moves to left */
let sState = "0";
let nSteps = 0;
let nVariant = 0; /* Machine variant. 0 = standard infinite tape, 1 = tape infinite in one direction only, 2 = non-deterministic TM */
let hRunTimer = null;
let aProgram = new Object();
let aResult = null;
//     /* aProgram is a double asociative array, indexed first by state then by symbol.
//       Its members are arrays of objects with properties newSymbol, action, newState, breakpoint and sourceLineNumber.
//     */

let nMaxUndo = 10;  /* Maximum number of undo steps */
let aUndoList = [];
//     /* aUndoList is an array of 'deltas' in the form {previous-state, direction, previous-symbol}. */

//     /* Variables for the source line numbering, markers */
let nTextareaLines = "";
let oTextarea = "";
let bIsDirty = true;	/* If true, source must be recompiled before running machine */
let oRegExp = new RegExp();
// let oNextLineMarker = $("<div class='NextLineMarker'>Next<div class='NextLineMarkerEnd'></div></div>");
// let oPrevLineMarker = $("<div class='PrevLineMarker'>Prev<div class='PrevLineMarkerEnd'></div></div>");
// let sPreviousStatusMsg = "";

export default {
  name: 'TuringMachine',
  props: {
    msg: String,
  },
  data() {
    return {
      
    }
   
  },
  methods: {
    StopTimer()
    {
      if( hRunTimer != null ) {
        window.clearInterval( hRunTimer );
        hRunTimer = null;
      }
    },
    GetTapeSymbol( n )
    {
      if( n < nTapeOffset || n >= sTape.length + nTapeOffset ) {
        this.debug( 4, "GetTapeSymbol( " + n + " ) = '" + c + "'   outside sTape range" );
        return( "_" );
      } else {
        var c = sTape.charAt( n - nTapeOffset );
        if( c == " " ) { c = "_"; this.debug( 4, "Warning: GetTapeSymbol() got SPACE not _ !" ); }
        this.debug( 4, "GetTapeSymbol( " + n + " ) = '" + c + "'" );
        return( c );
      }
    },
    UpdateInterface()
    {
      // this.RenderTape();
      // this.RenderState();
      // this.RenderSteps();
      // this.RenderLineMarkers();
    },
    LoadSampleProgram( zName, zFriendlyName, bInitial ){
      this.debug( 1, "Load '" + zName + "'" );
      this.SetStatusMessage( "Loading sample program..." );
      var zFileName = "machines/" + zName + ".txt";
      
      this.StopTimer();   /* Stop machine, if currently running */
      
      $.ajax({
        url: zFileName,
        type: "GET",
        dataType: "text",
        success: function( sData ) {
          /* Load the default initial tape, if any */
          var oRegExp = new RegExp( ";.*\\$INITIAL_TAPE:? *(.+)$" );
          var aRegexpResult = oRegExp.exec( sData );
          if( aRegexpResult != null && aRegexpResult.length >= 2 ) {
            this.debug( 4, "Parsed initial tape: '" + aRegexpResult + "' length: " + (aRegexpResult == null ? "null" : aRegexpResult.length) );
            $("#InitialInput")[0].value = aRegexpResult[1];
            sData = sData.replace( /^.*\$INITIAL_TAPE:.*$/m, "" );
          }
          $("#InitialState")[0].value = "0";
          nVariant = 0;
          $("#MachineVariant").val(0);
          this.VariantChanged(false);
          /* TODO: Set up CSS */

          /* Load the program */
          oTextarea.value = sData;
          this.TextareaChanged();
          this.Compile();
          
          /* Reset the machine  */
          this.Reset();
          if( !bInitial ) this.SetStatusMessage( zFriendlyName + " successfully loaded", 1 );
        },
        error: function( oData, sStatus, oRequestObj ) {
          this.debug( 1, "Error: Load failed. HTTP response " + oRequestObj.status + " " + oRequestObj.statusText );
          this.SetStatusMessage( "Error loading " + zFriendlyName + " :(", 2 );
        }
      });
      
      $("#LoadMenu").slideUp();
      this.ClearSaveMessage();
    },
    ClearSaveMessage()
    {
      $("#SaveStatusMsg").empty();
      $("#SaveStatus").hide();
    },
    TextareaChanged()
    {
      /* Update line numbers only if number of lines has changed */
      var nNewLines = (oTextarea.value.match(/\n/g) ? oTextarea.value.match(/\n/g).length : 0) + 1;
      if( nNewLines != nTextareaLines ) {
        nTextareaLines = nNewLines
        this.UpdateTextareaDecorations();
      }
      
    //	Compile();
      bIsDirty = true;
      this.RenderLineMarkers();
    },
    VariantChanged(needWarning)
      {
        var dropdown = $("#MachineVariant")[0];
        var selected = Number(dropdown.options[dropdown.selectedIndex].value);
        var descriptions = {
          0: "Standard Turing machine with tape infinite in both directions",
          1: "Turing machine with tape infinite in one direction only (as used in, eg, <a href='http://math.mit.edu/~sipser/book.html'>Sipser</a>)",
          2: "Non-deterministic Turing machine which allows multiple rules for the same state and symbol pair, and chooses one at random"
        };
        $("#MachineVariantDescription").html( descriptions[selected] );
        if( needWarning ) this.ShowResetMsg(true);
      },
    moveTapeRight() {
        translateRight(this.$refs.MachineHead, 10)

    },
    SetSyntaxMessage( msg )
    {
      $("#SyntaxMsg").text( (msg?msg:"") )
    },
    SetStatusMessage( sString )
    {
      $( "#MachineStatusMsgText" ).text( sString );
      // if( nBgFlash > 0 ) {
      //   $("#MachineStatusMsgBg").stop(true, true).css("background-color",(nBgFlash==1?"#c9f2c9":"#ffb3b3")).show().fadeOut(600);
      // }
      // if( sString != "" && sPreviousStatusMsg == sString && nBgFlash != -1 ) {
      //   $("#MachineStatusMsgBg").stop(true, true).css("background-color","#bbf8ff").show().fadeOut(600);
      // }
      // if( sString != "" ) sPreviousStatusMsg = sString;
    },
    debug ( n, str )
    {
      if( n <= 0 ) {
        // SetStatusMessage( str, null);
        console.log( str );
      }
      if( nDebugLevel >= n  ) {
        $("#debug").append( document.createTextNode( str + "\n" ) );
        console.log( str );
      }
    },
    ClearErrorLines() {
      $(".talinebg").removeClass('talinebgerror');
    },  
    SetErrorLine( num )
    {
      $("#talinebg"+(num+1)).addClass('talinebgerror');
    },
    Compile()
    {
      var sSource = oTextarea.value;
      // debug( 2, "Compile()" );
      
      /* Clear syntax error messages */
      // SetSyntaxMessage( null );
      this.ClearErrorLines();
      
      /* clear the old program */
      aProgram = new Object;
      
      sSource = sSource.replace( /\r/g, "" );	/* Internet Explorer uses \n\r, other browsers use \n */
      
      var aLines = sSource.split("\n");
      for( var i = 0; i < aLines.length; i++ )
      {
        var oTuple = this.ParseLine( aLines[i], i );
        if( oTuple.isValid ) {
          this.debug( 5, " Parsed tuple: '" + oTuple.currentState + "'  '" + oTuple.currentSymbol + "'  '" + oTuple.newSymbol + "'  '" + oTuple.action + "'  '" + oTuple.newState + "'" );
          if( aProgram[oTuple.currentState] == null ) aProgram[oTuple.currentState] = new Object;
          if( aProgram[oTuple.currentState][oTuple.currentSymbol] == null ) {
            aProgram[oTuple.currentState][oTuple.currentSymbol] = [];
          }
          if( aProgram[oTuple.currentState][oTuple.currentSymbol].length > 0 && nVariant != 2 ) {
            // Multiple conflicting instructions found.
            this.debug( 1, "Warning: multiple definitions for state '" + oTuple.currentState + "' symbol '" + oTuple.currentSymbol + "' on lines " + (aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber+1) + " and " + (i+1) );
            this.SetSyntaxMessage( "Warning: Multiple definitions for state '" + oTuple.currentState + "' symbol '" + oTuple.currentSymbol + "' on lines " + (aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber+1) + " and " + (i+1) );
            this.SetErrorLine( i );
            this.SetErrorLine( aProgram[oTuple.currentState][oTuple.currentSymbol][0].sourceLineNumber );
            aProgram[oTuple.currentState][oTuple.currentSymbol][0] = this.createTuringInstructionFromTuple( oTuple, i );
          } else {
            aProgram[oTuple.currentState][oTuple.currentSymbol].push( this.createTuringInstructionFromTuple( oTuple, i ) );
          }
        }
        else if( oTuple.error )
        {
          /* Syntax error */
          this.debug( 2, "Syntax error: " + oTuple.error );
          this.SetSyntaxMessage( oTuple.error );
          this.SetErrorLine( i );
        }
      }
      
      /* Set debug level, if specified */
      oRegExp = new RegExp( ";.*\\$DEBUG: *(.+)" );
      aResult = oRegExp.exec( sSource );
      if( aResult != null && aResult.length >= 2 ) {
        var nNewDebugLevel = parseInt( aResult[1] );
        if( nNewDebugLevel != nDebugLevel ) {
          nDebugLevel = parseInt( aResult[1] );
          this.debug( 1, "Setting debug level to " + nDebugLevel );
          if( nDebugLevel > 0 ) $(".DebugClass").toggle( true );
        }
      }
      
      
      bIsDirty = false;
      
      this.UpdateInterface();
    },
    createTuringInstructionFromTuple( tuple, line )
    {
      return {
        newSymbol: tuple.newSymbol,
        action: tuple.action,
        newState: tuple.newState,
        sourceLineNumber: line,
        breakpoint: tuple.breakpoint
      };
    },
    RunButton(){
      // RunButton()
      console.log(nDebugLevel)
      console.log(bIsReset)
      console.log(bFullSpeed)
    },
    GetNextInstructions( sState, sHeadSymbol )
    {
      var result = null;
      if( aProgram[sState] != null && aProgram[sState][sHeadSymbol] != null ) {
        /* Use instructions specifically corresponding to current state & symbol, if any */
        return( aProgram[sState][sHeadSymbol] );
      } else if( aProgram[sState] != null && aProgram[sState]["*"] != null ) {
        /* Next use rules for the current state and default symbol, if any */
        return( aProgram[sState]["*"] );
      } else if( aProgram["*"] != null && aProgram["*"][sHeadSymbol] != null ) {
        /* Next use rules for default state and current symbol, if any */
        return( aProgram["*"][sHeadSymbol] );
      } else if( aProgram["*"] != null && aProgram["*"]["*"] != null ) {
        /* Finally use rules for default state and default symbol */
        return( aProgram["*"]["*"] );
      } else {
        return( [] );
      }
    },
    Step ()
    {
      if( bIsDirty) this.Compile();
      
      bIsReset = false;
      if( sState.substring(0,4).toLowerCase() == "halt" ) {
        /* debug( 1, "Warning: Step() called while in halt state" ); */
        this.SetStatusMessage( "Halted." );
        this.EnableControls( false, false, false, true, true, true, true );
        return( false );
      }
      
      var sNewState, sNewSymbol, nAction, nLineNumber;
      
      /* Get current symbol */
      var sHeadSymbol = this.GetTapeSymbol( nHeadPosition );
      
      /* Find appropriate TM instruction */
      var aInstructions = this.GetNextInstructions( sState, sHeadSymbol );
      var oInstruction;
      if( aInstructions.length == 0 ) {
        // No matching instruction found. Error handled below.
        oInstruction = null;
      } else if( nVariant == 2 ) {
        // Non-deterministic TM. Choose an instruction at random.
        oInstruction = aInstructions[Math.floor(Math.random()*aInstructions.length)];
      } else {
        // Deterministic TM. Choose the first (and only) instruction.
        oInstruction = aInstructions[0];
      }
      
      if( oInstruction != null ) {
        sNewState = (oInstruction.newState == "*" ? sState : oInstruction.newState);
        sNewSymbol = (oInstruction.newSymbol == "*" ? sHeadSymbol : oInstruction.newSymbol);
        nAction = (oInstruction.action.toLowerCase() == "r" ? 1 : (oInstruction.action.toLowerCase() == "l" ? -1 : 0));
        if( nVariant == 1 && nHeadPosition == 0 && nAction == -1 ) {
          nAction = 0;  /* Can't move left when already at left-most tape cell. */
        }
        nLineNumber = oInstruction.sourceLineNumber;
      } else {
        /* No matching rule found; halt */
        this.debug( 1, "Warning: no instruction found for state '" + sState + "' symbol '" + sHeadSymbol + "'; halting" );
        this.SetStatusMessage( "Halted. No rule for state '" + sState + "' and symbol '" + sHeadSymbol + "'.", 2 );
        sNewState = "halt";
        sNewSymbol = sHeadSymbol;
        nAction = 0;
        nLineNumber = -1;
      }
      
      /* Save undo information */
      if( nMaxUndo > 0 ) {
        if( aUndoList.length >= nMaxUndo ) aUndoList.shift();  /* Discard oldest undo entry */
        aUndoList.push({state: sState, position: nHeadPosition, symbol: sHeadSymbol});
      }
      
      /* Update machine tape & state */
      this.SetTapeSymbol( nHeadPosition, sNewSymbol );
      sState = sNewState;
      nHeadPosition += nAction;
      
      nSteps++;
      
      
      this.debug( 4, "Step() finished. New tape: '" + sTape + "'  new state: '" + sState + "'  action: " + nAction + "  line number: " + nLineNumber  );
      this.UpdateInterface();
      
      if( sNewState.substring(0,4).toLowerCase() == "halt" ) {
        if( oInstruction != null ) {
          this.SetStatusMessage( "Halted." );
        } 
        this.EnableControls( false, false, false, true, true, true, true );
        return( false );
      } else {
        if( oInstruction.breakpoint ) {
          this.SetStatusMessage( "Stopped at breakpoint on line " + (nLineNumber+1) );
          this.EnableControls( true, true, false, true, true, true, true );
          return( false );
        } else {
          return( true );
        }
      }
    },
    ParseLine( sLine, nLineNum )
    {
      /* discard anything following ';' */
      this.debug( 5, "ParseLine( " + sLine + " )" );
      sLine = sLine.split( ";", 1 )[0];

      /* split into tokens - separated by tab or space */
      var aTokens = sLine.split(/\s+/);
      aTokens = aTokens.filter( function (arg) { return( arg != "" ) ;} );
    /*	debug( 5, " aTokens.length: " + aTokens.length );
      for( var j in aTokens ) {
        debug( 1, "  aTokens[ " + j + " ] = '" + aTokens[j] + "'" );
      }*/

      var oTuple = new Object;
      
      if( aTokens.length == 0 )
      {
        /* Blank or comment line */
        oTuple.isValid = false;
        return( oTuple );
      }
      
      oTuple.currentState = aTokens[0];
      
      if( aTokens.length < 2 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": missing <current symbol>!" ;
        return( oTuple );
      }
      if( aTokens[1].length > 1 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": <current symbol> should be a single character!" ;
        return( oTuple );
      }
      oTuple.currentSymbol = aTokens[1];
      
      if( aTokens.length < 3 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": missing <new symbol>!" ;
        return( oTuple );
      }
      if( aTokens[2].length > 1 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": <new symbol> should be a single character!" ;
        return( oTuple );
      }
      oTuple.newSymbol = aTokens[2];
      
      if( aTokens.length < 4 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": missing <direction>!" ;
        return( oTuple );
      }
      if( ["l","r","*"].indexOf( aTokens[3].toLowerCase() ) < 0 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": <direction> should be 'l', 'r' or '*'!";
        return( oTuple );
      }
      oTuple.action = aTokens[3].toLowerCase();

      if( aTokens.length < 5 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": missing <new state>!" ;
        return( oTuple );
      }
      oTuple.newState = aTokens[4];
      
      if( aTokens.length > 6 ) {
        oTuple.isValid = false;
        oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": too many entries!" ;
        return( oTuple );
      }
      if( aTokens.length == 6 ) {		/* Anything other than '!' in position 6 is an error */
        if( aTokens[5] == "!" ) {
          oTuple.breakpoint = true;
        } else {
          oTuple.isValid = false;
          oTuple.error = "Syntax error on line " + (nLineNum + 1) + ": too many entries!";
          return( oTuple );
        }
      } else {
        oTuple.breakpoint = false;
      }

      oTuple.isValid = true;
      return( oTuple );
    },
    Run () {
      var bContinue = true;
      if( bFullSpeed ) {
        /* Run 25 steps at a time in fast mode */
        for( var i = 0; bContinue && i < 25; i++ ) {
          bContinue = this.Step();
        }
        if( bContinue ) hRunTimer = window.setTimeout( this.Run, 10 );
        else this.UpdateInterface();   /* Sometimes updates get lost at full speed... */
      } else {
        /* Run a single step every 50ms in slow mode */
          if( this.Step() ) {
            hRunTimer = window.setTimeout( this.Run, 50 );
          }
        }
    },
  

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
