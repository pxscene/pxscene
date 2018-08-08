/**  This test will position each row as each single font becomes available */

px.import("px:scene.1.js").then( function ready(scene) {
  
var root = scene.root;


// null or "" is the default font FreeSans.ttf
// Using "" in fonts array tests that local font files can be loaded, too
var fonts = ["",
             "http://www.pxscene.org/examples/px-reference/fonts/DancingScript-Bold.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DancingScript-Regular.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/Pacifico.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/FontdinerSwanky.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/IndieFlower.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/PoiretOne-Regular.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DejaVuSans.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DejaVuSerif.ttf",
            ];

// Example for using getFont for font metrics
var myFonts = [];
var myFontPromises = [];
for (var i=0; i < fonts.length; i++)
{
  myFonts[i] = scene.create({t:"fontResource",url:fonts[i]?fonts[i]:"FreeSans.ttf"});
  myFontPromises[i] = myFonts[i].ready;
  

}
Promise.all(myFontPromises).then(function() {
  for (var i=0; i < myFonts.length; i++)
  {
//myFont.ready.then(function(font) {
  console.log("!CLF: Promise.all received");

	console.log("inside font.ready");

console.log("font name is "+myFonts[i].faceName);
	metrics = myFonts[i].getFontMetrics(35);
	console.log("metrics h="+metrics.height);
	console.log("metrics a="+metrics.ascent);
	console.log("metrics d="+metrics.descent);
  console.log("metrics naturalLeading="+metrics.naturalLeading);
  console.log("metrics baseline="+metrics.baseline);
  
  var measure = myFonts[i].measureText( 35, "Please type some text...");
  console.log("measure w="+measure.w);
  console.log("measure h="+measure.h);
  }
});

var scroll = scene.create({t:"object",parent:root});
var scrollContent = scene.create({t:"object",parent:scroll});

var rowcontainer = scene.create({t:"object",parent:scrollContent});

var prevRow;

var p = 0; 
for (var i=0; i < fonts.length; i++)
{
  var row = scene.create({t:"object",parent:rowcontainer,a:0});
  
  var faceName = fonts[i]?fonts[i]:"FreeSans.ttf";
  var t = scene.create({
    t:"text",
    parent:row,x:10,
    textColor:0xfaebd7ff, pixelSize:36,
    fontUrl:fonts[i],
    text: "Please type some text..."});
  var t2 = scene.create({t:"text",text:"" + (i+1) + ". " + faceName, 
                             parent:row,x:20,
                             textColor:0xfaebd7ff, pixelSize:14,a:0.6,
                             fontUrl:"FreeSans.ttf"});
  

  // Use promises to layout the rows as the text becomes ready
  var rowReady = new Promise(
    
    function(fulfill,reject) {

      var prevRowCopy = prevRow;
      var rowCopy = row;
      var tCopy = t;
      var t2Copy = t2;

      // Please note that rowReady at this point is the rowReady for the previous row
      Promise.all([t.ready,t2.ready,rowReady]).then(function() {
        console.log("IN PROMISE ALL!");
        t2Copy.y = tCopy.h;
        rowCopy.h = tCopy.h+t2Copy.h;

        if (prevRowCopy) {
          rowCopy.y = prevRowCopy.y + prevRowCopy.h;
        }
        else
          selectRow(0); // This resizes the select rectangle once we have the first one

        rowCopy.animateTo({a:1},0.6,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
        fulfill(rowCopy);  // done with this row
      }, function() {
        // If .all fails to resolve set the row height to zero and hide it
        // Fulfill the rowReady anyway so the next row can be layed out
        rowCopy.h = 0;
        rowCopy.a = 0;
        fulfill(rowCopy);
      });
      
    });
  
  row.w = 800;
  prevRow = row;
}

var select = scene.create({t:"rect",parent:scrollContent, fillColor:0x000000, 
                                    lineColor:0xffff00ff,
                                    lineWidth:4,w:scene.w,h:100});
select.ready.then(function(obj) {
  
  console.log("Select RECT got ready promise!  h="+obj.h+" and w="+obj.w);
  
});

function clamp(v, min, max) {
    return Math.min(Math.max(min,v),max);
}

var time = scene.clock();
console.log("Time is "+time);

var currentRow = 0;
function selectRow(i) {
    currentRow = i;
    var row = rowcontainer.children[i];
    select.animateTo({x:row.x,y:row.y,h:row.h},0.3,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
    // animate to bring selection into view
    var t = -scrollContent.y;
    if (row.y < t) {
        t = -row.y
        scrollContent.animateTo({y:t},0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
    }
    else if (row.y+row.h-scene.h > t) {
        t = -(row.y+row.h-scene.h);
        scrollContent.animateTo({y:t},0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
    }
}

selectRow(currentRow);

function scrollUp() {
    var numRows = rowcontainer.children.length;
    selectRow(clamp(currentRow-1, 0, numRows-1));
}

function scrollDn() {
    var numRows = rowcontainer.children.length;
    selectRow(clamp(currentRow+1, 0, numRows-1));
}

function updateText(s) {
    for (var i = 0; i < rowcontainer.children.length; i++) {
        rowcontainer.children[i].children[0].text = s;
    }
}

var str = "";
scene.root.on("onKeyDown", function (e) {
    var keycode = e.keyCode; var flags = e.flags;
    if (keycode == 38) scrollUp();
    else if (keycode == 40) scrollDn();
    else if (keycode == 8) {
      str = str.slice(0,-1);
      updateText(str);
    }
    else if(keycode == 32) //space bar
    {
      rowcontainer.removeAll();
      myFontPromises = [];
      myFonts = [];
    }
});

scene.root.on("onChar", function(e) {
  if (e.charCode != 8) {
    str += String.fromCharCode(e.charCode);
    updateText(str);
  }
  time = scene.clock();
console.log("Time is "+time);
});

function updateSize(w, h) {
  select.w = w;
}

scene.on("onResize", function(e){updateSize(e.w,e.h);});
updateSize(scene.w, scene.h);

}).catch( function importFailed(err){
  console.error("Import failed for fonts2_extras.js: " + err)
});
