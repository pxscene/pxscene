px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           shots:"../test-run/tools_screenshot.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = scene.root;
var assert = imports.assert.assert;
var shots = imports.shots;
var manual = imports.manual;

var doScreenshot = false;
var manualTest = manual.getManualTestValue();
var timeoutForScreenshot = 40;

var basePackageUri = px.getPackageBaseFilePath();

//var textA = "ÉéÈèÇçËëÒòÔôÖöÙùÀàÂâAaBbCcDdEeFfGgHhIiKkLlMmNnOoPpQqRrSsTtVvXxYyZz123456789";
//var longText = textA + "\n" + textA + "\n" + textA;
// "Hello!  How are you?";//
// Use fontUrl to load from web
var fontUrlStart = "http://www.pxscene.org/examples/px-reference/fonts/";
var pacifico = "Pacifico.ttf";
var DejaVu = "DejaVuSans.ttf";
var DejaVuSerif = "DejaVuSerif.ttf";
var DancingScriptReg = "DancingScript-Regular.ttf";
var DancingScriptBold = "DancingScript-Bold.ttf";
// Different text strings to test
var longText = "Here is a collection of a bunch of randomness, like words, phrases, and sentences that isn't supposed to make any kind of sense whatsoever. I want to test capital AV next to each other here. In generating this, I'm listening to someone talking, trying to make sense of what they are saying, and at the same time dictating to myself what I am going to type along with actually typing it out, recognizing when I make mistakes, and correcting myself when I do.";
var longText2 = "I don't think I'm doing a very good job listening to whoever it is that is doing the talking right now.  It probably would have been a lot easier to just copy and paste something from the net, but I'm a typist, not a person that hunts and pecks to find the appropriate key on the keyboard.  Though I do think I'm probably off of my 30 word per minute speed from way back when.  How much more text is appropriate?  Why do I use words like appropriate when I could just say will do instead?  These and other questions generally go on unanswered.  But looking at the output of this text, I realize that its simply not enough and that I need to add more text; which is making me wonder why I simply didn't copy and paste in the first place.  Ah, yes, the strange musings of a software engineer.";
var longText3 = longText + " " +longText2;
var shortText = "Hello!  How are you?";
var mediumText = "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
var newlineText = "Paragraph\nParagraph longer\nParagraph more";
root.w=800;

// Use the font vars below to preload fonts so that they stay loaded. 

var fontPacifico = scene.create({t:"fontResource",url:fontUrlStart+pacifico});
var fontDejaVu = scene.create({t:"fontResource",url:fontUrlStart+DejaVu});
var fontDejaVuSerif = scene.create({t:"fontResource",url:fontUrlStart+DejaVuSerif});
var fontDancingScriptReg = scene.create({t:"fontResource",url:fontUrlStart+DancingScriptReg});
var fontDancingScriptBold = scene.create({t:"fontResource",url:fontUrlStart+DancingScriptBold});

fontPacifico.ready.then(function(f) {
  console.log("Ready for fontPacifico font!");
  var tmpMetrics = f.getFontMetrics(35);
 	console.log("height is "+tmpMetrics.height);
	console.log("ascent is "+tmpMetrics.ascent);
	console.log("descent is "+tmpMetrics.descent);
  console.log("naturalLeading is "+tmpMetrics.naturalLeading);
  console.log("baseline is "+tmpMetrics.baseline); 
  
  var tmpMeasure = f.measureText(35, "Help me, please!");
  console.log("font measurements w="+tmpMeasure.w);
  console.log("font measurements h="+tmpMeasure.h);
  
});



var bg = scene.create({t:"object", parent:root, x:100, y:100, w:1000, h:1000, clip:false});
var rect = scene.create({t:"rect", parent:root, x:100, y:100, w:400, h:400, fillColor:0x00000000, lineColor:0xFF0000FF, lineWidth:1, clip:false});
var container = scene.create({t:"object", parent:root, x:100, y:100, w:800, h:600, clip:false});

// Widgets for displaying metrics values 
var height = scene.create({t:"text", parent:root, x:50, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Height="});
var ascent = scene.create({t:"text", parent:root, x:50, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Ascent="});
var descent = scene.create({t:"text", parent:root, x:50, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Descent="});
var naturalLeading = scene.create({t:"text", parent:root, x:50, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"NatLead="});
var baseline  = scene.create({t:"text", parent:root, x:50, y:80, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"Baseline="});
var boundsX1 = scene.create({t:"text", parent:root, x:200, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX1="});
var boundsY1 = scene.create({t:"text", parent:root, x:200, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY1="});
var boundsX2 = scene.create({t:"text", parent:root, x:200, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsX2="});
var boundsY2 = scene.create({t:"text", parent:root, x:200, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"BoundsY2="});
var charFirstX = scene.create({t:"text", parent:root, x:400, y:0, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charFirstX="});
var charFirstY = scene.create({t:"text", parent:root, x:400, y:20, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charFirstY="});
var charLastX = scene.create({t:"text", parent:root, x:400, y:40, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charLastX="});
var charLastY = scene.create({t:"text", parent:root, x:400, y:60, textColor:0xFFDDFFFF, pixelSize:15,clip:false,text:"charLastY="});
 
// widgets for tracking current property settings
var truncationStatus = scene.create({t:"text", parent:root, x:20, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"truncation=truncate"});
var wrapStatus = scene.create({t:"text", parent:root, x:20, y:container.y+440, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"wordWrap=true"});
var hAlignStatus = scene.create({t:"text", parent:root, x:20, y:container.y+460, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"hAlign=left"});
var vAlignStatus = scene.create({t:"text", parent:root, x:20, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"vAlign=top"});
var ellipsisStatus = scene.create({t:"text", parent:root, x:20, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"ellipsis=true"});
var pixelSizeStatus = scene.create({t:"text", parent:root, x:20, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"pixelSize=20"});
var pixelSizeHint = scene.create({t:"text", parent:root, x:140, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use p and P)"});
var textStatus = scene.create({t:"text", parent:root, x:350, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"text=longest"});
var textHint = scene.create({t:"text", parent:root, x:465, y:container.y+420, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use small s)"});
var clipStatus = scene.create({t:"text", parent:root, x:350, y:container.y+440, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"clip=true"});
var xStartPosStatus = scene.create({t:"text", parent:root, x:350, y:container.y+460, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"xStartPos=0"});
var xStopPosStatus = scene.create({t:"text", parent:root, x:350, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"xStopPos=0"});
var xStopPosHint = scene.create({t:"text", parent:root, x:465, y:container.y+480, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use small L)"});
var leadingStatus = scene.create({t:"text", parent:root, x:350, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"leading=0"});
var leadingHint = scene.create({t:"text", parent:root, x:465, y:container.y+500, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"(use + -)"});
var fontStatus = scene.create({t:"text", parent:root, x:350, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"font="+pacifico+" (http)"});
var leading = 0;


var text2 = scene.create({t:"textBox", clip:true, parent:container, x:0, y:0, rx:0, ry:0, rz:0});
   text2.h=400;
   text2.w=400;
   text2.textColor=0xFFDDFFFF;
   text2.pixelSize=20;
   text2.leading=0;
   text2.fontUrl=fontUrlStart+pacifico;
   text2.alignHorizontal=0;
   text2.alignVertical=0;
   text2.xStartPos=0;
   text2.xStopPos=0;
	 text2.wordWrap=true;
   text2.ellipsis=true;
   text2.truncation=1;

   text2.text=longText3;

                 
var metrics = null;
var measurements = null;

var showMeasurements = function() {
    var bounds = measurements.bounds;
    var charFirst = measurements.charFirst;
    var charLast = measurements.charLast;
    var w = bounds.x2 - bounds.x1;
    var spacing = metrics.height + text2.leading;
    var x = bounds.x1;//0;
    var y = bounds.y1;//0;
    var green = 0x00FF0077;
    var blue = 0x0000FF77;
    var red = 0xFF000077;
    var yellow = 0xFFFF0077;
    var orange = 0xFF8C0077;
    var pink = 0xFF00FF77;
    do {
        scene.create({t:"rect", parent:bg, fillColor:green, x:x, y:y + metrics.baseline - metrics.ascent, w:w, h:metrics.ascent});
        scene.create({t:"rect", parent:bg, fillColor:blue, x:x, y:y + metrics.baseline, w:w, h:metrics.descent});
        scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:red, lineWidth:1, x:x, y:y, w:w, h:metrics.height});
        y += spacing;
    } while (y < bounds.y2);
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:yellow, lineWidth:1, x:bounds.x1, y:bounds.y1, w:w, h:bounds.y2 - bounds.y1});
    scene.create({t:"rect", fillColor:0x00000000, parent:bg, lineColor:pink, lineWidth:1, x:charFirst.x, y:charFirst.y, w:charLast.x - charFirst.x, h:(charLast.y - charFirst.y)==0?1:(charLast.y - charFirst.y)});
}
text2.ready.then(function(text) {
    console.log("!CLF: First Promise received");
    textready(text);

  });

var textready = function(text) {
	console.log("inside text2.ready");
  console.log("text2.h="+text2.h+" and text2.w="+text2.w);

	metrics = text2.font.getFontMetrics(text2.pixelSize);
	console.log("metrics h="+metrics.height);
	console.log("metrics a="+metrics.ascent);
	console.log("metrics d="+metrics.descent);
  console.log("metrics naturalLeading="+metrics.naturalLeading);
  console.log("metrics baseline="+metrics.baseline);

  measurements = text2.measureText();
  console.log("measurements boundsX1="+measurements.bounds.x1);
  console.log("measurements boundsY1="+measurements.bounds.y1);
  console.log("measurements boundsX2="+measurements.bounds.x2);
  console.log("measurements boundsY2="+measurements.bounds.y2);
  console.log("measurements charFirstX="+measurements.charFirst.x);
  console.log("measurements charFirstY="+measurements.charFirst.y);
  console.log("measurements charLastX="+measurements.charLast.x);
  console.log("measurements charLastY="+measurements.charLast.y);

  height.text="Height="+metrics.height;
  ascent.text="Ascent="+metrics.ascent;
  descent.text="Descent="+metrics.descent;
  naturalLeading.text="NatLead="+metrics.naturalLeading;
  baseline.text="Baseline="+metrics.baseline;
  boundsX1.text="BoundsX1="+measurements.bounds.x1;
  boundsY1.text="BoundsY1="+measurements.bounds.y1;
  boundsX2.text="BoundsX2="+measurements.bounds.x2;
  boundsY2.text="BoundsY2="+measurements.bounds.y2;
  charFirstX.text="charFirstX="+measurements.charFirst.x;
  charFirstY.text="charFirstY="+measurements.charFirst.y;
  charLastX.text="charLastX="+measurements.charLast.x;
  charLastY.text="charLastY="+measurements.charLast.y;

  
  showMeasurements();
}

/** HELPER FUNCTIONS FOR CHANGING TEXT2 PROPERTIES **/
var cycleValues = function(v) {
    console.log("v is "+v);
    if( v >= 2) {
      v = 0;
    } else {
      v++;
    }
    console.log("v is now"+v);
    return v;
}
var setText = function(textValue,hintText) {
     text2.text = textValue; 
     textStatus.text = hintText;
}
var toggleWordWrap = function() {
    text2.wordWrap = !text2.wordWrap;
    if( text2.wordWrap) {
      wrapStatus.text ="wordWrap=true";
    } else {
      wrapStatus.text ="wordWrap=false";
    }
}
var toggleEllipsis = function() {
  text2.ellipsis = !text2.ellipsis;
  if( text2.ellipsis) {
    ellipsisStatus.text ="ellipsis=true";
  } else {
    ellipsisStatus.text ="ellipsis=false";
  }
}

var toggleClip = function() {
    text2.clip  = !text2.clip;
    if( text2.clip) {
      clipStatus.text ="clip=true";
    } else {
      clipStatus.text ="clip=false";
    }  
}
var setFont = function(fontName, hintText) {
    text2.font = fontName;
    fontStatus.text = hintText;
}

var setAlignH = function(ha) {

  text2.alignHorizontal = ha;

  if(ha == 0) {
    hAlignStatus.text="hAlign=left";
  } else if(ha == 1) {
    hAlignStatus.text="hAlign=center";
  } else {
    hAlignStatus.text="hAlign=right";
  }   
}
var setAlignV = function(va){
  text2.alignVertical = va;
  if(va == 0) {
    vAlignStatus.text="vAlign=top";
  } else if(va == 1) {
    vAlignStatus.text="vAlign=center";
  } else {
    vAlignStatus.text="vAlign=bottom";
  }
}
var setTruncation = function(t) {
  text2.truncation = t;
  if(t == 0) {
    truncationStatus.text="truncation=none";
  } else if(t == 1) {
    truncationStatus.text="truncation=truncate";
  } else {
    truncationStatus.text="truncation=truncate at word boundary";
  }
}

var setPixelSize = function(p) {
  text2.pixelSize = p;
  pixelSizeStatus.text="pixelSize="+p;
}
var setLeading = function(l) {
  text2.leading = l;
  leadingStatus.text="leading="+l;
}

var setXStartPos = function(s) {
  text2.xStartPos = s; 
  xStartPosStatus.text="xStartPos="+s;
}

var setXStopPos = function(s) {
  text2.xStopPos = s; 
  xStopPosStatus.text="xStopPos="+s;
}

/** OnChar to interactively change text2 values */
scene.root.on("onChar", function(e) {
  var v; 
  if (e.charCode == 119) { // w for wordWrap
    toggleWordWrap();

  } 
  else if(e.charCode == 116) { // t for truncation

    setTruncation(cycleValues(text2.truncation));

  } 
  else if(e.charCode == 101) { // e for ellipsis
      toggleEllipsis();
  } 
  else if(e.charCode == 104) { // h for alignHorizontal
    setAlignH(cycleValues(text2.alignHorizontal));
  
  } else if(e.charCode == 118) { // v for alignVertical
    setAlignV(cycleValues(text2.alignVertical));
   
  } 
  else if(e.charCode == 99) { // c for clip
    toggleClip();
  } 
  else if(e.charCode ==120) { // x for xStartPos
    if(text2.xStartPos == 0) {
      setXStartPos(25);
    } else {
      setXStartPos(0);
    }
  } 
  else if(e.charCode ==108) { // l for xStopPos
    if(text2.xStopPos == 0) {
      setXStopPos(325);
    } else {
      setXStopPos(0);
    }
  } 
  else if(e.charCode == 43) { // + for leading+5
      setLeading(text2.leading + 5); 
  } 
  else if(e.charCode == 45) { // - for leading+5
      setLeading(text2.leading -5); 
  } 
  // Change text value 
  else if(e.charCode == 115) { // s for text
    if(textStatus.text == "text=longest") {
      setText( shortText,"text=short");
    } else if(textStatus.text == "text=short"){
      setText( mediumText,"text=medium");
    } else if(textStatus.text == "text=medium"){
      setText(newlineText,"text=newlines");
    } else if(textStatus.text == "text=newlines"){
      setText(longText,"text=long");
    } else if(textStatus.text == "text=long"){
      setText(longText2, "text=longer");
    } else if(textStatus.text == "text=longer"){
      setText(longText3,"text=longest");
    }
  } 
  else if(e.charCode == 112) { // p for increasing pixelSize
    if(text2.pixelSize == 60) {
      setPixelSize(15);
     } else {
       setPixelSize(text2.pixelSize+5);
    }
    
  } 
  else if(e.charCode == 80) { // P for reducing pixelSize
    if(text2.pixelSize == 15) {
      setPixelSize(60);

     } else {
       setPixelSize(text2.pixelSize - 5);
    }
  } 
  else if(e.charCode == 102) { // f for font
    if(fontStatus.text == "font="+pacifico+" (http)") {
      setFont(fontDejaVu,"font="+DejaVu+" (http)");
     } else if(fontStatus.text == "font="+DejaVu+" (http)"){
       setFont(fontDancingScriptReg, "font="+DancingScriptReg+" (http)");
    } else if(fontStatus.text == "font="+DancingScriptReg+" (http)"){
      setFont(fontDejaVuSerif,"font="+DejaVuSerif+" (http)");
    } else if(fontStatus.text == "font="+DejaVuSerif+" (http)"){
      setFont(fontDancingScriptBold,"font="+DancingScriptBold+" (http)");
    } else if(fontStatus.text == "font="+DancingScriptBold+" (http)"){
      setFont(fontPacifico,"font="+pacifico+" (http)");
    }
    var font = text2.font;
    font.ready.then(function(f){
      console.log("Font is ready url="+f.url);
      var status = f.loadStatus;
      console.log("status is ");
      console.log(status);
      console.log("Font is ready loadStatus.statusCode="+f.loadStatus.statusCode);
      });
  }
  
  bg.removeAll();
  text2.ready.then(function(text) {
    console.log("!CLF: Promise received");
    textready(text);

  });
});
/**********************************************************************/
/**                                                                   */
/**            pxscene tests go in this section                       */
/**                                                                   */
/**********************************************************************/
var expectedTextDesc = [
  ["bounds", "x1"], 
  ["bounds", "y1"], 
  ["bounds", "x2"], 
  ["bounds", "y2"], 
  ["charFirst", "x"], 
  ["charFirst", "y"], 
  ["charLast", "x"], 
  ["charLast", "y"]
  
];
var expectedValuesMeasure = {
  // bounds.x1, bounds.y1, bounds.x2, bounds.y2, charFirst.x, charFirst.y, charLast.x, charLast.y
  "shortTextNoWrapH0":[0,0,190,35,0,26,190,26], // shortTextNoWrapH0
  "shortTextNoWrapH1":[105,0,295,35,105,26,295,26], // shortTextNoWrapH1
  "shortTextNoWrapH2":[210,0,400,35,210,26,400,26], // shortTextNoWrapH2
  "shortTextNoWrapH0V1":[0,182.5,190,217.5,0,208.5,190,208.5], // shortTextNoWrapH0V1
  "shortTextNoWrapH0V2":[0,365,190,400,0,391,190,391], // shortTextNoWrapH0V2
  "shortTextNoWrapH1V1":[105,182.5,295,217.5,105,208.5,295,208.5], //shortTextNoWrapH1V1
  "shortTextNoWrapH1V2":[105,365,295,400,105,391,295,391], //shortTextNoWrapH1V2
  "shortTextNoWrapH2V1":[210,182.5,400,217.5,210,208.5,400,208.5], //shortTextNoWrapH2V1
  "shortTextNoWrapH2V2":[210,365,400,400,210,391,400,391], //shortTextNoWrapH2V2
  "longestTextNoWrapNoTruncateNoClipH0V0":[0,0,2035,35,0,26,2035,26], //longestTextNoWrapNoTruncateNoClipH0V0
  "longestTextNoWrapNoTruncateNoClipH1V0":[-809,0,1209,35,-809,26,1209,26], //longestTextNoWrapNoTruncateNoClipH1V0
  "longestTextWrapNoTruncateNoClipH0V1":[0,-272.5,400,672.5,0,-246.5,146,663.5], //longestTextWrapNoTruncateNoClipH0V1
  "longestTextWrapNoTruncateNoClipH0V2":[0,-545,400,400,0,-519,146,391], //longestTextWrapNoTruncateNoClipH0V2
  "longestTextNoWrapNoTruncateNoClipH0V1":[0,182.5,2035,217.5,0,208.5,2035,208.5], //longestTextNoWrapNoTruncateNoClipH0V1
  "longestTextNoWrapNoTruncateNoClipH0V2":[0,365,2035,400,0,391,2035,391], //longestTextNoWrapNoTruncateNoClipH0V2
  "longestTextWrapTruncateNoClipH0V0":[0,0,400,385,0,26,399,376], //longestTextWrapNoTruncateNoClipH0V0
  "longestTextWrapTruncateNoClipH0V1":[0,7.5,400,392.5,0,33.5,399,383.5], //longestTextWrapNoTruncateNoClipH0V1
  "longestTextWrapTruncateNoClipH0V2":[0,15,400,400,0,41,399,391], //longestTextWrapTruncateNoClipH0V2
  "longestTextWrapTruncateNoClipH1V0":[16.5,0,400,385,16,26,399.5,376], //longestTextWrapNoTruncateNoClipH0V0
  "longestTextWrapTruncateNoClipH1V1":[16.5,7.5,400,392.5,16,33.5,399.5,383.5], //longestTextWrapNoTruncateNoClipH0V1
  "longestTextWrapTruncateNoClipH1V2":[16.5,15,400,400,16,41,399.5,391], //longestTextWrapTruncateNoClipH1V2
  "newlinesTextNoWrapTruncateClipH1V1":[118.5,264.5,281.5,236,151,184,275.5,232], //newlinesTextNoWrapTruncateClipH1V1
};

var textMeasurementResults = function(values) {
  var results = [];
  var numResults = values.length;
  for( var i = 0; i < numResults; i++) {

    results[i] = assert(measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]] === values[i], "measurements "+expectedTextDesc[i][0]+"."+expectedTextDesc[i][1]+" should be "+values[i]+" but is "+measurements[expectedTextDesc[i][0]][expectedTextDesc[i][1]]);
  }
  return results;
}

var beforeStart = function() {
  return new Promise(function(resolve, reject) {

    // Setup all properties as assumed for start of tests
    // set to short text, wordWrap=false, pixelSize, hAlign=left 
    setFont(fontPacifico,"font="+pacifico+" (http)");
    if( text2.wordWrap) {
      toggleWordWrap();
    }
    setPixelSize(20);
    setLeading(0);
    setAlignH(0);
    setAlignV(0);
    if( text2.clip) {
      toggleClip();
    }
    setTruncation(0);
    if( text2.ellipsis) {
      toggleEllipsis();
    }
    setXStartPos(0);
    setXStopPos(0);
  
  
    resolve("text2tests.js beforeStart");
  });
}

var doScreenshotComparison = function(name, resolve, reject) 
{
    var results =  textMeasurementResults(expectedValuesMeasure[name]);

    //shots.takeScreenshot(false).then(function(link){
      shots.validateScreenshot(basePackageUri+"/images/screenshot_results/text2tests_"+name+".png", false).then(function(match){
        console.log("test result is match: "+match);
        results.push(assert(match == true, "screenshot comparison for "+name+" failed"));
        resolve(results);
      //});
    }).catch(function(err) {
        results.push(assert(false, "screenshot comparison for "+name+" failed due to error: "+err));
        resolve(results);
    });
 
}

var tests = {

 shortTextNoWrapH0: function() {
  console.log("text2tests.js shortTextNoWrapH0");
  setText( shortText,"text=short");
  setAlignH(0);
  setAlignV(0);
  console.log("shortTextNoWrapH0 is "+expectedValuesMeasure.shortTextNoWrapH0);
  
  return new Promise(function(resolve, reject) {

    text2.ready.then(function() {
      // Test measurements and bounds
      //var results = [];
      bg.removeAll();
      textready(text2);
      if( doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("shortTextNoWrapH0", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH0));
      

    });
  });
},

shortTextNoWrapH0V1: function() {
  console.log("text2tests.js shortTextNoWrapH0V1");

  setText( shortText,"text=short");
  setAlignH(0);
  setAlignV(1);
  
  return new Promise(function(resolve, reject) {

    text2.ready.then(function() {
      // Test measurements and bounds
      //var results = [];
      bg.removeAll();
      textready(text2);
      if( doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("shortTextNoWrapH0V1", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH0V1));

    });
  });
},

  shortTextNoWrapH0V2: function() {
    console.log("text2tests.js shortTextNoWrapH0V2");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(0);
    setAlignV(2);
      
    return new Promise(function(resolve, reject) {

    text2.ready.then(function() {
      // Test measurements and bounds
      //var results = [];
      bg.removeAll();
      textready(text2);
      if( doScreenshot) 
      {
          setTimeout( function() {
            doScreenshotComparison("shortTextNoWrapH0V2", resolve)
          }, timeoutForScreenshot);
      } 
      else 
        resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH0V2));

      });
    });
  },

  shortTextNoWrapH1: function() {
    console.log("text2tests.js shortTextNoWrapH1");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(1);
    setAlignV(0);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH1));

      });
    });
  },
  shortTextNoWrapH1V1: function() {
    console.log("text2tests.js shortTextNoWrapH1");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(1);
    setAlignV(1);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH1V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH1V1));

      });
    });
  },
  shortTextNoWrapH1V2: function() {
    console.log("text2tests.js shortTextNoWrapH1V2");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(1);
    setAlignV(2);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH1V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve( textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH1V2));

      });
    });
  },

  shortTextNoWrapH2: function() {
    console.log("text2tests.js shortTextNoWrapH2");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(2);
    setAlignV(0);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH2));

      });
    });
  },
  shortTextNoWrapH2V1: function() {
    console.log("text2tests.js shortTextNoWrapH2V1");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(2);
    setAlignV(1);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH2V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH2V1));

      });
    });
  }, 
  shortTextNoWrapH2V2: function() {
    console.log("text2tests.js shortTextNoWrapH2V2");
    // set to short text
    setText( shortText,"text=short");
    setAlignH(2);
    setAlignV(2);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("shortTextNoWrapH2V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.shortTextNoWrapH2V2));

      });
    });
  },
  longestTextNoWrapNoTruncateNoClipH0V0: function() {
    console.log("text2tests.js longestTextNoWrapNoTruncateNoClipH0V0");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(0);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextNoWrapNoTruncateNoClipH0V0", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapNoTruncateNoClipH0V0));

      });
    });
  },
  longestTextNoWrapNoTruncateNoClipH1V0: function() {
    console.log("text2tests.js longestTextNoWrapNoTruncateNoClipH1V0");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(1);
    setAlignV(0);
    
    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextNoWrapNoTruncateNoClipH1V0", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapNoTruncateNoClipH1V0));

      });
    });
  },
  longestTextWrapNoTruncateNoClipH0V1: function() {
    console.log("text2tests.js longestTextWrapNoTruncateNoClipH0V1");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(1);
    setTruncation(0);
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapNoTruncateNoClipH0V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapNoTruncateNoClipH0V1));

      });
    });
  },
  longestTextWrapNoTruncateNoClipH0V2: function() {
    console.log("text2tests.js longestTextWrapNoTruncateNoClipH0V2");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(2);
    setTruncation(0);
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapNoTruncateNoClipH0V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapNoTruncateNoClipH0V2));

      });
    });
  },
  longestTextNoWrapNoTruncateNoClipH0V1: function() {
    console.log("text2tests.js longestTextNoWrapNoTruncateNoClipH0V1");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(1);
    setTruncation(0);
    if( text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextNoWrapNoTruncateNoClipH0V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapNoTruncateNoClipH0V1));

      });
    });
  },
  longestTextNoWrapNoTruncateNoClipH0V2: function() {
    console.log("text2tests.js longestTextNoWrapNoTruncateNoClipH0V2");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(2);
    setTruncation(0);
    if( text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextNoWrapNoTruncateNoClipH0V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextNoWrapNoTruncateNoClipH0V2));

      });
    });
  },
  longestTextWrapTruncateNoClipH0V0: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH0V0");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(0);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH0V0", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH0V0));

      });
    });
  },
  longestTextWrapTruncateNoClipH0V1: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH0V1");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(1);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH0V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH0V1));

      });
    });
  },
  longestTextWrapTruncateNoClipH0V2: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH0V2");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(0);
    setAlignV(2);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH0V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH0V2));

      });
    });
  },
  longestTextWrapTruncateNoClipH1V0: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH1V0");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(1);
    setAlignV(0);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH1V0", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH1V0));

      });
    });
  },
  longestTextWrapTruncateNoClipH1V1: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH1V1");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(1);
    setAlignV(1);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH1V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH1V1));

      });
    });
  },
  longestTextWrapTruncateNoClipH1V2: function() {
    console.log("text2tests.js longestTextWrapTruncateNoClipH1V2");
    // set to longest text
    setText( longText3,"text=longest");
    setAlignH(1);
    setAlignV(2);
    setTruncation(1);
    if( text2.clip) {
      toggleClip();
    }
    if( !text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("longestTextWrapTruncateNoClipH1V2", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.longestTextWrapTruncateNoClipH1V2));

      });
    });
  } /*,
  newlinesTextNoWrapTruncateClipH1V1: function() {
    console.log("text2tests.js newlinesTextNoWrapTruncateClipH1V1");
    // set to longest text
    setText(newlineText,"text=newlines");
    setAlignH(1);
    setAlignV(1);
    setTruncation(1);
    if( !text2.clip) {
      toggleClip();
    }
    if( text2.wordWrap) {
      toggleWordWrap();
    }

    return new Promise(function(resolve, reject) {

      text2.ready.then(function() {
        bg.removeAll();
        textready(text2);
        if( doScreenshot) 
        {
            setTimeout( function() {
              doScreenshotComparison("newlinesTextNoWrapTruncateClipH1V1", resolve)
            }, timeoutForScreenshot);
        } 
        else 
          resolve(textMeasurementResults(expectedValuesMeasure.newlinesTextNoWrapTruncateClipH1V1));

      });
    });
  }*/
}
module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}


}).catch( function importFailed(err){
  console.error("Import failed for text2tests.js: " + err)
});
