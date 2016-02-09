px.import("px:scene.1.js").then( function ready(scene) {
var root = scene.root;

var e = scene.create({t:"external",x:50,y:50,w:200, h:200, r:45, parent:root});
//scene.setFocus(e);
e.focus=true;

}).catch( function importFailed(err){
  console.error("Import failed for external.js: " + err)
});


