px.import("px:scene.1.js").then( function ready(scene) {

  var root = scene.root;


  for (var i = 0; i < 10000; i++) {
 var o = scene.create({t:"rect",parent:root,fillColor:0xffffffff,x:500,y:500,w:300,h:300,cx:150,cy:150});
  }

  var o = scene.create({t:"rect",parent:root,fillColor:0xffffffff,x:0,y:0,w:300,h:300,cx:150,cy:150});
  o.animateTo({r:360},2,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, scene.animation.COUNT_FOREVER);

}).catch( function importFailed(err){
  console.error("Import failed for picturepile.js: " + err)
});




