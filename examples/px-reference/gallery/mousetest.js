px.import("px:scene.1.js").then( function ready(scene) {
//scene.showOutlines = true;

var text = scene.create({t:"text",text:"CLICK ME!!",parent:scene.root,pixelSize:64});
text.x = (scene.getWidth()-text.w)/2;
text.y = (scene.getHeight()-text.h)/2;
text.cx = text.w/2;
text.cy = text.h/2;
//text.animateTo({"r": -360}, 5.0, 0, 2);
var rTarget = 0;
text.on("onMouseDown", function(e) {
    rTarget += 360;
    text.animateTo({r:rTarget}, 1.0, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1); 
//  console.log(e);
  if (e.target == text)
    console.log("object identity working");
  else
    console.log("object identiy broken");
  
1});

scene.root.id="editorroot";
text.id="editortext";

scene.on('onResize', function(e) {
    text.y = (e.h-text.h)/2;
});

scene.on('onKeyDown', function(e) {
  console.log("keydown:" + e.keyCode);
});

}).catch( function importFailed(err){
  console.error("Import failed for mousetest.js: " + err)
});




