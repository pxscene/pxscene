px.import("px:scene.1.js").then( function ready(scene) {
//var baseURL = "http://johnrobinsn.github.io/pxScene2d/";
//var baseURL = "http://localhost/~johnrobinson/johnrobinsn.github.io/pxScene2d/";
var baseURL = px.getPackageBaseFilePath()  + "/";

var root = scene.root;

var interpolators = scene.animation.interpolators;

var bg = scene.create({t:"rect",fillColor:0xffffffff,w:scene.getWidth(),h:scene.getHeight(),parent:root});

var container = scene.create({t:"image",parent:root,w:600});
var interpLen = interpolators.length;
for (var i = 0; i < interpLen; i++) {
    var interpolatorName = interpolators[i];
    console.log("interpolatorName is "+interpolatorName);
    var x = 0;
    var y = i*64;
    var line = scene.create({t:"image",url:baseURL+"images/blurredline.png",x:x,y:y+50,
                                  parent:container});
    scene.create({t:"text",text:interpolatorName,textColor:0x707070ff,pixelSize:14,x:x+5,y:y+18,
                      parent:container});
    scene.create({t:"image",url:baseURL+"images/ball2.png",a:0.5,y:-40,parent:line})
	  .animateTo({x:550},1,scene.animation[interpolatorName],scene.animation.OPTION_OSCILLATE,scene.animation.COUNT_FOREVER);
}
container.h = interpolators.length*64;

function updateSize(w, h) {
  bg.w = w;
  bg.h = h;
  container.x = (w-container.w)/2;
  container.y = 0;
}

scene.on("onResize", function(e) { updateSize(e.w,e.h); });
updateSize(scene.getWidth(), scene.getHeight());

}).catch( function importFailed(err){
  console.error("Import failed for dynamics.js: " + err)
});




