
<template>
  <div class="main-section">
        
        <div id="MachineProgramContainer">
          <div class="BoxTitle">Turing machine program</div>
              <div id="MachineProgramBlock">
              <div id="MachineProgramBlock2">
                <div id="SourceContainer">
                <div id="SourceBackground">
                </div>
                <div id="tabackground">
                <!-- no indenting, because text inside textarea is verbatim !-->
                <!-- @keypress="TextareaChanged" -->
                <textarea id="Source" wrap="off"  oninput="TextareaChanged();" onscroll="UpdateTextareaScroll();" onblur="Compile();" title="This is the Turing machine's program. See documentation below for syntax.">
                ; Load a program from the menu or write your own!
                </textarea>
                </div>
                </div>
                <div id="SyntaxMsg"></div>
              </div> <!-- div MachineProgramBlock2 !-->
          </div> <!-- div MachineProgramBlock !-->
        </div> <!-- div MachineProgramContainer !--> 

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
            <span title="Select the speed of execution for the Turing Machine">
              <div title="Choose between different Turing machine variants">
                Select the speed of execution:
                <select id="MachineSpeed" @change="ChangeExecutionSpeed($event)">
                  <option value="600" selected="selected">Very slow</option>
                  <option value="400">Slow</option>
                  <option value="200">Average</option>
                  <option value="100">Fast</option>
                  <option value="50">Very Fast</option>

                </select>
              </div>
            </span>
            <button id="RunButton" @click="RunButton" title="Start the machine running">Run</button> <!-- &#x25b8; !--> <!-- Unicode 'play' symbol !-->
            <span title="If enabled, runs as fast as your browser &amp; computer allow">
              <input type="checkbox" id="SpeedCheckbox" @click="SpeedCheckbox">Run at full speed
            </span>
           
            <br>
            <button id="StopButton" @click="StopButton" disabled="disabled" title="Pause the machine when running">Pause</button><br> <!-- &#x25fe; !-->
            <button id="UndoButton" @click="Undo" title="Undo one machine step" style="float: right;">Undo</button>
            <button id="StepButton" @click="StepButton" title="Run the machine for a single step and the pause">Step</button><br> <!-- &#x25b8;&#x2759; !-->
            <button id="ResetButton" @click="ResetButton" title="Reset the machine and tape to the initial state">Reset</button> <!-- &#x2759;&#x23ea; !-->
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
              <select @change="VariantChanged($event)" id="MachineVariant">
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
import palindromeProgram from "../machines/palindrome.txt"
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
let oPrevInstruction = "";
let gameSpeed = 500;

export default {
  name: 'TuringMachine',
  props: {
    msg: String,
  },
  data() {
    return {
      nSteps, bIsReset, oPrevInstruction
    }
   
  },
  mounted: function(){
    this.$nextTick(function(){
      // Will be executed when the DOM is ready 
      this.OnLoad()
    })
  }, 
  methods: {
    StopTimer()
    {
      if( hRunTimer != null ) {
        window.clearInterval( hRunTimer );
        hRunTimer = null;
      }
    },
    LoadFromCloud( sID )
    {
      var n = sID.indexOf('&');
      sID = sID.substring(0, n != -1 ? n : sID.length);

      /* Get data from github */
      $.ajax({
        url: "https://api.github.com/gists/" + sID,
        type: "GET",
        dataType: "json",
        success: () => { this.loadSuccessCallback },
        error: () => { this.loadErrorCallback }
      });
    },
    ChangeExecutionSpeed(event){
      console.log(event);
      gameSpeed = event;
    },
    loadErrorCallback( oData, sStatus, oRequestObj )
    {
      this.debug( 1, "Error: Load failed. AJAX request to Github failed. HTTP response " + oRequestObj );
      this.SetStatusMessage( "Error loading saved machine :(", 2 );
    },
    loadSuccessCallback( oData )
    {
      if( !oData || !oData.files || !oData.files["machine.json"] || !oData.files["machine.json"].content ) {
        this.debug( 1, "Error: Load AJAX request succeeded but can't find expected data." );
        this.SetStatusMessage( "Error loading saved machine :(", 2 );
        return;
      }
      var oUnpackedObject;
      try {
        oUnpackedObject = JSON.parse( oData.files["machine.json"].content );
      } catch( e ) {
        this.debug( 1, "Error: Exception when unpacking JSON: " + e );
        this.SetStatusMessage( "Error loading saved machine :(", 2 );
        return;
      }
      this.LoadMachineSnapshot( oUnpackedObject );
    },
    LoadMachineSnapshot( oObj )
    {
      if( oObj.version && oObj.version != 1 ) this.debug( 1, "Warning: saved machine has unknown version number " + oObj.version );
      if( oObj.program ) oTextarea.value = oObj.program;
      if( oObj.state ) sState = oObj.state;
      if( oObj.tape ) sTape = oObj.tape;
      if( oObj.tapeoffset ) nTapeOffset = oObj.tapeoffset;
      if( oObj.headposition ) nHeadPosition = oObj.headposition;
      if( oObj.steps ) nSteps = oObj.steps;
      if( oObj.initialtape ) $("#InitialInput")[0].value = oObj.initialtape;
      if( oObj.initialstate ) {
        $("#InitialState")[0].value = oObj.initialstate;
      } else {
        $("#InitialState")[0].value = "";
      }
      if( oObj.fullspeed ) {
        $("#SpeedCheckbox")[0].checked = oObj.fullspeed;
        bFullSpeed = oObj.fullspeed;
      }
      if( oObj.variant ) {
        nVariant = oObj.variant;
      } else {
        nVariant = 0;
      }
      $("#MachineVariant").val(nVariant);
      this.VariantChanged(false);
      this.SetupVariantCSS();
      aUndoList = [];
      if( sState.substring(0,4).toLowerCase() == "halt" ) {
        this.SetStatusMessage( "Machine loaded. Halted.", 1 );
        this.EnableControls( false, false, false, true, true, true, true );
      } else {
        this.SetStatusMessage( "Machine loaded and ready", 1  );
        this.EnableControls( true, true, false, true, true, true, true );
      }
      this.TextareaChanged();
      this.Compile();
      this.UpdateInterface();
    },
    Undo ()
    {
      var oUndoData = aUndoList.pop();
      if( oUndoData ) {
        nSteps--;
        sState = oUndoData.state;
        nHeadPosition = oUndoData.position;
        this.SetTapeSymbol( nHeadPosition, oUndoData.symbol );
        oPrevInstruction = null;
        this.debug( 3, "Undone one step. New state: '" + sState + "' position : " + nHeadPosition + " symbol: '" + oUndoData.symbol + "'" );
        this.EnableControls( true, true, false, true, true, true, true );
        this.SetStatusMessage( "Undone one step." /*+ (aUndoList.length == 0 ? " No more undoes available." : " (" + aUndoList.length + " remaining)")*/ );
        this.UpdateInterface();
      } else {
        this.debug( 1, "Warning: Tried to undo with no undo data available!" );
      }
    },
    StopButton()
    {
      if( hRunTimer != null ) {
        this.SetStatusMessage( "Paused; click 'Run' or 'Step' to resume." );
        this.EnableControls( true, true, false, true, true, true, true );
        this.StopTimer();
      }
    },
    StepButton()
    {
      this.SetStatusMessage( "", -1 );
      this.Step();
      this.EnableUndoButton(true);
    },
    ResetButton()
    {
      this.SetStatusMessage( "Machine reset. Click 'Run' or 'Step' to start." );
      this.Reset();
      this.EnableControls( true, true, false, true, true, true, false );
    },
    EnableControls( bStep, bRun, bStop, bReset, bSpeed, bTextarea, bUndo )
    {
      document.getElementById('StepButton').disabled = !bStep;
      document.getElementById('RunButton').disabled = !bRun;
      document.getElementById('StopButton').disabled = !bStop;
      document.getElementById('ResetButton').disabled = !bReset;
      document.getElementById('SpeedCheckbox').disabled = !bSpeed;
      document.getElementById('Source').disabled = !bTextarea;
      this.EnableUndoButton(bUndo);
      if( bSpeed ) {
        $( "#SpeedCheckboxLabel" ).removeClass( "disabled" );
      } else {
        $( "#SpeedCheckboxLabel" ).addClass( "disabled" );
      }
    },
    EnableUndoButton(bUndo)
    {
      document.getElementById( 'UndoButton' ).disabled = !(bUndo && aUndoList.length > 0);
    },
    SpeedCheckbox ()
    {
      bFullSpeed = $( '#SpeedCheckbox' )[0].checked;
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
      this.RenderTape();
      this.RenderState();
      this.RenderSteps();
      this.RenderLineMarkers();
    },
    RenderTape()
    {
      /* calculate the strings:
        sFirstPart is the portion of the tape to the left of the head
        sHeadSymbol is the symbol under the head
        sSecondPart is the portion of the tape to the right of the head
      */
      var nTranslatedHeadPosition = nHeadPosition - nTapeOffset;  /* position of the head relative to sTape */
      var sFirstPart, sHeadSymbol, sSecondPart;
      this.debug( 4, "RenderTape: translated head pos: " + nTranslatedHeadPosition + "  head pos: " + nHeadPosition + "  tape offset: " + nTapeOffset );
      this.debug( 4, "RenderTape: sTape = '" + sTape + "'" );

      if( nTranslatedHeadPosition > 0 ) {
        sFirstPart = sTape.substr( 0, nTranslatedHeadPosition );
      } else {
        sFirstPart = "";
      }
      if( nTranslatedHeadPosition > sTape.length ) {  /* Need to append blanks to sFirstPart.  Shouldn't happen but just in case. */
        sFirstPart += this.repeat( " ", nTranslatedHeadPosition - sTape.length );
      }
      sFirstPart = sFirstPart.replace( /_/g, " " );
      
      if( nTranslatedHeadPosition >= 0 && nTranslatedHeadPosition < sTape.length ) {
        sHeadSymbol = sTape.charAt( nTranslatedHeadPosition );
      } else {
        sHeadSymbol = " ";	/* Shouldn't happen but just in case */
      }
      sHeadSymbol = sHeadSymbol.replace( /_/g, " " );
      
      if( nTranslatedHeadPosition >= 0 && nTranslatedHeadPosition < sTape.length - 1 ) {
        sSecondPart = sTape.substr( nTranslatedHeadPosition + 1 );
      } else if( nTranslatedHeadPosition < 0 ) {  /* Need to prepend blanks to sSecondPart. Shouldn't happen but just in case. */
        sSecondPart = this.repeat( " ", -nTranslatedHeadPosition - 1 ) + sTape;
      } else {  /* nTranslatedHeadPosition > sTape.length */
        sSecondPart = "";
      }
      sSecondPart = sSecondPart.replace( /_/g, " " );
      
      this.debug( 4, "RenderTape: sFirstPart = '" + sFirstPart + "' sHeadSymbol = '" + sHeadSymbol + "'  sSecondPart = '" + sSecondPart + "'" );
      
      /* Display the parts of the tape */
      $("#LeftTape").text( sFirstPart );
      $("#ActiveTape").text( sHeadSymbol );
      $("#RightTape").text( sSecondPart );
    //	debug( 4, "RenderTape(): LeftTape = '" + $("#LeftTape").text() + "' ActiveTape = '" + $("#ActiveTape").text() + "' RightTape = '" + $("#RightTape").text() + "'" );
      
      /* Scroll tape display to make sure that head is visible */
      if( $("#ActiveTapeArea").position().left < 0 ) {
        $("#MachineTape").scrollLeft( $("#MachineTape").scrollLeft() + $("#ActiveTapeArea").position().left - 10 );
      } else if( $("#ActiveTapeArea").position().left + $("#ActiveTapeArea").width() > $("#MachineTape").width() ) {
        $("#MachineTape").scrollLeft( $("#MachineTape").scrollLeft() + ($("#ActiveTapeArea").position().left - $("#MachineTape").width()) + 10 );
      }
    },
    SetTapeSymbol( n, c )
    {
      this.debug( 4, "SetTapeSymbol( " + n + ", " + c + " ); sTape = '" + sTape + "' nTapeOffset = " + nTapeOffset );
      if( c == " " ) { c = "_"; this.debug( 4, "Warning: SetTapeSymbol() with SPACE not _ !" ); }
      
      if( n < nTapeOffset ) {
        sTape = c + this.repeat( "_", nTapeOffset - n - 1 ) + sTape;
        nTapeOffset = n;
      } else if( n > nTapeOffset + sTape.length ) {
        sTape = sTape + this.repeat( "_", nTapeOffset + sTape.length - n - 1 ) + c;
      } else {
        sTape = sTape.substr( 0, n - nTapeOffset ) + c + sTape.substr( n - nTapeOffset + 1 );
      }
    },
    repeat ( c, n )
    {
      var sTmp = "";
      while( n-- > 0 ) sTmp += c;
      return sTmp;
    },
    RenderState()
    {
      $("#MachineState").text( sState );
    },
    RenderSteps()
    {
      $("#MachineSteps").text( nSteps );
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
        success: ( sData ) => {
          
          sData = palindromeProgram;
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
    Reset()
    {
      var sInitialTape = $("#InitialInput")[0].value;

      /* Find the initial head location, if given */
      nHeadPosition = sInitialTape.indexOf( "*" );
      if( nHeadPosition == -1 ) nHeadPosition = 0;

      /* Initialise tape */
      sInitialTape = sInitialTape.replace( /\*/g, "" ).replace( / /g, "_" );
      if( sInitialTape == "" ) sInitialTape = " ";
      sTape = sInitialTape;
      nTapeOffset = 0;
      
      /* Initialise state */
      var sInitialState = $("#InitialState")[0].value;
      sInitialState = $.trim( sInitialState ).split(/\s+/)[0];
      if( !sInitialState || sInitialState == "" ) sInitialState = "0";
      sState = sInitialState;
      
      /* Initialise variant */
      var dropdown = $("#MachineVariant")[0];
      nVariant = Number(dropdown.options[dropdown.selectedIndex].value);
      this.SetupVariantCSS();
      
      nSteps = 0;
      bIsReset = true;
      
      this.Compile();
      oPrevInstruction = null;
      
      aUndoList = [];
      
      this.ShowResetMsg(false);
      this.EnableControls( true, true, false, true, true, true, false );
      this.UpdateInterface();
    },
    SetupVariantCSS()
    {
      if( nVariant == 1 ) {
        $("#LeftTape").addClass( "OneDirectionalTape" );
      } else {
        $("#LeftTape").removeClass( "OneDirectionalTape" );
      }
    },
    ShowResetMsg(b)
    {
      if( b ) {
        $("#ResetMessage").fadeIn();
        $("#ResetButton").addClass("glow");
      } else {
        $("#ResetMessage").hide();
        $("#ResetButton").removeClass("glow");
      }
    },
    ClearSaveMessage()
    {
      $("#SaveStatusMsg").empty();
      $("#SaveStatus").hide();
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
        this.SetStatusMessage( str, null);
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
    OnLoad () 
    {
        if( nDebugLevel > 0 ) $(".DebugClass").toggle( true );
        
        if( typeof( isOldIE ) != "undefined" ) {
          this.debug( 1, "Old version of IE detected, adding extra textarea events" );
          /* Old versions of IE need onkeypress event for textarea as well as onchange */
          $("#Source").on( "keypress change", this.TextareaChanged);
        }

        oTextarea = $("#Source")[0];
        this.TextareaChanged();
        
        this.VariantChanged(false); /* Set up variant description */
        
        if( window.location.search != "" ) {
          this.SetStatusMessage( "Loading saved machine..." );
          this.LoadFromCloud( window.location.search.substring( 1 ) );
          window.history.replaceState( null, "", window.location.pathname );  /* Remove query string from URL */
        } else {
          this.LoadSampleProgram( 'palindrome', 'Default program', true );
          this.SetStatusMessage( 'Load or write a Turing machine program and click Run!' );
        }
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
      oPrevInstruction = null;
      this.RenderLineMarkers();
    },
    UpdateTextareaDecorations()
    {
      var oBackgroundDiv = $("#SourceBackground");
      
      oBackgroundDiv.empty();
      
      var sSource = oTextarea.value;
      sSource = sSource.replace( /\r/g, "" );	/* Internet Explorer uses \n\r, other browsers use \n */
      
      var aLines = sSource.split("\n");
      
      for( var i = 0; i < aLines.length; i++)
      {
        oBackgroundDiv.append($("<div id='talinebg"+(i+1)+"' class='talinebg'><div class='talinenum'>"+(i+1)+"</div></div>"));
      }
      
      this.UpdateTextareaScroll();
    },
    UpdateTextareaScroll ()
    {
      var oBackgroundDiv = $("#SourceBackground");
      
      $(oBackgroundDiv).css( {'margin-top': (-1*$(oTextarea).scrollTop()) + "px"} );
    },
    RenderLineMarkers()
    {
      var oNextList = $.map(this.GetNextInstructions( sState, this.GetTapeSymbol( nHeadPosition ) ), function(x){return(x.sourceLineNumber);} );
      this.debug( 3, "Rendering line markers: " + (oNextList) + " " + (oPrevInstruction?oPrevInstruction.sourceLineNumber:-1) );
      this.SetActiveLines( oNextList, (oPrevInstruction?oPrevInstruction.sourceLineNumber:-1) );
    },
    SetActiveLines( next, prev )
    {
        $(".talinebgnext").removeClass('talinebgnext');
        $(".NextLineMarker").remove();
        $(".talinebgprev").removeClass('talinebgprev');
        $(".PrevLineMarker").remove();
        
        var shift = false;
        var oMarker = null;
        for( var i = 0; i < next.length; i++ )
        {
          oMarker = $("<div class='NextLineMarker'>Next<div class='NextLineMarkerEnd'></div></div>");
          $("#talinebg"+(next[i]+1)).addClass('talinebgnext').prepend(oMarker);
          if( next[i] == prev ) {
            oMarker.addClass('shifted');
            shift = true;
          }
        }
        if( prev >= 0 )
        {
          oMarker = $("<div class='PrevLineMarker'>Prev<div class='PrevLineMarkerEnd'></div></div>");
          if( shift ) {
            $("#talinebg"+(prev+1)).prepend(oMarker);
            oMarker.addClass('shifted');
          } else {
            $("#talinebg"+(prev+1)).addClass('talinebgprev').prepend(oMarker);
          }
        }
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
    RunButton () {
      this.SetStatusMessage( "Running..." );
      /* Make sure that the step interval is up-to-date */
      this.SpeedCheckbox();
      this.EnableControls( false, false, true, false, false, false, false );
      this.Run();
    },
    GetNextInstructions( sState, sHeadSymbol )
    {
      // var result = null;
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
            // hRunTimer = window.setTimeout( this.Run, 50 );
            hRunTimer = window.setTimeout( this.Run, gameSpeed );
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
