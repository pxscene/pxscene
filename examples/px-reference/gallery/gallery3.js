px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;
  var appURLs = ["dynamics.js","fonts.js","fancy.js","apng1.js"];

  var url;
  var basePackageUri = px.getPackageBaseFilePath();

  url = basePackageUri + "/images/skulls.png";
  var bg = scene.create({t:"rect", parent:root, url: url, stretchX:scene.stretch.REPEAT, stretchY:scene.stretch.REPEAT, fillColor: 0xe0e0e0ff});

  url = basePackageUri + "/images/status_bg.png";
  var bgShade = scene.create({t:"image", parent:root, url: url, stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH});

  var childPad = 48;
  var childAppWidth = 1280;
  var childAppHeight = 720;
  var childAcross = 2;
  var selectWidth = 1280 + 2 * childPad;
  var selectHeight = 720 + 2 * childPad;
  var childScale = 0.45;

  var select;

  var apps = scene.create({t:"image", parent:root, sx: childScale, sy: childScale, w: 1280, h: 720});
  //var apps = scene.create({t:"rect",sx: 0.25, sy: 0.25, w: 1280, h: 720});

  for (var i = 0; i < appURLs.length; i++) {
    var appUrl = basePackageUri + "/" + appURLs[i];
    var c = scene.create({
      t:"scene", url: appUrl, parent:apps,
      w: childAppWidth, h: childAppHeight, clip: true
    });

    c.on("onMouseDown", function (e) {
      var c = e.target;
      console.log("flags:", e.flags);
      if (e.flags == 4) {  // ctrl-mousedown
        c.cx = c.w / 2;
        c.cy = c.h / 2;
        c.animateTo({r: c.r + 360}, 3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP,1);
      }
      c.focus = true;
      select.animateTo({x: (c.x - childPad) * childScale, 
                        y: (c.y - childPad) * childScale},
        0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
    });

    if (i == 0) 
      c.focus = true;

  }

  var url = basePackageUri + "/images/select.png";
  select = scene.create({t:"image9",
    parent: root, url: url, insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
    w: selectWidth * childScale, h: selectHeight * childScale, x: 0, y: 0, interactive: false
  });
  select.ready.then(function () {
    select.w = selectWidth * childScale;
    select.h = selectHeight * childScale;
  });

  scene.root.on('onKeyDown', function (e) {
    if (e.keyCode == 32) {
      root.painting = !root.painting;
    }
  });


  function positionApps() {
    for (var i = 0; i < apps.children.length; i++) {
      var c = apps.children[i];
      c.animateTo({
          x: ((i % childAcross) * (childAppWidth + childPad)) + childPad,
          y: (Math.floor(i / childAcross) * (childAppHeight + childPad)) + childPad
        },
        0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);

    }
  }

  function updateSize(w, h) {
    bg.w = w;
    bg.h = h;
    bgShade.w = w;
    bgShade.h = h;
    root.w = w;
    root.h = h;
    childAcross = Math.floor(w / ((childAppWidth + childPad) * childScale));
    if (childAcross < 1)
      childAcross = 1;
    positionApps();

  }

  scene.on("onResize", function (e) {
    updateSize(e.w, e.h);
  });
  updateSize(scene.getWidth(), scene.getHeight());
}).catch( function importFailed(err){
  console.error("Import for gallery.js failed: " + err)
});




