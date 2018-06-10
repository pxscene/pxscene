px.import("px:scene.1.js").then( function ready(blah) {

var $ = (function(s) {
  var pxQuery = function(selector, context) {
    console.log("Selector: ", selector);
  }

  Object.setPrototypeOf(pxQuery, s);

  pxQuery.blah = function(s) {
    console.log("blahblahbAH",s);
  }

  return pxQuery; // publish
})(blah);

$("zzzzzzzzzzz");
$.blah("foo");


var root = $.root;

var basePackageUri = px.getPackageBaseFilePath();
var bgUrl = basePackageUri+"/images/cork.png";
var bgShadowUrl = basePackageUri+"/images/radial_gradient.png";
var shadowUrl = basePackageUri+"/images/BlurRect.png";

function randomInt(from, to) {
	var range = to-from;
	return Math.round(Math.random()*range + from);
}

function getImageURL() {
  var urls = [
    "IMG_2225.jpg",
    "IMG_2810.jpg",
    "IMG_4321.jpg",
    "IMG_2804.jpg",
    "IMG_4765.jpg",
    "IMG_4077.jpg",
  ];
	return basePackageUri+"/images/photos/"+
    urls[randomInt(0,urls.length-1)];
}

var maxCover = 0.7;
var maxW;
var maxH;

var bg = $.create({t:"image",url:bgUrl,parent:root,stretchX:2,stretchY:2});
var bgShadow = $.create({t:"image",url:bgShadowUrl,parent:bg,stretchX:1,stretchY:1,a:0.75});

var numPictures = 0;
// back layer
var picturesBg = $.create({t:"object",parent:root});
// middle layer
var pictures = $.create({t:"object",parent:root});
// front layer
var picturesFg = $.create({t:"object",parent:root});

function doIt() {
  
	var urlIndex = 0;
	
  var picture = $.create({t:"object",parent:picturesFg,
                          x:(randomInt(0,1)==0)?-1000:$.w+2000,
                          y:randomInt(-200, 800),
                          sx: 3, sy: 3, 
                          r: randomInt(-45,45),a:0});
  var shadow = $.create({t:"image9",x:-37,y:-37,w:200,h:200,url:shadowUrl,parent:picture,a:0.45,insetTop:48,insetBottom:48,insetLeft:48,insetRight:48});
  

  for (var i = 0; i < 100; i++)
  {
    
    var fg = $.create({t:"image",x:0,y:0,parent:picture,url:getImageUrl(),sx:0.25,sy:0.25});
    
  }

}

function updateSize(w, h) {

  bg.w = w;
  bg.h = h;

  bgShadow.w = w;
  bgShadow.h = h;

  pictures.w = w;
  pictures.h = h;
  pictures.painting = true; pictures.painting = false;

  maxW = w*maxCover;
  maxH = h*maxCover;
}

$.on("onResize", function(e){updateSize(e.w,e.h);});
updateSize($.w, $.h);

doIt();

}).catch( function importFailed(err){
  console.error("Import failed for picturepile.js: " + err)
});




