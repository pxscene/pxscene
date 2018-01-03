px.import("px:scene.1.js").then( function ready(scene) {
var root = scene.root;
var basePackageUri = px.getPackageBaseFilePath();

var url;
/*
url = process.cwd() + "/../../images/skulls.png";
var bg = scene.create({t:"image",id:"bg2",url:url,stretchX:2,stretchY:2,parent:root});

url = process.cwd() + "/../../images/radial_gradient.png";
var bgShade = scene.create({t:"image",id:"bg", url:url,stretchX:1,stretchY:1,parent:root});
*/
var txt1 = scene.create({t:"text",x:10,text:"",parent:root,pixelSize:64});

//var childText;
url = basePackageUri + "/images/spark_logo.png"
var ballImg = scene.create({t:"image",id:"ball",url:url,x:450,y:150,parent:root});
ballImg.ready.then(function(e){
       e.cx = e.resource.w/2;
    e.cy = e.resource.h/2;
    childText = scene.create({t:"text",id:"text",text:"CLICK ME!!!",parent:e,textColor:0x800080ff, 
				  r:30, pixelSize:64});
    childText.y = e.resource.h/2-childText.h/2;
    childText.x = e.resource.w/2-childText.w/2;
    childText.cx = childText.w/2;
    childText.cy = childText.h/2;
    childText.on("onMouseDown", function(e) {
    console.log("onMouseDown for text object");
	// TODO is there a better way to do this??
	rTarget += 360;
	childText.animateTo({r:rTarget}, 1.0, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP,1); 
	//    childText.animateTo({r:360}, 5.0, 4, 0, function(o) { o.r = 0; }); 
    });

});
    ballImg.on("onMouseDown", function(o) {
    console.log("onMouseDown for image object");
    });
var rTarget = 0;


// clean up these names and expose as properties off of some object
var pxInterpLinear = 0;
var easeOutElastic = 1;
var easeOutBounce  = 2;
var pxExp = 3;
var pxStop = 4;

function fancy(p) {
  x1(p);
  y1(p);
  rotate1(p);
  scale1(p);
}

function x1(p) {
    p.animateTo({x:50}, 1.0, pxInterpLinear, scene.animation.OPTION_LOOP,1, x2);
}

function x2(p) {
    p.animateTo({x:450}, 3.0, easeOutElastic, scene.animation.OPTION_LOOP,1, fancy);
}

function y1(p) {
    p.y = 100;
    p.animateTo({y:350}, 1.0, easeOutBounce, scene.animation.OPTION_LOOP,1, y2);
}

function y2(p) {
    p.animateTo({y:150}, 1.0, easeOutElastic, scene.animation.OPTION_LOOP,1);
}

function rotate1(p) {
    p.r = 0;
    p.animateTo({r:-360}, 2.5, easeOutElastic, scene.animation.OPTION_LOOP,1);
}

function scale1(p) {
    p.animateTo({sx:0.2,sy:0.2}, 1, pxInterpLinear, scene.animation.OPTION_LOOP,1, scale2);
}

function scale2(p) {
    p.animateTo({sx:2.0,sy:2.0}, 1.0, pxExp, scene.animation.OPTION_LOOP,1, scale3);
}

function scale3(p) {
    p.animateTo({sx:1.0,sy:1.0}, 1.0, easeOutElastic, scene.animation.OPTION_LOOP,1);
}

scene.on('onKeyDown', function(e) {
  console.log("keydown:" + e.keyCode);
});

scene.on("onMouseMove", function(e) {
    txt1.text = "" + e.x+ ", " + e.y;
});

function updateSize(w, h) {
/*
    bg.w = w;
    bg.h = h;
    bgShade.w = w;
    bgShade.h = h;
*/
    txt1.y = h-txt1.h;
}

scene.on("onResize", function(e){updateSize(e.w,e.h);});
updateSize(scene.getWidth(), scene.getHeight());

}).catch( function importFailed(err){
    console.error("Import failed for mousetest2.js: " + err)
});


