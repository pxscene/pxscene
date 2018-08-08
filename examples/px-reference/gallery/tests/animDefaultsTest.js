px.import("px:scene.1.js").then( function ready(scene) {

var baseURL = px.getPackageBaseFilePath()  + "/../";

var root = scene.root;

var bg = scene.create({t:"rect",fillColor:0xffffffff,w:scene.getWidth(),h:scene.getHeight(),parent:root});


var container = scene.create({t:"image",parent:root,w:600});

    var x = 0;
    var y = 0;
    var line = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    var text = scene.create({t:"text",text:"TWEEN_LINEAR: Default Loop 1 time",
                      textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
                      
    var image = scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line});
    image.animateTo({x:550},1);
    //.then(function() {
        //console.log("OSCILLATE 5 DONE");
        //text.text = "TWEEN_LINEAR: Loop 3 times";
        //image.animateTo({x:0,y:250},2,scene.animation.TWEEN_LINEAR,
            //scene.animation.OPTION_LOOP,3).then(function() {
                  //console.log("LOOP 3 DONE");
                  //text.text = "EASE_OUT_BOUNCE: Oscillate 4 times";
                  //image.animateTo({x:550,y:150},2,scene.animation.EASE_OUT_BOUNCE,
                      //scene.animation.OPTION_OSCILLATE,4).then(function() {
                        //console.log("OSCILLATE 4 DONE");
                        //text.text = "TWEEN_LINEAR: Oscillate forever";
                        //image.animateTo({x:0,y:100},1,scene.animation.TWEEN_LINEAR,
                          //scene.animation.OPTION_OSCILLATE,scene.animation.COUNT_FOREVER);
                    //}); 
                  //});
        
            //});
     

container.h = 64;  // height for one animator
//container.h = interpolators.length*64;

function updateSize(w, h) {
  bg.w = w;
  bg.h = h;
  container.x = (w-container.w)/2;
  container.y = 0;
}

scene.on("onResize", function(e) { updateSize(e.w,e.h); });
updateSize(scene.getWidth(), scene.getHeight());

}).catch( function importFailed(err){
  console.error("Import failed for animDefaultsTest.js: " + err)
});
