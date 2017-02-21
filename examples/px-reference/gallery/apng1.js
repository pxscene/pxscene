px.import("px:scene.1.js").then( function ready(scene) {

  let basePackageUri = px.getPackageBaseFilePath();

  let urls = [
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/elephant.png",
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png",  
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/spinfox.png",
  ];

  let ready = urls.map(url=>{return scene.create({t:"imageA",url:url,parent:scene.root}).ready.catch(e=>{return null})})

  Promise.all(ready).then(values=>{
    let x = 0;
    for (let o of values) {
      if (!o) continue;
      o.animateTo({x:x},1.5,scene.animation.TWEEN_STOP);
      x += o.w; 
    }
  });

}).catch( function importFailed(err){
  console.error("Import failed for fancy.js: " + err)
});

