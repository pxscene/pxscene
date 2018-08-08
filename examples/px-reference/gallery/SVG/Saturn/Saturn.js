
px.import({ scene:      'px:scene.1.js',
             http:      'http',
             keys:      'px:tools.keys.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var keys  = imports.keys;
  var root  = imports.scene.root;

  var base  = px.getPackageBaseFilePath();
//  var url = "https://upload.wikimedia.org/wikipedia/commons/2/2d/Saturn_diagram.svg";
  var url = base + "/Saturn.svg";

  var ss = scene.stretch.STRETCH;

  var bg       = scene.create({ t: "rect", parent: root, x: 0, y: 0, w: scene.w, h: scene.h, fillColor: 0x000000FF });
  var svgRes   = scene.create({ t: "imageResource", w: scene.w, h: scene.h, url: url });
  var svgImage = scene.create({ t: "image", parent: bg, resource: svgRes, stretchX: ss, stretchY: ss, smoothDownscale: true });

/*

var svgRes = scene.create({ t: "imageResource", w: scene.w, h: scene.h, url: url });

            // convert the data URI by stripping off the scheme and type information
            // to a base64 encoded string with just the PNG image data
            var base64PNGData = dataURI.slice(dataURI.indexOf(',')+1);

            // decode the base64 data and write it to a file
            fs.writeFile("screenshot.png", new Buffer(base64PNGData, 'base64'), function(err)

            
var svgString    = "SVG    string directly";
var base64String = "Base64 string directly";

var svgRes       = scene.create({ t: "imageResource", string: svgString     });
var base64Res    = scene.create({ t: "imageResource", string: base64String  });

*/
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w,h)
  {
    bg.w = w;
    bg.h = h;

    svgRes = null;
    svgRes = scene.create({ t: "imageResource", w: w, h: h, url: url });

    svgRes.ready.then(function(o){

    svgImage.resource = svgRes;

    var ar = 1;

    if(svgRes.h > 0)
    {
      ar = svgRes.w / svgRes.h;
    }

    svgImage.w = scene.w;
    svgImage.h = svgImage.w / ar;

    svgImage.x = (w - svgImage.w)/2;
    svgImage.y = (h - svgImage.h)/2;
  
    })
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) { updateSize(e.w, e.h); });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([ bg.ready, svgRes.ready, svgImage.ready ])
      .catch( (err) =>
      {
          console.log("SVG >> Loading Assets ... err = " + err);
      })
      .then( (success, failure) =>
      {
        updateSize(scene.w, scene.h)
      });


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch( function importFailed(err){
  console.error("SVG >> Import failed for Saturn.js: " + err);
});
