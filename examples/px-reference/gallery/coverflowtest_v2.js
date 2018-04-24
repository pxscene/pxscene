px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
  root.h = 1000;
  
  var basePackageUri = px.getPackageBaseFilePath();
  var s = scene.create({t:"scene",parent:root,w:1200,h:400,url:basePackageUri+"//coverflow_v2.js"});
  s.focus = true;

  scene.on("onClose", function(e){
    console.log("Coverflowtest got OnClose");
  });
});

