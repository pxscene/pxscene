px.import("px:scene.1.js").then( function ready(scene) {

var baseURL = px.getPackageBaseFilePath()  + "/../";

var root = scene.root;

var bg = scene.create({t:"rect",fillColor:0xffffffff,w:scene.getWidth(),h:scene.getHeight(),parent:root});

var images = [];
var container = scene.create({t:"image",parent:root,w:600});
container.h = 3*64;  // height for one animator*3

for(var i=0; i < 3; i++)
{
    var x = 0;
    var y = i*64;
    var line = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    scene.create({t:"text",text:"TWEEN_LINEAR",
                      textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
    images[i] = scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line});
    images[i].animateTo({x:550},1,scene.animation.TWEEN_LINEAR,
        scene.animation.OPTION_OSCILLATE,6);
        

     
}

setTimeout(function() 
{ 
  images[0].animateTo({x:800,y:250},2,scene.animation.TWEEN_LINEAR,
      scene.animation.OPTION_LOOP|scene.animation.OPTION_FASTFORWARD,scene.animation.COUNT_FOREVER);

  images[1].animateTo({x:800,y:images[1].y+250},2,scene.animation.TWEEN_LINEAR,
      scene.animation.OPTION_LOOP,scene.animation.COUNT_FOREVER);      

  images[2].animateTo({x:800,y:images[2].y+250},2,scene.animation.TWEEN_LINEAR,
      scene.animation.OPTION_LOOP|scene.animation.OPTION_REWIND,scene.animation.COUNT_FOREVER);
}, 
3500); 




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
