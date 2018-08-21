"use strict";

px.import({ scene:      'px:scene.1.js',
}).then( function importsAreReady(imports)
{
  var scene   = imports.scene;
  var root    = imports.scene.root;

  var fontRes = scene.create({ t: "fontResource",  url: "FreeSans.ttf" });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateSize(w, h)
  {
    var clr = (px.appQueryParams.color) ? px.appQueryParams.color : "#f00";
    var txt = (px.appQueryParams.text ) ? px.appQueryParams.text  : "Dummy Scene";

    // Create RECT
    var bg = scene.create({ t: "rect", parent: root, w: w, h: h, fillColor: clr, a: 0.5});

    var pts     = 40
    var metrics = fontRes.measureText(pts, txt);

    var bw = metrics.w + 100;
    var bh = metrics.h + 20;
    var bx = (w - bw)/2;
    var by = (h - bh)/2;

    var banner = scene.create({t:"rect",    parent: bg,     interactive: false, fillColor: "#000", x: bx, y: by, w: bw, h: bh });
    var text   = scene.create({t:"textBox", parent: banner, interactive: false, textColor: "#fff", x:  0, y:  0, w: bw, h: bh,
                      font: fontRes, pixelSize: pts, text: txt,
                      alignHorizontal: scene.alignHorizontal.CENTER,
                      alignVertical:   scene.alignVertical.CENTER})
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  updateSize(scene.getWidth(), scene.getHeight());

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}).catch(function importFailed(err) {
  console.error("Import for dummy1.js failed: " + err);
});