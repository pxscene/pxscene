//"use strict";
px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
  var basePackageUri = px.getPackageBaseFilePath();

  var t = scene.create({t:"text",parent:root,text:"Hello",x:100,y:400,pixelSize:64});

  var o = scene.create({t:"rect",parent:root,fillColor:0xff0000ff,w:300,h:300,cx:150,cy:150,c:[
    {t:"rect",fillColor:0xffffffff,w:100,h:100,x:100,y:100,cx:50,cy:50,rx:1,rz:0},
  ]});
  var o2 = scene.create({t:"rect",parent:root,fillColor:0xff0000ff,w:300,h:300,cx:150,cy:150,c:[
    {t:"rect",fillColor:0xffffffff,w:100,h:100,x:100,y:100,cx:50,cy:50,rx:1,rz:0},
  ]});

   //scene.setFocus(o);
   o.focus = true;
   //scene.setFocus(o.children[0]);
   o.children[0].focus = true;

   o.animateTo({r:360},2,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, scene.animation.COUNT_FOREVER);
   o2.animateTo({r:360},2,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, scene.animation.COUNT_FOREVER);

  /**
   *
   * @constructor
   */
  function Element() {

  }

  /**
   *
   * @param nCoin
   * @param fOnChocAvailable
   * @param fOnError
   */
  Element.prototype.getChoc = function(nCoin, fOnChocAvailable, fOnError) {
  };

  /*
   setTimeout(function(){
   o.remove();
   }, 5000);
   */

  function onSize(w,h) {
      t.text = "Size: " + w + ", " + h;
      o2.x = w-o2.w;
      o2.y = h-o2.h;
  }

  o.on('onKeyDown', function (e) {
    px.log.message(2, "dom.js - 2 keydown:" + e.keyCode);
  });

  scene.on('onResize', function(e) {
      onSize(scene.w, scene.h);
    });
  onSize(scene.w,scene.h);

}).catch( function importFailed(err){
  console.error("Import failed for dom.js: " + err)
});




