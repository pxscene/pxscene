px.import("px:scene.1.js").then( function ready(scene) {

  var basePackageUri = px.getPackageBaseFilePath();

  var urls = [
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/elephant.png",
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png",
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/spinfox.png",
  ];

  var ready = urls.map(url=>{return scene.create({t:"imageA",x:0,url:url,parent:scene.root}).ready;})

  Promise.all(ready).then(values=>{
    var x = 0;
    for (var o of values) {
      o.animateTo({x:x},1.5,scene.animation.TWEEN_STOP);
      x += o.w; 
    }
  });

}).catch( function importFailed(err){
  console.error("Import failed for fancy.js: " + err)
});

