px.import("px:scene.1.js").then( function ready(scene) {


/** Test odd and even counts for oscillating animation */

var baseURL = px.getPackageBaseFilePath()  + "/../";

var root = scene.root;

var bg = scene.create({t:"rect",fillColor:0xffffffff,w:scene.getWidth(),h:scene.getHeight(),parent:root});

var container = scene.create({t:"image",parent:root,w:600});
container.h = 64*2;  // height for one animator*2
var count = 4;


    var x = 0;
    var y = 0;
    var line = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    scene.create({t:"text",text:"TWEEN_LINEAR  oscillate for count="+count,
                      textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
    var image = scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line});
    image.animateTo({x:550},1,scene.animation.TWEEN_LINEAR,
        scene.animation.OPTION_OSCILLATE,count);
    y+=64;
    var line2 = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    scene.create({t:"text",text:"TWEEN_LINEAR  oscillate for count="+(count+1),
                      textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
    var image2 = scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line2});
    image2.animateTo({x:550},1,scene.animation.TWEEN_LINEAR,
        scene.animation.OPTION_OSCILLATE,count+1);        

    y+=64;
    var line3 = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    scene.create({t:"text",text:"TWEEN_LINEAR  oscillate for forever",
                      textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
    var image3 = scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line3});
    image3.animateTo({x:550},1,scene.animation.TWEEN_LINEAR,
        scene.animation.OPTION_OSCILLATE,scene.animation.COUNT_FOREVER);        






function updateSize(w, h) {
  bg.w = w;
  bg.h = h;
  container.x = (w-container.w)/2;
  container.y = 0;
}

scene.on("onResize", function(e) { updateSize(e.w,e.h); });
updateSize(scene.getWidth(), scene.getHeight());

}).catch( function importFailed(err){
  console.error("Import failed for animCountTest_oscillate.js: " + err)
});
