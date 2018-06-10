"use strict";

px.import("px:scene.1.js").then(function (scene) {
  var root = scene.root;
  var basePackageUri = px.getPackageBaseFilePath();

  var txt1 = scene.create({ t: "text", x: 10, text: "", parent: root, pixelSize: 64 });

  var url = "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png";
  var ball = scene.create({ t: "imageA", w: 300, h: 300, url: url, parent: root });
  ball.ready.then(function () {
    ball.cx = ball.w / 2;
    ball.cy = ball.h / 2;

    fancy(ball);
  });
  function fancy(o) {
    var startX = 450;
    var startY = 100;

    // animate x and restart the overall animation at end
    o.x = startX;
    o.animateTo({ x: 50 }, 1.0, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1).then(function (o) {
      o.animateTo({ x: startX }, 3.0, scene.animation.EASE_OUT_ELASTIC, scene.animation.OPTION_LOOP, 1).then(function (o) {
        fancy(o);
      });
    });

    // animate y
    o.y = startY;
    o.animateTo({ y: 350 }, 1.0, scene.animation.EASE_OUT_BOUNCE, scene.animation.OPTION_LOOP, 1).then(function (o) {
      o.animateTo({ y: startY }, 1.0, scene.animation.EASE_OUT_ELASTIC, scene.animation.OPTION_LOOP, 1);
    });

    // animate r
    o.r = 0;
    o.animateTo({ r: -360 }, 2.5, scene.animation.EASE_OUT_ELASTIC, scene.animation.OPTION_LOOP, 1);

    // animate sx, sy
    o.animateTo({ sx: 0.2, sy: 0.2 }, 1, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1).then(function (o) {
      o.animateTo({ sx: 2.0, sy: 2.0 }, 1.0, scene.animation.TWEEN_EXP1, scene.animation.OPTION_LOOP, 1).then(function (o) {
        o.animateTo({ sx: 1.0, sy: 1.0 }, 1.0, scene.animation.EASE_OUT_ELASTIC, scene.animation.OPTION_LOOP, 1);
      });
    });
  }

  scene.on("onMouseMove", function (e) {
    txt1.text = "" + e.x + ", " + e.y;
  });

  function updateSize(w, h) {
    txt1.y = h - txt1.h;
  }

  scene.on("onResize", function (e) {
    console.log("fancy resize", e.w, e.h);updateSize(e.w, e.h);
  });
  updateSize(scene.getWidth(), scene.getHeight());
}).catch(function (e) {
  console.error("Import failed for fancy.js: " + e);
});