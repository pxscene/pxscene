px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
 
  var s = scene.create({t:"scene",parent:root,w:1200,h:400,url:"http://www.pxscene.org/examples/px-reference/gallery/coverflow.js"});
  s.focus = true;

});
