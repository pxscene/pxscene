px.import("px:scene.1.js").then(scene=>{

  let basePackageUri = px.getPackageBaseFilePath();

  let urls = [
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/elephant.png", // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png",     // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/spinfox.png",  // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/star.png",          // supports plain old pngs
  "http://www.pxscene.org/examples/px-reference/gallery/images/ajpeg.jpg",         // and single frame jpegs too!!
  ];

  let ready = urls.map(url=>{return scene.create({t:"imageA",url:url,parent:scene.root}).ready.catch(e=>{return null})})

  let images = []
  let imageTargets;

  let layout = ()=>{
    let x = 0; let y = 0; let rowHeight = 0;
    for (let i in images) {
      let o = images[i]
      let t = imageTargets[i];
      if (!o) continue;
      if (x+o.w > scene.getWidth())
      {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
      }
      // TODO should we have an option to not cancel
      // animations if targets haven't changed
      if (t.x != x || t.y != y) {
        o.animateTo({x:x,y:y},1,scene.animation.TWEEN_STOP).catch(()=>{});
        imageTargets[i].x = x;
        imageTargets[i].y = y;
      }
      x += o.w;
      rowHeight = Math.max(rowHeight,o.h);
    }  
  };

  Promise.all(ready).then(values=>{
    images = values;
    imageTargets = images.map(image=>{return {x:-1,y:-1};});
    layout();
  });

  scene.on("onResize", e=>{layout();});
  
}).catch(e=>{
  console.error("Import failed for fancy.js: " + e)
});

