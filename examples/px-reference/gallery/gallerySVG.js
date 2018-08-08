"use strict";

px.import({ scene:      'px:scene.1.js',
             keys:      'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var keys  = imports.keys;
  var root  = imports.scene.root;

  var appURLs = [
    "SVG/LogosSVGres.js",
    "SVG/LogoIcons.js",
    "SVG/WikiIcons.js",
    "SVG/Saturn/Saturn.js",
    "SVG/Tiger/Tiger.js",
   // "SVG/GradientTestSVG.js", 
   // "SVG/TinyIconsSVG.js", 
  ];

  var basePackageUri = px.getPackageBaseFilePath();

  var url     = basePackageUri + "/images/status_bg.png";
  var bgShade = scene.create({ t: "image", parent: root, url: url, stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH });

  var RATIO_16_9  = 16/9;
  var child_sx    = 0.25;
  var child_sy    = 0.25;
  
  var childPad    =   48;
  var child_w     = 1280;
  var child_h     =  720;

  var childRows   =    3;
  var childCols   =    3;

  var select_w    = 1280 + (2 * childPad);
  var select_h    =  720 + (2 * childPad);

  var select;

  var apps    = scene.create({ t: "image", parent: root, sx: child_sx, sy: child_sy, w: child_w, h: child_h });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  var numUrls = appURLs.length;

  // Create the child App scenes...
  for (var i = 0; i < numUrls; i++)
  {
    var appUrl = basePackageUri + "/" + appURLs[i];
    var c = scene.create(
    {
      t: "scene", url: appUrl, parent: apps, w: child_w, h: child_h, clip: true
    });

    c.on("onMouseDown", function (e)
    {
      var c = e.target;

      if ( (e.flags & 48) == 48) // CTRL ALT
      // if ( keys.is_CTRL_ALT(e.flags) ) // Zoom-In
      {
        var tt = 1;

        console.log("updateSize() >>  child_sx: "+ child_sx + "  child_w: " + (child_w * child_sx) );

        if(select.a == 1)
        {
          select.a = 0;

          // update selection position
          select.x = (c.x - childPad) * child_sx;
          select.y = (c.y - childPad) * child_sy;

          var sx = (root.w /c.w);
          var sy = (root.h /c.h);

          apps.animateTo({ sx: sx, sy: sy, x: -c.x * sx,  y: -c.y * sy }, tt, scene.animation.TWEEN_STOP, scene.animation.OPTION_FASTFORWARD)
          .then(function (o)
          {
            // nothing
          });
        }
        else
        {
          apps.animateTo({ sx: child_sx, sy: child_sy, x: 0, y: 0 }, tt, scene.animation.TWEEN_STOP, scene.animation.OPTION_FASTFORWARD)
          .then(function (o)
          {
            select.animateTo({ a: 1 }, 0.5, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_FASTFORWARD);
          });
        }
      }
      else
      if ( (e.flags & 16) == 16)
      // if ( keys.is_CTRL(e.flags) )
      {
        // ctrl-mousedown
        c.cx = c.w / 2;
        c.cy = c.h / 2;

        // rewind if cancelled; reset to 0 when complete
        // ready for the next one
        c.animateTo({ r: 360 }, 3, scene.animation.TWEEN_STOP, scene.animation.OPTION_REWIND).then(function (o) {
          o.r = 0;
        });

        // TODO this should work too... see what's wrong
        //c.animateTo({r: 360}, 3, scene.animation.TWEEN_STOP).then(o=>{o.r=0}).catch(o=>{o.r=0});
      }
      else
      {
        c.focus = true;
        if(select.a > 0)
          select.animateTo({ x: (c.x - childPad) * child_sx, y: (c.y - childPad) * child_sy }, 0.3, 
                              scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
      }
    });

    if (i == 0) c.focus = true;
  }//FOR

  var ccx = scene.alignHorizontal.CENTER;
  var ccy = scene.alignVertical.CENTER;

  var textTimer = null;
  var textMsg = scene.create({t: 'textBox', parent: apps, text: "CTRL - ALT  + \"Mouse Click\" to toggle Zoom ", x: 100, y: scene.h - 60, 
                    textColor: "#fff", pixelSize: 50, alignHorizontal: ccx, alignVertical: ccy });

  var url = basePackageUri + "/images/select.png";

  // Create Highlight
  select = scene.create({ t: "image9", parent: root, url: url, 
                          insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
                          w: (select_w * child_sx), h: (select_h * child_sy), x: 0, y: 0, interactive: false
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  scene.root.on('onKeyDown', function (e)
  {
    if (e.keyCode == keys.SPACE)
    {
      root.painting = !root.painting;
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  function repositionApps()
  {
    var numApps = apps.numChildren;
    for (var i = 0; i < numApps; i++)
    {
      var c = apps.children[i]; 
      c.animateTo(
      {
        x:             i % childCols * (child_w + childPad) + childPad,
        y: Math.floor(i / childCols) * (child_h + childPad) + childPad
      }, 0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  function updateSize(w, h)
  {
    bgShade.w = w;
    bgShade.h = h;

    root.w    = w;
    root.h    = h;

    childCols = 3;// Math.floor(w / ((child_w + childPad) * child_sx));

    if (childCols < 1) childCols = 1;
    if (childCols > 3) childCols = 3;

    var max_w = child_sx * child_w * childCols;
    var pad_x = (w - max_w) / 4;

    // Max width
    child_sx  = (w / childCols) / (child_w + (2 * childPad));
    child_sy  = child_sx;

    //childPad = pad_x;

    var max_h = child_sy * child_h * childRows;
    var pad_y = (h - max_h) / childRows;

    if(max_h > h)
    {
      // Max Height
      child_sy  = (h / childCols) / (child_h + (2 * childPad));
      child_sx  = child_sy;

      //childPad = pad_y;
    }

    textMsg.w = w;
    textMsg.y = h - 60;

    apps.w  = w;
    apps.h  = h;
    apps.sx = child_sx;
    apps.sy = child_sy;

    var select_w = (child_w * child_sx) + (childPad / 2);
    var select_h = (child_h * child_sy) + (childPad / 2);

    console.log("resizeApps() >> select WxH: "+ select_w + " x " + select_h );

    if( (select.w != select_w) || (select.h != select_h) )
    {
      select.animateTo(
      {
        w: select_w,
        h: select_h
      }, 0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
    }//ENDIF

    console.log("updateSize() >> Screen WxH: " + w + " x " + h+  "  child WxH: "+ child_w + " x " + child_h + "  childAcross: " + childCols);
    console.log("updateSize() >>  child_sx: "+ child_sx + "  child_w: " + (child_w * child_sx) );
    console.log("updateSize() >>  child_sy: "+ child_sy + "  child_h: " + (child_h * child_sy) );
    console.log("updateSize() >>     max_w: "+ max_w    + "    max_h: " + max_h + "  pad_x: "+ pad_y    + "    pad_y: " + pad_y );

    repositionApps();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  scene.on("onResize", function (e)
  {
    updateSize(e.w, e.h);
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  scene.on("onMouseMove", function (e)
  {
    if(textTimer == null)
    {
      textMsg.a = 1.0;

      textTimer = setTimeout(function()
      {
        textTimer = null;

        textMsg.animateTo(
        {
          a: 0
        }, 1.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);

      }, 4000 ); // milliseconds
    }
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  updateSize(scene.getWidth(), scene.getHeight());

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

}).catch(function importFailed(err) {
  console.error("Import for gallery.js failed: " + err);
});