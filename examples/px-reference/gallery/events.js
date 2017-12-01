"use strict";
px.import("px:scene.1.js").then( function ready(scene) {
var root = scene.root;
var basePackageUri = px.getPackageBaseFilePath();

function randomInt(from, to) {
	var range = to-from;
	return Math.round(Math.random()*range + from);
}

var bg = scene.create({t:"rect",fillColor:0xcccccc00, parent:root});
var back = scene.create({t:"image",parent:bg});
var front = scene.create({t:"image",parent:bg});

function updateSize(w, h) {
  bg.w = w;
  bg.h = h;
}

scene.on("onResize", function(e) {updateSize(e.w, e.h);});
updateSize(scene.getWidth(), scene.getHeight());

scene.root.on("onKeyDown", function(e) {
  var keycode = e.keyCode; var flags = e.flags;
  var keytext = ""+Math.floor(keycode);
  var textbg = scene.create({t:"image",a:0, x:randomInt(50,scene.getWidth()-150),
                                  y:scene.getHeight()+50,
                                  url:basePackageUri+"/images/keybubble.png",
                                  parent:back,sx:0.75, sy:0.75});
  textbg.ready.then(function() {
    textbg.cx = textbg.resource.w/2;
    textbg.cy = textbg.resource.h/2;
    var text = scene.create({t:"text",text:keytext,parent:textbg,pixelSize:48});
    text.ready.then(function() {
      text.x = (textbg.resource.w-text.w)/2;
      text.y = (textbg.resource.h-text.h)/2;
      text.cx = text.w/2;
      text.cy = text.h/2;
      textbg.animateTo({a:1,y:randomInt(20,200),r:randomInt(-30,30)},0.2,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP, 1)
        .then(function(t) { 
          t.animateTo({r:randomInt(-15,15), y: t.y+50}, 0.6, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
            .then(function(t) {
              t.animateTo({sx:1, sy: 1}, 0.01, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
                .then(function(t) {
                  t.animateTo({a:0,sx:0.25,sy:0.25}, 0.2, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
                    .then(function(t) {
                      t.remove();
                    })
                })
            })
        });
    });
  });
});


function balloon(eventName, image, textColor, offset, parent) {
  return function(e) {
    var x = e.x; var y = e.y;

    var textbg = scene.create({t:"image9",resource:image,parent:parent,r:randomInt(-10,10),a:0});
    textbg.ready.then(function() {
      textbg.x = x-textbg.w/2;
      textbg.y = y-textbg.h;
      textbg.cx = textbg.w/2;
      textbg.cy = textbg.h/2;

      var text = scene.create({t:"text",text:eventName, parent:textbg, 
                                   textColor:textColor});
      text.ready.then(function() {
        text.x = (textbg.w-text.w)/2;
        text.y = (textbg.h-text.h-10)/2;
        text.cx = text.w/2;
        text.cy = text.h/2;
        textbg.a = 1;
        textbg.animateTo({y: textbg.y-10-offset}, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
          .then(function(t) {
            t.animateTo({a:0}, 0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1)
              .then(function(t) {
                t.remove();
              })
          });
      });
    });
  }
}

var whiteBalloon = scene.create({t:"imageResource", url:basePackageUri+"/images/textballoon_white.png"});
var blueBalloon = scene.create({t:"imageResource", url:basePackageUri+"/images/textballoon_blue.png"});
var redBalloon = scene.create({t:"imageResource", url:basePackageUri+"/images/textballoon_red.png"});

scene.on("onMouseMove", balloon("mousemove", whiteBalloon, 0x000000ff,0, back));
scene.on("onMouseDown", balloon("mousedown", blueBalloon, 0xffffffff,0, front));
scene.on("onMouseUp",   balloon("mouseup", redBalloon, 0xffffffff,25, front));

function blah(eventname) {
  
  return function(x, y) {
    var text = scene.create({t:"text",r:randomInt(-10,10),
                                 text:eventname, parent:root});
    text.ready.then(function() {
      text.x = (scene.getWidth()-text.w)/2;
      text.y = (scene.getHeight()-text.h)/2;
      text.cx = text.w/2;
      text.cy = text.h/2;
      text.animateTo({y: text.y-10}, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)
        .then(function(t) {
          t.animateTo({a:0}, 0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1)
            .then(function(t) {
              t.remove();
            })
        });
    });
  }
}

scene.on("onMouseEnter", blah("mouseenter"));
scene.on("onMouseLeave", blah("mouseleave"));

}).catch( function importFailed(err){
  console.error("Import failed for events.js: " + err)
});

