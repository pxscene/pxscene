

var extra = "/Users/hfitzp200/Desktop/XRE2_JavaScript/Squares/";

px.configImport({"extra:":extra});

px.import({           scene: 'px:scene.1.js',
                       keys: 'px:tools.keys.js',
          DistractorSquares: 'extra:distractorSquares.js'
}).then( function importsAreReady(imports)
{
    var basePackageUri = px.getPackageBaseFilePath();

    var scene             = imports.scene;
    var keys              = imports.keys;
    var root              = imports.scene.root;
    var DistractorSquares = imports.DistractorSquares;
    var myStretch         = scene.stretch.STRETCH;

  var text = scene.create({
    t: "text",                // Element type will be text
    parent: scene.root,       // Parent element
    text: "pxscene !",        // the text
    x: 580, y: 200,           // position
//    textColor:0x869CB2ff,     // RGBA - red text
    textColor:0xFFFFFFff,     // RGBA - red text
    pixelSize:64              // font height
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var squares = new DistractorSquares( { parent: scene.root, x: 315, y: 70, w: 800, h: 800,
                                            tweenType: scene.animation.TWEEN_LINEAR,
                                              duration: 0.2 });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Initial layout...
  Promise.all([ squares ]).then(values =>
    {
      // Initial Draw
      updateSize(scene.getWidth(), scene.getHeight());

      squares.focus = true;
      squares.start();
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w, h)
  {
    console.log("\n\n\n##### HERE");

    squares.x = 0;//(w - squares.w)/2;
    squares.y = (h - squares.h)/2;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  scene.on("onResize", function(e) {  updateSize(e.w,e.h); });


}).catch(function importFailed(err){
   console.error("Import failed for testEdit.js: " + err);
});