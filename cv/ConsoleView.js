"use strict";
px.import({scene: 'px:scene.1.js',
            keys: 'px:tools.keys.js'
          }).then( function ready(imports)
{
  var CONSOLE_VERSION = "1.0";

  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;

  var easterTimer = null;
  var easterKeys  = "";

  //var easterTrigger = "" + keys.CONTROL + "" + keys.M    + "" + keys.DOWN + "" + keys.DOWN + 
  var easterTrigger = "" + keys.UP      + "" + keys.DOWN + "" + keys.DOWN + 
                      "" + keys.FIVE    + "" + keys.FOUR + "" + keys.SIX; // UP DOWN DOWN 5 4 6 ... aka  "LOG" 

  // OK
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var TEXT_SIZE        = 12;
  var COLOR_TEXT       = 0x53f600FF;
  var COLOR_BACKGROUND = 0x000000FF;
  
  var COLOR_ACTIVE     = 0xccccccFF;
  var COLOR_INACTIVE   = 0xaaaaaaFF;

  var OVERLAY_ALPHA    = 0.55;
  var OVERLAY_BG_COLOR = 0x222222ff;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Parameters on the URL allow PAGE UP/DOWN and ARROW keys to be enabled. 

  var USE_PAGE_KEYS     = false;  // "pageKeys"
  var USE_ARROW_KEYS    = false;  // "arrowKeys" 
  var USE_CONSOLE_INDEX = -1;     // "consoleIndex" 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var childScene = null;

  var style      = [ "off", "overlay", "top_right" ];
  var styleIndex = 0; 
  var consoleClr = [ 0xaaaaaaFF ];
//  var consoleClr = [ "#f00", "#0f0", "#00f", "#000", "#fff"];
  var colorIndex = 0;

  var lineH          = 1;
  var linesPerScreen = 1;

  var save_sx    = 1.0;
  var save_sy    = 1.0;

  var historyMax = 500; // lines
  var history    = [];

  var base       = px.getPackageBaseFilePath();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var fontRes = scene.create({t:"fontResource",url:"FreeSans.ttf"});

  var inset_x = 25;
  var inset_y = 10;

  var consoleIO  = scene.create({t: "object",   parent: scene.root,  interactive: false, x:       0, y:  0, w: 1200,           h: 600, draw: false, clip: true });
  var consoleBg  = scene.create({t: "rect",     parent: consoleIO,   interactive: false, x:       0, y:  0, w: 1200,           h: 600, fillColor: COLOR_BACKGROUND});
  var consoleTxt = scene.create({t: "textBox" , parent: consoleIO,   interactive: false, x: inset_x, y:  0, w: 1200 - inset_x, h: 600 - inset_y,
                              text: "TESTING", textColor: COLOR_TEXT, font: fontRes, pixelSize: TEXT_SIZE, wordWrap: true, 
                   alignHorizontal: scene.alignHorizontal.LEFT,
                     alignVertical: scene.alignVertical.TOP    });

  var scrollFrame    = scene.create({t: "rect",   parent: consoleBg,   interactive: true, x: 0, y: 0, w: 20, h: 720, fillColor: 0x888888FF});
  var scrollKnob     = scene.create({t: "rect",   parent: scrollFrame, interactive: true, x: 0, y: 0, w: 20, h: 720, fillColor: COLOR_INACTIVE});
  var scrollKnobMinH = 20;

  var scrollKnobMoved = false;

  var mouseDownY    = 0;
  var mouseDown     = false;
  var mouseDragging = false;

  function mouseInactive()                    { mouseDown = false; scrollKnob.fillColor = COLOR_INACTIVE; };
  function mouseActive(e)                     { mouseDown = true;  scrollKnob.fillColor = COLOR_ACTIVE; mouseDownY = e.y; };

  scene.on("onMouseLeave",        function(e) { mouseInactive();                  mouseDragging = false; } );
  scene.on("onMouseMove",         function(e) { if(mouseDown) { mouseMoveKnob(e); mouseDragging = true;  } } ); // MOVE KNOB

  scrollKnob.on("onMouseUp",      function(e) { mouseInactive(); } );
  scrollKnob.on("onMouseDown",    function(e) { mouseActive(e);  } );

  scrollFrame.on("onMouseLeave",  function(e) { if(mouseDragging == true) { mouseInactive(); mouseDragging = false; } } );
  scrollFrame.on("onMouseDown",   function(e) { mouseActive();   } );
  scrollFrame.on("onMouseUp",     function(e) { if(!mouseDragging) mouseMoveKnob(e); mouseInactive(); mouseDragging = false; } );

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function scrollByLines(lines)
  {
    var historyH =  ( history.length * lineH   );
    var max_y    = -( historyH - scrollFrame.h );
    var min_y    = 0;

    var dy = consoleTxt.y + (lines * lineH);

    dy = (dy < max_y) ? max_y :     // << Negative scroll of 'consoleTxt' upward in parent (clipped)
         (dy > min_y) ? min_y : dy; // clamp min/max vertically

    // Scroll the Text ...
    consoleTxt.y = dy;

    // Move the Knob ...
    var pwr     = Math.abs(consoleTxt.y / (historyH - consoleBg.h));
    var frame_h = scrollFrame.y + (scrollFrame.h - scrollKnob.h);

    scrollKnob.y = frame_h * pwr;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function scrollLineUp(dy)   { scrollByLines( 1); }
  function scrollLineDn(dy)   { scrollByLines(-1); }

  function scrollScreenUp(dy) { scrollByLines( linesPerScreen); }
  function scrollScreenDn(dy) { scrollByLines(-linesPerScreen); }

  function scrollToTop()      { scrollByLines(  999999); }
  function scrollToBottom()   { scrollByLines( -999999); }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function mouseMoveKnob(e)
  {
    var dy = (e.y - 10) - mouseDownY; // allow for pointer arrow

    var historyH = ( history.length * lineH );

    var max_y  = scrollFrame.y + (scrollFrame.h - scrollKnob.h);
    var min_y  = scrollFrame.y;

    dy = (dy > max_y) ? max_y :
         (dy < min_y) ? min_y : dy; // clamp min/max vertically

    // Move the Knob ...
    scrollKnob.y = dy;

    // Scroll the Text ...
    var      pwr = (scrollKnob.y / (scrollFrame.h - scrollKnob.h));
    consoleTxt.y = -pwr * (historyH - consoleBg.h);

    scrollKnobMoved = true; // User moved it !
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([ fontRes.ready, consoleIO.ready, consoleBg.ready, consoleTxt.ready, scrollFrame.ready, scrollKnob.ready ])
  .catch( (err) =>
  {
      console.log("Console >> Loading Assets ... err = " + err);
  })
  .then( (success, failure) =>
  {
    captureConsole();

    var fm = consoleTxt.font.getFontMetrics(consoleTxt.pixelSize);
    lineH = (fm.height + consoleTxt.leading);

    linesPerScreen = consoleIO.h / lineH;

    consoleTxt.h = lineH * historyMax;
  });

  scene.root.on("onKeyDown", function(e)
  {
    console.log("DEBUG: onKeyDown > [ " + e.keyCode + " ]");

    var code = e.keyCode; var flags = e.flags;

    if( keys.is_CTRL( flags ) )
    {
      switch(code)
      {
        case keys.PAGEUP:    if(USE_PAGE_KEYS) scrollToTop();    break;  // CTRL + PAGEUP   >>  JUMP TO TOP
        case keys.PAGEDOWN:  if(USE_PAGE_KEYS) scrollToBottom(); break;  // CTRL + PAGEDOWN >>  JUMP TO BOTTOM
       // case keys.M:         possibleEasterEgg(); break;
      }
    }
    else
    if( keys.is_CTRL_ALT( flags ) )
    {
      switch(code)
      {
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          case keys.C: // ctrl-alt-C
          {
              toggleConsole();
          }
          break
      }//SWITCH
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    }// ctrl-alt
    else
    if( keys.is_CTRL_ALT_SHIFT( flags ) )
    {
      switch(code)
      {
        case keys.C:  // ctrl-alt-shft-c
        {
          if(consoleIO.draw)
          {
            colorIndex = (colorIndex++ >= consoleClr.length ) ? 0 : colorIndex;
            consoleTxt.textColor = scene.getColor( consoleClr[colorIndex] );
          }
        }
        break;
      }//SWITCH
    }
    else
    {
      // console.log("DEBUG: onKeyDown > [ " + e.keyCode + " ]   << No Key modifier");

      // No Key modifier
      switch(code)
      {
        //case keys.M:         possibleEasterEgg(); break;
        case keys.UP:      possibleEasterEgg();  if(USE_ARROW_KEYS) scrollLineUp();  break;
        case keys.DOWN:    addEasterKey(code);   if(USE_ARROW_KEYS) scrollLineDn();  break;
        
        case keys.PAGEUP:                        if(USE_PAGE_KEYS) scrollScreenUp(); break;
        case keys.PAGEDOWN:                      if(USE_PAGE_KEYS) scrollScreenDn(); break;

        default: 
        {
          addEasterKey(code);
        }
      } // SWITCH
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function possibleEasterEgg()
  {
     if(easterTimer != null)
     {
       clearTimeout(easterTimer);
       easterTimer = null; // reset
       easterKeys  = "";   // reset
     }

//    easterKeys += "" + keys.CONTROL + "" + keys.M;
    easterKeys += "" + keys.UP;

     easterTimer = setTimeout( function(o) 
     {
        // Timeout
        easterTimer = null; // reset
        easterKeys  = "";   // reset

     }, 9000); // 2 seconds
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function addEasterKey(c)
  {
    if(easterTimer != null)
    {
      easterKeys += ("" + c)

//      console.log("DEBUG: easterKeys > [ " + easterKeys + " ]");

      if(easterKeys == easterTrigger)
      {
        if(easterTimer)
        {
          clearTimeout(easterTimer);

          easterTimer = null; // reset
          easterKeys  = "";   // reset
        }

        toggleConsole();
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function toggleConsole()
  {
    styleIndex = (styleIndex++ >= style.length ) ? 0 : styleIndex;

    if(USE_CONSOLE_INDEX >= 0)
    {
      consoleIO.draw = !consoleIO.draw;
      var showIndex = (consoleIO.draw ? USE_CONSOLE_INDEX : 0);

      showConsole(style[ showIndex ]);
    }
    else
    {
      consoleIO.draw = (styleIndex != 0);

      showConsole(style[ styleIndex ]);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function releaseConsole()
  {
    if (typeof console.olog != 'undefined')
    {
      console.log    = console.olog;
      console.warn   = console.owarn;
      console.error  = console.oerror;

      console.olog   =  null;
      console.owarn  =  null;
      console.oerror =  null;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function captureConsole()
  {
    if (typeof console != "undefined")
    {
      if (typeof console.log != 'undefined')
      {
        console.olog   = console.log;
        console.owarn  = console.warn;
        console.oerror = console.error;
      }
    }
    else
    {
      console.olog   = function() {};
      console.owarn  = function() {};
      console.oerror = function() {};
    }

    console.log = function(message)
    {
      appendLog(message);
      console.olog(message); // LOG
    };

    console.warn = function(message)
    {
      consoleTxt.text += "\n" + message;
      console.owarn(message); // WARN
    };

    console.error= function(message)
    {
      consoleTxt.text += "\n" + message;
      console.oerror(message); // ERROR
    };
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function getScrollPwr()  // returns normalized scroll position 
  {
    return (scrollKnob.y + scrollKnob.h) / (scrollFrame.h);// - scrollKnob.h + 1)); // pre-change position.
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function appendLog(txt)
  {
    txt = txt + ""; // NB: Force to string

    var lines = txt.split("\n"); // process multi-line output...

    // Add lines to history
    for(var l = 0; l < lines.length; l++)
    {
      if(history.length > historyMax)
      {
        history.shift();                // remove from HEAD
      }
      history.push( lines[l] + "\n" );  // append at   TAIL
    }

    // Assemble new string
    var txt = "";
    for(var h = 0; h < history.length; h++)
    {
      txt += history[h];
    }

    // Update the Console text ...
    consoleTxt.text = txt;

    // Update metrics ...
    var linesPerScreen = ( consoleIO.h / lineH    );
    var historyH       = ( history.length * lineH );

    var pwr            = getScrollPwr(); // old PWR

    // Size the Knob ...
    var newKnobH = (1 - (history.length / historyMax)) * scrollFrame.h;
    scrollKnob.h = (newKnobH > scrollKnobMinH) ? newKnobH : scrollKnobMinH;

     if(pwr == 1)
     {
        scrollKnobMoved = false; // back at bottom
     }

    if(scrollKnobMoved == false)
    {
      // Scroll & Move the Knob ...
      scrollKnob.y =  pwr * (scrollFrame.h - scrollKnob.h);
      consoleTxt.y = -pwr * (historyH - consoleBg.h);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function showConsole(style)
  {
    var new_x = 0;
    var new_y = 0;

    // defaults
    var scale  = 0.66; // 33% shorter

    var new_sy = scale; 
    var new_sx = scale;

    var new_w  = (scene.w * new_sx);
    var new_h  = (scene.h * new_sy);

    consoleBg.a = 1;

    if(childScene != null)
    {
      childScene.moveToFront();
    }

    switch(style)
    {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
      case "off": 
      {
        consoleIO.draw = false;

        history         = []; // reset
        consoleTxt.text = ""; // reset

        new_x  = 0;
        new_y  = 0;
        new_sx = save_sx;
        new_sy = save_sy;
      }
      break;
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      case "overlay":
      {
        console.log("\n\n#####  ConsoleView v. " + CONSOLE_VERSION + " \n\n");
        consoleBg.a         = OVERLAY_ALPHA;
        consoleBg.fillColor = OVERLAY_BG_COLOR;

        consoleIO.moveToFront();

        new_x  = 0;
        new_y  = 0;
        new_sx = save_sx;
        new_sy = save_sy;
      }
      break;
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      case "top_right":
      {
        console.log("\n\n#####  ConsoleView v. " + CONSOLE_VERSION + " \n\n");
        new_x = (scene.w - new_w);
      }
      break;
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      default:
        return; //skip
    } //SWITCH

    if(childScene != null)
    {
      childScene.animateTo({x: new_x, y: new_y, sx: new_sx, sy: new_sy}, 0.5, scene.animation.TWEEN_STOP).catch(() => {});
    }

    consoleIO.animateTo({a: 1}, 0.5, scene.animation.TWEEN_STOP).catch(() => {});
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function updateSize(w, h)
  {
    if(childScene != null)
    {
      childScene.w = w;
      childScene.h = h;
    }

    consoleIO.w = w;
    consoleIO.h = h;

    consoleBg.w = consoleIO.w;
    consoleBg.h = consoleIO.h;

    consoleTxt.w = w - inset_x;
    consoleTxt.h = lineH * historyMax;

    linesPerScreen = consoleIO.h / lineH;

    scrollFrame.h = consoleIO.h;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // Get the url to launch
  var url = px.appQueryParams.url;

  //console.log("px.appQueryParams.consoleIndex: ["+px.appQueryParams.consoleIndex+"]");

  USE_PAGE_KEYS     = (px.appQueryParams.pageKeys     == 'true');
  USE_ARROW_KEYS    = (px.appQueryParams.arrowKeys    == 'true');
  USE_CONSOLE_INDEX = (px.appQueryParams.consoleIndex != 'undefined' ? parseInt(px.appQueryParams.consoleIndex) : 0);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) { updateSize(e.w, e.h); });
  scene.on("onClose",  function(e) { releaseConsole();     }); // tidy up.

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if(url != null && url.length > 0)
  { 
    // Now, start the url that was passed in
    childScene = scene.create( { t:'scene', parent:root, url:url, w: scene.w, h: scene.h } );
    childScene.focus = true;

    childScene.ready.then(function(o) 
    {
      updateSize(scene.w, scene.h);
    })
  }
  else
  {
    updateSize(scene.w, scene.h);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for ConsoleView.js failed: " + err)
});