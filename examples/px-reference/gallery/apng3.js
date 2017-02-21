px.import("px:scene.1.js").then( function ready(scene) {

  let basePackageUri = px.getPackageBaseFilePath();

  let url = "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png";

  let i = scene.create({t:"imageA",url:url,parent:scene.root});
  
  i.ready.then(()=>{
    let iw = scene.create({t:"imageA",url:url,parent:scene.root,stretchX:1});
    iw.ready.then(o=>{iw.x=i.w;iw.w=i.w*2;});
    let ih = scene.create({t:"imageA",url:url,parent:scene.root,stretchY:1});
    ih.ready.then(o=>{ih.y=i.h;ih.h=i.h*2;});
    let it = scene.create({t:"imageA",url:url,parent:scene.root,stretchX:2,stretchY:2});
    it.ready.then(o=>{it.x=i.w;it.y=i.h;it.x=i.w;it.w=i.w*2;it.y=i.h;it.h=i.h*2;});
  });

}).catch( function importFailed(err){
  console.error("Import failed for fancy.js: " + err)
});

