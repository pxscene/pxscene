px.import("px:scene.1.js").then( function ready(scene) {

var root = scene.root;



// null or "" is the default face FreeSans.ttf
var fonts = ["",
             "http://www.pxscene.org/examples/px-reference/fonts/DancingScript-Regular.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DancingScript-Bold.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DejaVuSans.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/DejaVuSerif.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/FontdinerSwanky.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/FreeSans.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/IndieFlower.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/Pacifico.ttf",
             "http://www.pxscene.org/examples/px-reference/fonts/PoiretOne-Regular.ttf",
            ];
console.log("fonts: " + fonts);
console.log("fonts: ", fonts.length);

var scroll = scene.create({t:"image",parent:root});
var scrollContent = scene.create({t:"image",parent:scroll});

var rowcontainer = scene.create({t:"image",parent:scrollContent});

var prevRow;

var p = 0; 
//var len = fonts.length;
for (var i=0; i < fonts.length; i++)
{
    var row = scene.create({t:"image",parent:rowcontainer,a:0});

    var faceName = fonts[i]?fonts[i]:"FreeSans.ttf";
    console.log(faceName);
    var t = scene.create({t:"text",text:"Enter in some text...", 
                              parent:row,x:10,
                              textColor:0xfaebd7ff, pixelSize:36,
                              fontUrl:fonts[i]});
    var t2 = scene.create({t:"text",text:faceName, 
                               parent:row,x:20,
                               textColor:0xeeeeeeff, pixelSize:14,a:0.6});
    
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


function clamp(v, min, max) {
    return Math.min(Math.max(min,v),max);
}

var currentRow = 0;
function selectRow(i) {
    currentRow = i;
    var row = rowcontainer.children[i];
    select.animateTo({x:row.x,y:row.y,h:row.h},0.3,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
    // animate to bring selection into view
    var t = -scrollContent.y;
    if (row.y < t) {
        t = -row.y
        console.log("one");
        scrollContent.animateTo({y:t},0.3, scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
    }
    else if (row.y+row.h-scene.h > t) {
        t = -(row.y+row.h-scene.h);
        console.log("two");
        scrollContent.animateTo({y:t},0.3, scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
    }
}

selectRow(currentRow);

function scrollUp() {
    var numRows = rowcontainer.numChildren;
//    selectRow(currentRow>0?currentRow-1:0);
    selectRow(clamp(currentRow-1, 0, numRows-1));
}

function scrollDn() {
    var numRows = rowcontainer.numChildren;
    console.log("numRows", numRows);
    console.log(currentRow);
//    selectRow((currentRow<(numRows-1))?currentRow+1:numRows-1);
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
//        str = str.substr(0,str.length-1);
//        str = str.slice(0,str.length-2);
      str = str.slice(0,-1);
      updateText(str);
    }
});

scene.root.on("onChar", function(e) {
  if (e.charCode != 8) {
    str += String.fromCharCode(e.charCode);
    updateText(str);
  }
});

function updateSize(w, h) {
  select.w = w;
}

scene.on("onResize", function(e){updateSize(e.w,e.h);});
updateSize(scene.w, scene.h);

}).catch( function importFailed(err){
  console.error("Import failed for fonts.js: " + err)
});



