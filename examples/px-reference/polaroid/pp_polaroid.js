/** 
 * This sample uses json to show pictures on screen in a polaroid 'picture pile'.
 * 
 * The json could easily be fetched via http or websockets to enable a more 
 * dynamic set of pictures to be shown.
 * 
 * */
"use strict";
px.import({scene:"px:scene.1.js"}).then( function ready(imports) {

  var scene = imports.scene;
  var root = scene.root;


var basePackageUri = px.getPackageBaseFilePath();
var bgUrl = basePackageUri+"/images/cork.png";
var bgShadowUrl = basePackageUri+"/images/radial_gradient.png";
var shadowUrl = basePackageUri+"/images/BlurRect.png";
var shadowImageObj = scene.create({t:"imageResource",url:shadowUrl});
var imagesUrl = '/images.json';

var numimages = px.appQueryParams.numimages;
if( numimages === undefined) { numimages = 8;}

var doRotation = px.appQueryParams.rotation;
if( doRotation === undefined || (doRotation != 1 && doRotation != 0)) {doRotation = 1;}

var usePainting = px.appQueryParams.usePainting;
if( usePainting === undefined || (usePainting != 1 && usePainting != 0)) {usePainting = 1;}
console.log("usePainting = "+usePainting);

var pics = px.appQueryParams.pics;
if( pics != undefined && pics == 'flickr') { imagesUrl = '/flickr_images.json';}

// Number of images on screen before they start to fade away
var numVisible = 5;

// Create the background cork image
var bg = scene.create({t:"image",url:bgUrl,parent:root,stretchX:2,stretchY:2,w:root.w,h:root.h});

    
function randomInt(from, to) {
  var range = to-from;
  return Math.round(Math.random()*range + from);
}
function randomIntFromList(li) {
            return li[randomInt(0,li.length-1)]
}

// Load the static json with image urls
// Note: because we are using getModuleFile, it will already prepend 
// the base path to the url, so we don't have to.
var screensaverPromise = px.getModuleFile(imagesUrl);


var firstPicture = null;
var firstFg = null;
var firstCaption = null; 
var jsonImageUrlsReceived = false;


var reusePictures = false;
var urlIndex = -1;

var imageHandler = (function() {
  var urls = [];
  var numUrls = 0;


  return {
    
      getImageInfo:  function() {
        urlIndex++;
        if(urlIndex >=numUrls) { reusePictures = true; urlIndex = 0;}
        var info = {};

        info.url = urls[urlIndex].url;
        info.caption = urls[urlIndex].caption;
        if( info.caption !== undefined && info.caption.includes('<')) info.caption = "";
        return info;
      },

      handleJson: function(data) {
          console.log("PARSING JSON FOR URLS");
            try {
              //console.log("IMAGE URLS ARE\n"+data);
              urls = JSON.parse(data);
              //console.log("\n\n\nPARSED IMAGE URLS ARE\n"+urls);

              numUrls = urls.length;
              if(numUrls == undefined || numUrls == 0) throw "no image urls were received";
              // Only show the max set via numimages
              if(numUrls > numimages) {
                numUrls = numimages; 
              }
              else if( numimages > numUrls)
                numimages = numUrls;
                
              if(numVisible >= numUrls) {
                numVisible = numUrls-1;
              }
              console.log("DONE PARSING JSON FOR URLS");
              //console.log("numUrls="+numUrls+" numimages="+numimages+" numVisible="+numVisible);
        }
        catch(e) {
          console.log("JSON FOR URLS WAS NOT VALID");
          numUrls = 0;
        }
      },
      getNumUrls: function() { return numUrls; }
    };
})();



var maxCover = 0.7;
var maxW;
var maxH;

var polaroidH = (scene.root.h - 50) * 0.90;
var polaroidW = (polaroidH*0.83);


var bgShadow = scene.create({t:"image",url:bgShadowUrl,parent:bg,stretchX:1,stretchY:1,a:0.75});

var captionFont = scene.create({t:"fontResource", url:"http://pxscene.org/examples/px-reference/fonts/DancingScript-Regular.ttf"});
captionFont.ready.then( null, 
  function(res) {
    console.log("ERROR loading captionFont. StatusCode:"+res.loadStatus.statusCode+
                " httpStatusCode:"+res.loadStatus.httpStatusCode)
    //IPV6 compatible location for font
    captionFont = scene.create({t:"fontResource", url:"http://pxscene.org/examples/px-reference/fonts/IndieFlower.ttf"});}).
  catch(function(error) {
    console.log("ERROR occurred while loading captionFont: "+error)
  });

var numPictures = 0;
// back layer
var picturesBg = scene.create({t:"object",parent:root});
// middle layer
var pictures = scene.create({t:"object",parent:root});
// front layer
var picturesFg = scene.create({t:"object",parent:root});


var sidePadding = polaroidW*.0536;
var topPadding = polaroidH * .06;
var bottomPadding = polaroidH * 0.206;
   
var adjH = polaroidH -(topPadding+bottomPadding);
var adjW = polaroidW -(sidePadding*2);  

// Define different targetY functions depending if rotation is on or off
function yPosRotation() {
  return (50+topPadding);
}
function yPosNoRotation() {
  return (randomInt(15,75));
}

var targetY;

if( doRotation == 1) 
  targetY = yPosRotation;
else 
  targetY = yPosNoRotation;

var savedPictures = [];
  
  
function recyclePictures() {
  
      var item = savedPictures[urlIndex];
      if(usePainting == 1) {
        item.painting = false;
      }
      // reset picture values
      item.x = (randomInt(0,1)==0)?-1000:scene.w+2000;
      item.y = (randomInt(0,1)==0)?-root.h:root.h;
      item.sx = 3; 
      item.sy = 3; 
      item.r = (doRotation==1)?randomIntFromList([-15,11]):0;
      item.a = 0;
      //console.log("Item is "+item);
      item.parent = picturesFg;
      //console.log("Parent is assigned");
      if(usePainting == 1) {
        pictures.painting = true;
        item.painting = true;
      }
      item.animateTo({x:randomInt(50+sidePadding,scene.w-(polaroidW)-50),
                          y:randomInt(targetY(),scene.h-(polaroidH)-25),
                          r:(doRotation==1)?randomIntFromList([-15,11]):0,
                          sx:1,sy:1,a:1},2.5,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1)
      .then(function(savedPic) {
        //console.log("Done animating reused pxobjects");
                savedPic.parent = pictures;
                if(usePainting == 1) {
                  pictures.painting = true; 
                  pictures.painting=false;
                }
                if (pictures.numChildren > numVisible-1) {
                  var f = pictures.getChild(0);
                  f.parent = picturesBg;
                  if(usePainting == 1) {
                    pictures.painting = true; 
                    pictures.painting = false;
                  }
                  f.animateTo({a: 0}, 0.75, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
                    .then(function(f){
                      f.remove();
                    });
                }
        var info = imageHandler.getImageInfo();
        recyclePictures();
                
      });

}
function newPicture() {
    
    var info = imageHandler.getImageInfo();
    if( reusePictures == true) {
      recyclePictures();

      
    } else {
    var url = info.url;
    var caption = info.caption;
     //var rotation = math.randomIntFromList([-15,11]);
    var picture = scene.create({t:"object",parent:picturesFg,
                                x:(randomInt(0,1)==0)?-1000:scene.w+2000,
                                 y:(randomInt(0,1)==0)?-root.h:root.h,
                                 sx: 3, sy: 3, 
                                 r: (doRotation==1)?randomIntFromList([-15,11]):0,
                                 a:0});
    console.log("Adding to saved Pictures with urlIndex "+urlIndex);
    savedPictures.push( picture);
    var shadow = scene.create({t:"image9",x:-37,y:-37,w:polaroidW+(40*2),h:polaroidH+(40*2),resource:shadowImageObj,parent:picture,a:0.45,insetTop:48,insetBottom:48,insetLeft:48,insetRight:48});
    var frame = scene.create({t:"rect",w:polaroidW,h:polaroidH,parent:picture,fillColor:0xF8F8F8FF,lineColor:0xCCCCCC80,lineWidth:2});
    var captions = scene.create({t:"textBox" ,
          parent: frame,
          clip: true,
          a: 1,
          y: frame.h - bottomPadding +5,
          x: sidePadding,
          h: bottomPadding - 20,
          w: frame.w - (sidePadding * 2),
          text:caption,
          textColor:0x000000FF,
          alignHorizontal:scene.alignHorizontal.CENTER,
          font:captionFont,
          pixelSize:22,
          wordWrap:true,
          truncation:scene.truncation.TRUNCATE_AT_WORD,
          ellipsis:true});
    var cropper = scene.create({
        t: "rect",
        parent: picture,
        clip: true,
        a: 1,
        y: topPadding,
        x: sidePadding,
        h: frame.h - topPadding - bottomPadding,
        w: frame.w - (sidePadding * 2)
    })
    var fg = scene.create({t:"image",x:0,y:0,parent:cropper,url:url,stretchX:1,stretchY:1});
    
    fg.ready.then(function(pic){
      console.log("PICTUREPILE IMAGE IS READY");
      if(usePainting == 1) {
        picture.painting = false;
      }
      picture.a = 1;
      var picW = pic.resource.w;
      var picH = pic.resource.h;



//// scale and crop
      if (picW >= picH) {

          pic.h = cropper.h;

          // now need to determine how much more to scale
          pic.w = Math.round(pic.h * picW / picH)
          pic.x = -Math.round(((pic.w - frame.w) / 2)) - sidePadding

      } else {

          pic.w = cropper.w;

          // now need to determine how much more to scale
          pic.h = Math.round(pic.w * picH / picW)
          pic.y = -Math.round(((pic.h - frame.h) / 2)) - topPadding
      }
      if(usePainting == 1) {
        picture.painting = true;
      }
// end scale and crop
      picture.animateTo({x:randomInt(50+sidePadding,scene.w-(polaroidW*fg.sx)-50),
                          y:randomInt(targetY(),scene.h-(polaroidH*fg.sx)-25),
                          r:(doRotation==1)?randomIntFromList([-15,11]):0,sx:1,sy:1},2,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1)
        .then(function() {
          picture.parent = pictures;
          if(usePainting == 1) {
            pictures.painting = true; 
            pictures.painting=false;
          }
          if (pictures.numChildren > numVisible-1) {
            var f = pictures.getChild(0);
            f.parent = picturesBg;
            if(usePainting == 1) {
              pictures.painting = true; 
              pictures.painting = false;
            }
            f.animateTo({a: 0}, 0.75, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
              .then(function(f){
                f.remove();
              });
          }
          newPicture();

        });    
    },function(obj){
      console.log("ERROR: failed to load an image from urls in json: "+obj.url);
      //picture.remove();
      newPicture();
    });

   }
 }
           
function doIt() {
  
	var urlIndex = 0;
    console.log("DO IT!");
   // When doIt is called, the promise for url json has been fulfilled
   
    //var url = info.url;
    //var caption = info.caption;
   
   if( firstFg != null) {
     console.log("Assigning data to firstFg and firstCaption");
     var tempInfo = imageHandler.getImageInfo();
     firstCaption.text = tempInfo.caption;
     firstFg.url = tempInfo.url;
   } else {
     console.log("Setting jsonImageUrlsReceived = true because firstFg is not created yet!");
     jsonImageUrlsReceived = true;
   }

  
}
   
  function firstNewPicture() {
    //console.log(">>>>>>>>>>>>>>>>>>>>> In firstNewPicture");

    firstPicture = scene.create({t:"object",parent:picturesFg,
                                x:(randomInt(0,1)==0)?-1000:scene.w+2000,
                                 y:(randomInt(0,1)==0)?-root.h:root.h,
                                 sx: 3, sy: 3, 
                                 r:(doRotation==1)?randomIntFromList([-15,11]):0,
                                 a:0});

    var shadow = scene.create({t:"image9",x:-37,y:-37,w:polaroidW+(40*2),h:polaroidH+(40*2),resource:shadowImageObj,parent:firstPicture,a:0.45,insetTop:48,insetBottom:48,insetLeft:48,insetRight:48});
    var frame = scene.create({t:"rect",w:polaroidW,h:polaroidH,parent:firstPicture,fillColor:0xF8F8F8FF,lineColor:0xCCCCCC80,lineWidth:2});
    firstCaption = scene.create({t:"textBox" ,
          parent: frame,
          clip: true,
          a: 0,
          y: frame.h - bottomPadding +5,
          x: sidePadding,
          h: bottomPadding - 20,
          w: frame.w - (sidePadding * 2),
          //text:caption,
          textColor:0x000000FF,
          alignHorizontal:scene.alignHorizontal.CENTER,
          font:captionFont,
          pixelSize:22,
          wordWrap:true,
          truncation:scene.truncation.TRUNCATE_AT_WORD,
          ellipsis:true});
    var firstCropper = scene.create({
        t: "rect",
        parent: firstPicture,
        clip: true,
        a: 1.0,
        y: topPadding,
        x: sidePadding,
        h: frame.h - topPadding - bottomPadding,
        w: frame.w - (sidePadding * 2),
        fillColor:0x000000ff
    })
    //console.log("Creating firstFg");
    firstFg = scene.create({t:"image",x:0,y:0,parent:firstCropper,stretchX:1,stretchY:1,a:0});
    //console.log("picture about to animate");
    firstCropper.animateTo({a:0.2},3.0,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
    firstPicture.animateTo({x:randomInt(50+sidePadding,scene.w-(polaroidW*firstFg.sx)-50),
                        y:randomInt(50+topPadding,scene.h-(polaroidH*firstFg.sx)-25),
                        r:(doRotation==1)?randomIntFromList([-15,11]):0,
                        sx:1,sy:1,a:1},2,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1)
      .then(function() {
        //cropper.animateTo({a:1},0.5,$.animation.TWEEN_LINEAR,$.animation.OPTION_LOOP, 1);
        console.log("firstPicture done animating");
      // For the first picture, let's not wait for the image to come in...
      // let's animate like it's a polaroid that's just developing...
      console.log("CHECKING jsonImageUrlsReceived:"+jsonImageUrlsReceived);
      if(jsonImageUrlsReceived === true) {
       console.log("jsonImageUrlsReceived is true");
       var tempInfo = imageHandler.getImageInfo();
       firstCaption.text = tempInfo.caption;
       firstFg.url = tempInfo.url;
      }
      firstFg.ready.then(function(pic){
        console.log("PXAPP_PROCESS_2");//"FIRST PICTUREPILE IMAGE IS READY");
        jsonImageUrlsReceived = true;
        if(usePainting == 1) {
          firstPicture.painting = false;
        }
        //firstPicture.a = 1;
        var picW = pic.resource.w;
        var picH = pic.resource.h;

console.log("about to scale and crop");

      // scale and crop
        if (picW >= picH) {

            pic.h = firstCropper.h;

            // now need to determine how much more to scale
            pic.w = Math.round(pic.h * picW / picH)
            pic.x = -Math.round(((pic.w - frame.w) / 2)) - sidePadding

        } else {

            pic.w = firstCropper.w;

            // now need to determine how much more to scale
            pic.h = Math.round(pic.w * picH / picW)
            pic.y = -Math.round(((pic.h - frame.h) / 2)) - topPadding
        }
        if(usePainting == 1) {
          firstPicture.painting = true;
        }
        firstCropper.animateTo({a:1},0.7,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
        console.log("firstCaption.animateTo");
        firstCaption.animateTo({a:1},0.9,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1);//.then(function() {
        console.log("firstFg.animateTo");
        firstFg.animateTo({a:1},0.8,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1).then(function() {
          console.log("About to call newPicture");
          // Only start newPicture animations once the
        // Move firstPic to the background
        firstPicture.parent = pictures;
        if(usePainting == 1) {
          pictures.painting = true; 
          pictures.painting=false;
        }
        savedPictures.push( firstPicture);
        newPicture();
        });

      }, function() { // rejected promise
        console.log("Image promise rejection!");

        var res = firstFg.resource;
        console.log("Error loading image statusCode:"+res.loadStatus.statusCode+
                    " httpStatusCode:"+res.loadStatus.httpStatusCode);
        // Stop trying to process images; the urls are never supposed to be invalid
        putUpError(true, 'SS0003');
    }).catch(function(error) {
      // Download error....
      console.log("Error loading first image: "+error);
      // Stop trying to process images; the urls are never supposed to be invalid
      putUpError(true, 'SS0003');      
    });
    },function(){
      console.log("FirstPicture animation rejection!")
      // Stop trying to process images; the urls are never supposed to be invalid
      putUpError(true, 'SS0003');
    }, function() {
        console.log("FirstPicture animation failure!")
        // Stop trying to process images; the urls are never supposed to be invalid
        putUpError(true, 'SS0003');    
    }).catch( function() {
      console.log("some kind of error");
    });
   
 }



function updateSize(w, h) {

  bg.w = w;
  bg.h = h;

  bgShadow.w = w;
  bgShadow.h = h;

  pictures.w = w;
  pictures.h = h;
  if(usePainting == 1) {
    pictures.painting = true; pictures.painting = false;
  }

  maxW = w*maxCover;
  maxH = h*maxCover;
  
}


scene.on("onResize", function(e){updateSize(e.w,e.h);});
updateSize(scene.w, scene.h);

scene.on("onClose", function(e) {
  console.log(">>>>>>>>>>>>>>>>>>>>> Received onClose event!");

});


var putUpError = function(isError, errorCode) {
    // Error handling if no image urls could be retrieved
    if(isError) {
      console.log("PXAPP_PROCESS_5");
      firstPicture.animateTo({a:0},1.0,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1);
    }

    var postit = scene.create({t:"image", parent:root, x:1200, y:1200,  w:500, h:500, url:basePackageUri+"/images/post-it.png",
                               stretchX:scene.stretch.STRETCH,stretchY:scene.stretch.STRETCH,
                               a:0});
    var textBox = scene.create({t:"textBox", parent:postit,x:50, y:25, w:400, h:400, textColor:0x000000FF, 
                                a:1, r:-2.6,
                                font:captionFont, 
                                pixelSize:32, wordWrap:true, 
                                alignVertical:scene.alignVertical.CENTER, alignHorizontal:scene.alignHorizontal.CENTER,
                                text:isError?"We're sorry, but something went wrong when attempting to get images to show for your screensaver.":
                                             "Did you know that you could use your personal images for your screensaver?  Go to xfinity.com/profile and configure your Xfinity account for Photos!" });
    
    var errorCodeTextBox = scene.create({t:"textBox", parent:postit,x:50, y:425, w:400, h: 60, textColor:0x000000FF, 
                                  a:0, r:-2.6,
                                  font:captionFont,
                                  pixelSize:24, wordWrap:true, 
                                  alignHorizontal:scene.alignHorizontal.RIGHT,
                                  text:"Error code: "+errorCode});

    if( isError) {
        errorCodeTextBox.a = 1;
    }
    // If captionFont fails to dowload, reset error text to use default font
    captionFont.ready.then( function(){console.log("captionFont is okay")}).catch(function(error) 
    {
      console.log("error for captionFont");
      // Force to use default font
      textBox.fontUrl = "";
      errorCodeTextBox.fontUrl = "";
    });

    postit.ready.then(function() {
      postit.animateTo({a:isError?1:0.9,x:isError?root.w/4:root.w-500, y:isError?(root.h/2)-250:100 },1.5,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1);
      }).then(function(obj){
          if( !isError) { 
            setTimeout(function(){
              postit.animateTo({a:0 },1.5,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1);
              },20000);
            }

        }).catch(function(error) {
          console.log("postit promise was rejected");
        });
      
}



bg.ready.then(function() {
  
  console.log("PXAPP_VISIBLE");

  firstNewPicture();
// Handle promises and start the picture pile
  screensaverPromise.then(function(data) {

    console.log("Images file loaded"); // JSON RECEIVED
    imageHandler.handleJson(data);
    if( imageHandler.getNumUrls() > 0) {
      doIt();
    }
    else {
      putUpError(true, "Error getting image urls");
    }
    }).catch(function(error){
      putUpError(true, "Error getting image urls");
      }); 

});

module.exports.wantsClearscreen = function() 
{
  return false;
};

  
}).catch( function importFailed(err){
  console.error("Import failed for pp_polariod.js: " + err)
});

