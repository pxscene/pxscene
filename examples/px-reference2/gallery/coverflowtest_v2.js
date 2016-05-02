px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
  root.h = 1000;
 
 //url:"http://xre2-apps.cvs-a.ula.comcast.net/pxscene-samples/examples/px-reference/gallery/coverflow_v2.js"
  var s = scene.create({t:"scene",parent:root,w:1200,h:400,url:"/home/cfry002/pxscene-samples/examples/px-reference/gallery/coverflow_v2.js"});
  s.focus = true;

});

