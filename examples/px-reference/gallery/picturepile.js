px.import("px:scene.1.js").then( function ready(scene) {
var root = scene.root;
var basePackageUri = px.getPackageBaseFilePath();

//var bg = scene.create({t:"image"});
//var bgShade = scene.create({t:"image"});

var txt1 = scene.create({t:"text"});

/*
bg.url = process.cwd() + "/../../images/skulls.png";
bg.stretchX = 2;
bg.stretchY = 2;
bg.parent = root;

bgShade.url = process.cwd() + "/../../images/radial_gradient.png";
bgShade.stretchX = 1;
bgShade.stretchY = 1;
bgShade.parent = root;
*/

txt1.x = 10;
txt1.text = ""; // Just so there is some height so that we can position
txt1.parent = root;


// clean up these names and expose as properties off of some object
//var pxInterpLinear = 0;
//var easeOutElastic = 1;
//var easeOutBounce  = 2;
//var exp2 = 3;
var pxStop = 4;

function randomInt(from, to) {
  var range = to-from;
  return Math.round(Math.random()*range + from);
}

function getImageURL() {
  if (true) {
    var urls = [
    "http://farm4.static.flickr.com/3307/5767175230_b5d2bf2312_z.jpg",
    "http://farm6.static.flickr.com/5263/5793867021_3e1d5d3aae_z.jpg",
    "http://farm3.static.flickr.com/2454/3594278573_500f415e39_z.jpg",
    "http://farm3.static.flickr.com/2415/2087329111_dd29709847.jpg",
    "http://c2.staticflickr.com/4/3707/9393275293_a108ed698a_b.jpg",
    "http://c2.staticflickr.com/8/7524/15571693270_9c5b3555b6_c.jpg",
    "http://c1.staticflickr.com/3/2925/13963178756_980d79b8a6_z.jpg",
    ];
    return urls[randomInt(0,urls.length-1)];
  }
  else {
    var urls = [
      "flower1.jpg",
      "flower1.jpg",
      "flower2.jpg",
      "flower3.jpg",
      "dolphin.jpg",
    ];
    return basePackageUri+"/images/"+
      urls[randomInt(0,urls.length-1)];
  }
}

var numPictures = 0;

function doIt() {
  
  // create an object to group some other objects
  var pictures = scene.create({t:"image"});
  pictures.parent = root;
  
  var urlIndex = 0;
  
  function newPicture() {
    
    var url = getImageURL();
    var picture;
    picture = scene.create({t:"image",parent: pictures, x:(randomInt(0,1)==0)?-1000:scene.getWidth()+2000,
                                 y:randomInt(-200, 800), cx: 200, 
                                 cy:200, sx: 2, sy: 2, 
                                 r: randomInt(-45,45), url:url});
    
    picture.ready.then(function(pic){
      
      // Extra debugging to test image and resource promises
      //var res = pic.resource;
      //res.ready.then(function(){ console.log("resource is ready - success");}, 
      //function(){console.log("resource is ready - failure");});
          
      picture.animateTo({x:randomInt(50,scene.getWidth()-picture.resource.w-50),
                          y:randomInt(50,scene.getHeight()-picture.resource.h-50),
                          r:randomInt(-15,15),sx:0.75,sy:0.75},1,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1)
        .then(function() {
          if (pictures.numChildren > 10) {
            var f = pictures.getChild(0);
            f.animateTo({a: 0}, 0.75, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
              .then(function(f){
                f.remove();
              });
          }
          newPicture();
        });    
    },function(){
      console.log("pic load failed: statusCode="+picture.resource.loadStatus.statusCode+
                         " and httpStatusCode="+picture.resource.loadStatus.httpStatusCode);
      // Extra debugging to test image and resource promises
      //var res =picture.resource;
      //res.ready.then(function(){ console.log("resource is ready - success - within image promise failure");}, 
      //function(){console.log("resource is ready - failure - within image promise failure");});
      
      picture.remove();
      newPicture();
    });
   } 
  newPicture();
}


scene.on('keydown', function(code, flags) {
  console.log("keydown:" + code);
});

scene.on("mousemove", function(x, y) {
  txt1.text = "" + x+ ", " + y;
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

doIt();

}).catch( function importFailed(err){
  console.error("Import failed for picturepile.js: " + err)
});




