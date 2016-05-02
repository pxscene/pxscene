px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
  root.h = 1000;
 
  var s = scene.create({t:"scene",parent:root,w:1200,h:400,url:"http://www.pxscene.org/examples/px-reference2/gallery/coverflow_v2_angled.js"});
  s.focus = true;

});

