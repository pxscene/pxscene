px.import("px:scene.1.js").then( function ready(scene) {

  let basePackageUri = px.getPackageBaseFilePath();

  let urls = [
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/elephant.png", // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png",     // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/spinfox.png",  // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/star.png",          // supports plain old pngs
  "http://www.pxscene.org/examples/px-reference/gallery/images/ajpeg.jpg",       // and single frame jpegs too!!
  ];

  let ready = urls.map(url=>{return scene.create({t:"imageA",url:url,parent:scene.root}).ready.catch(e=>{return null})})

  Promise.all(ready).then(values=>{
    let x = 0; let y = 0; let rowHeight = 0;
    for (let o of values) {
      if (!o) continue;
      if (x+o.w > scene.getWidth())
      {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
      }
      o.animateTo({x:x,y:y},1.5,scene.animation.TWEEN_STOP);
      x += o.w;
      rowHeight = Math.max(rowHeight,o.h);
    }
  });

}).catch( function importFailed(err){
  console.error("Import failed for fancy.js: " + err)
});

