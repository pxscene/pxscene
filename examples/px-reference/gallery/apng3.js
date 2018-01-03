"use strict";

px.import("px:scene.1.js").then(function (scene) {

  var basePackageUri = px.getPackageBaseFilePath();

  var url = "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png";

  var i = scene.create({ t: "imageA", url: url, parent: scene.root });
  var it = void 0;

  i.ready.then(function () {
    var iw = scene.create({ t: "imageA", url: url, parent: scene.root, stretchX: 1 });
    iw.ready.then(function (o) {
      iw.x = i.w;iw.w = i.w * 2;
    });
    var ih = scene.create({ t: "imageA", url: url, parent: scene.root, stretchY: 1 });
    ih.ready.then(function (o) {
      ih.y = i.h;ih.h = i.h * 2;
    });
    it = scene.create({ t: "imageA", url: url, parent: scene.root, stretchX: 2, stretchY: 2 });
    it.ready.then(function (o) {
      it.x = i.w;it.y = i.h;it.x = i.w;it.w = i.w * 2;it.y = i.h;it.h = i.h * 2;
    });
  });

  scene.root.on("onChar", function (e) {
    if (it) {
      switch (e.charCode) {
        case '0'.charCodeAt(0):
          it.stretchX = 0;it.stretchY = 0;
          break;
        case '1'.charCodeAt(0):
          it.stretchX = 1;it.stretchY = 1;
          break;
        case '2'.charCodeAt(0):
          it.stretchX = 2;it.stretchY = 2;
          break;
      }
    }
  });
}).catch(function (e) {
  console.error("Import failed for fancy.js: " + e);
});