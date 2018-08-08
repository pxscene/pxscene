px.import("px:scene.1.js").then( function ready(scene) {
  
var root = scene.root;
//var textA = "ÉéÈèÇçËëÒòÔôÖöÙùÀàÂâAaBbCcDdEeFfGgHhIiKkLlMmNnOoPpQqRrSsTtVvXxYyZz123456789";
//var longText = textA + "\n" + textA + "\n" + textA;
// "Hello!  How are you?";//
// Use fontUrl to load from web
var fontUrlStart = "http://www.pxscene.org/examples/px-reference/fonts/";
var IndieFlower = "IndieFlower.ttf";
var DejaVu = "DejaVuSans.ttf";
var DejaVuSerif = "DejaVuSerif.ttf";
var DancingScript = "DancingScript-Regular.ttf";
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

var fontIndieFlower = scene.create({t:"fontResource",url:fontUrlStart+IndieFlower});
var fontDejaVu = scene.create({t:"fontResource",url:fontUrlStart+DejaVu});
var fontDejaVuSerif = scene.create({t:"fontResource",url:fontUrlStart+DejaVuSerif});
var fontDancingScript = scene.create({t:"fontResource",url:fontUrlStart+DancingScript});
var fontDancingScriptBold = scene.create({t:"fontResource",url:fontUrlStart+DancingScriptBold});

fontIndieFlower.ready.then(function(f) {
  console.log("Ready for fontIndieFlower font!");
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
var fontStatus = scene.create({t:"text", parent:root, x:350, y:container.y+520, textColor:0xFFDDFFFF, pixelSize:20,clip:false,text:"font="+IndieFlower+" (http)"});
var px = 0;
var py = 0;
var leading = 0;


var text2 = scene.create({t:"textBox", clip:true, parent:container, x:px, y:py, rx:0, ry:0, rz:0,x:0, y:0});
   text2.h=400;
   text2.w=400;
   text2.textColor=0xFFDDFFFF;
   text2.pixelSize=20;
   text2.leading=0;
   text2.fontUrl=fontUrlStart+IndieFlower;
   text2.alignHorizontal=0;
   text2.alignVertical=0;
   text2.xStartPos=0;
   text2.xStopPos=0;
	 text2.wordWrap=true;
   text2.ellipsis=true;
   text2.truncation=1;

   text2.text=longText3;

                 
//var text2 = scene.create({t:"textBox", wordWrap:true, ellipsis:true, truncation:0,leading:10, clip:false, w:400, h:400, parent:container, textColor:0xFFDDFFFF, pixelSize:20, x:px, y:py, rx:0, ry:1, rz:0});
var metrics = null;
var measurements = null;

function showMeasurements() {
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

function textready(text) {
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

function cycleValues(v) {
    console.log("v is "+v);
    if( v >= 2) {
      v = 0;
    } else {
      v++;
    }
    console.log("v is now"+v);
    return v;
}
scene.root.on("onChar", function(e) {
  var v; 
  if (e.charCode == 119) { // w for wordWrap
    text2.wordWrap = !text2.wordWrap;
    if( text2.wordWrap) {
      wrapStatus.text ="wordWrap=true";
    } else {
      wrapStatus.text ="wordWrap=false";
    }
  } else if(e.charCode == 116) { // t for truncation

    v = cycleValues(text2.truncation);
    text2.truncation = v;
    if(v == 0) {
      truncationStatus.text="truncation=none";
    } else if(v ==1) {
      truncationStatus.text="truncation=truncate";
    } else {
      truncationStatus.text="truncation=truncate at word boundary";
    }
  } else if(e.charCode == 101) { // e for ellipsis
    text2.ellipsis = !text2.ellipsis;
    if( text2.ellipsis) {
      ellipsisStatus.text ="ellipsis=true";
    } else {
      ellipsisStatus.text ="ellipsis=false";
    }    
  } else if(e.charCode == 104) { // h for alignHorizontal
    v = cycleValues(text2.alignHorizontal);
    text2.alignHorizontal = v;
    if(v == 0) {
      hAlignStatus.text="hAlign=left";
    } else if(v ==1) {
      hAlignStatus.text="hAlign=center";
    } else {
      hAlignStatus.text="hAlign=right";
    }   
  } else if(e.charCode == 118) { // v for alignVertical
    v = cycleValues(text2.alignVertical);
    text2.alignVertical = v;
    if(v == 0) {
      vAlignStatus.text="vAlign=top";
    } else if(v ==1) {
      vAlignStatus.text="vAlign=center";
    } else {
      vAlignStatus.text="vAlign=bottom";
    }    
  } else if(e.charCode == 99) { // c for clip
    text2.clip  = !text2.clip;
    if( text2.clip) {
      clipStatus.text ="clip=true";
    } else {
      clipStatus.text ="clip=false";
    }    
  } else if(e.charCode ==120) { // x for xStartPos
    if(text2.xStartPos == 0) {
      text2.xStartPos = 25; 
      xStartPosStatus.text="xStartPos=25";
    } else {
      text2.xStartPos = 0;
      xStartPosStatus.text="xStartPos=0";
    }
  } else if(e.charCode ==108) { // l for xStopPos
    if(text2.xStopPos == 0) {
      text2.xStopPos = 325; 
      xStopPosStatus.text="xStopPos=325";
    } else {
      text2.xStopPos = 0;
      xStopPosStatus.text="xStopPos=0";
    }
  } else if(e.charCode == 43) { // + for leading+5
      text2.leading += 5; 
      leadingStatus.text="leading="+text2.leading;
  } else if(e.charCode == 45) { // - for leading+5
      text2.leading -= 5; 
      leadingStatus.text="leading="+text2.leading;
  } else if(e.charCode == 115) { // s for text
    if(textStatus.text == "text=longest") {
      text2.text = shortText; 
      textStatus.text="text=short";
    } else if(textStatus.text == "text=short"){
      text2.text = mediumText; 
      textStatus.text="text=medium";
    } else if(textStatus.text == "text=medium"){
      text2.text = newlineText; 
      textStatus.text="text=newlines";
    } else if(textStatus.text == "text=newlines"){
      text2.text = longText; 
      textStatus.text="text=long";
    } else if(textStatus.text == "text=long"){
      text2.text = longText2; 
      textStatus.text="text=longer";
    } else if(textStatus.text == "text=longer"){
      text2.text = longText3; 
      textStatus.text="text=longest";
    }
  } else if(e.charCode == 112) { // p for increasing pixelSize
    if(text2.pixelSize == 60) {
      text2.pixelSize = 15; 
     } else {
      text2.pixelSize += 5;
    }
    pixelSizeStatus.text="pixelSize="+text2.pixelSize;
  } else if(e.charCode == 80) { // P for reducing pixelSize
    if(text2.pixelSize == 15) {
      text2.pixelSize = 60; 
     } else {
      text2.pixelSize -= 5;
    }
    pixelSizeStatus.text="pixelSize="+text2.pixelSize;
  } else if(e.charCode == 102) { // f for font
    
    if(fontStatus.text == "font="+IndieFlower+" (http)") {
      text2.font = fontDejaVu;
      //text2.fontUrl = fontUrlStart+DejaVu; 
      fontStatus.text = "font="+DejaVu+" (http)";
     } else if(fontStatus.text == "font="+DejaVu+" (http)"){
       text2.font = fontDancingScript;
      //text2.fontUrl = fontUrlStart+DancingScript; 
      fontStatus.text = "font="+DancingScript+" (http)";
    } else if(fontStatus.text == "font="+DancingScript+" (http)"){
      text2.font = fontDejaVuSerif;
      //text2.fontUrl = fontUrlStart+DejaVuSerif; 
      fontStatus.text = "font="+DejaVuSerif+" (http)";
    } else if(fontStatus.text == "font="+DejaVuSerif+" (http)"){
      text2.font = fontDancingScriptBold;
      //text2.fontUrl = fontUrlStart+DancingScriptBold; 
      fontStatus.text = "font="+DancingScriptBold+" (http)";
    } else if(fontStatus.text == "font="+DancingScriptBold+" (http)"){
      text2.font = fontIndieFlower;
      //text2.fontUrl = fontUrlStart+IndieFlower; 
      fontStatus.text = "font="+IndieFlower+" (http)";
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


}).catch( function importFailed(err){
  console.error("Import failed for text2tests.js: " + err)
});
