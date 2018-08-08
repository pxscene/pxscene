
px.import({ scene:      'px:scene.1.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var base  = px.getPackageBaseFilePath();

//  var url = "https://raw.githubusercontent.com/memononen/nanosvg/master/example/23.svg";
  var url = base + "/Tiger.svg";

  var bg       = scene.create({ t: "rect", parent: root, w: scene.w, h: scene.h, fillColor: "#000" });
  var svgImage = scene.create({ t: "image", parent: bg, url: url, draw: false});

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w,h)
  {
    bg.w = w;
    bg.h = h;

    svgImage.x = (w - svgImage.resource.w)/2;
    svgImage.y = (h - svgImage.resource.h)/2 + 50;
    svgImage.draw = true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) { updateSize(e.w, e.h); });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([ bg.ready, svgImage.ready ])
      .then( function(o) 
      {
        updateSize(scene.w, scene.h)
      },
      function(o)
      {
        console.log("Loading [ bg.ready, svgImage.ready ] failed.")
      });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch( function importFailed(err){
  console.error("SVG >> Import failed for Tiger.js: " + err);
});
