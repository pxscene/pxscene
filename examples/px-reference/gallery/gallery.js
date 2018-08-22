"use strict";

px.import({ scene: 'px:scene.1.js',
             keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;
  var keys  = imports.keys;

  var base = px.getPackageBaseFilePath();

  var pos_x = 0, pos_y = 0;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var appURLs = ["picturepile2.js", "apng1.js", "dynamics.js",
                 "mousetest2.js",   "fancy.js", "apng2.js",
                 "masktest.js",     "fonts.js", "events.js"];

  // var appURLs = ["dummyScene.js?color='#ff0'", "dummyScene.js?color='#0f0'", "dummyScene.js?color='#00f'",
  //                "dummyScene.js?color='#ff0'", "dummyScene.js?color='#0ff'", "dummyScene.js?color='#f0f'",
  //                "dummyScene.js?color='#880'", "dummyScene.js?color='#088'", "dummyScene.js?color='#808'"];
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var url = base + "/images/status_bg.svg";

  var bgShade = scene.create({ t: "image", parent: root, url: url, w: scene.w, h: scene.h,
                              stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH });

  var demoMode          = false;
  var demoStopping      = false;
  var demoIndex         = 0;
  var demoTimer         = null;

  var animSelectMoveTo  = null;
  var animSelectFadeOut = null;
//  var animSelectFadeIn  = null;
  var animAppZoomIn     = null;
  var animAppZoomOut    = null;

  var childPad =   48;
  var child_w  = 1280;
  var child_h  =  720;

  var num_rows =    3;
  var num_cols =    3;

//var aspect   = child_w / child_h; 
  var select_w = child_w + (2 * childPad);
  var select_h = child_h + (2 * childPad);

  var child_sx = child_w / select_w / num_cols;
  var child_sy = child_h / select_h / num_cols;

  var doppel = null;  // 'Doppelganger' aka. Clone !
  var select = null;

  var fontRes = scene.create({ t: "fontResource",  url: "FreeSans.ttf" });
  var    apps = scene.create({ t: "image", parent: root, sx: child_sx, sy: child_sy, w: child_w, h: child_h });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // Create the child App scenes...
  //
  appURLs.map( (url, index) =>
  {
    if(url.indexOf("dummyScene") >= 0) /// Using offline Dummy scenes
    {
      url += "&text='Scene "+index+"'"; // append "Scene (index)"

      url = url.replace(/#/, "%23"  ); // Escape #
      url = url.replace(/'/g, ""  );   // remove '
      url = url.replace(/"/g, ""  );   // remove "
    }

    var appUrl = base + "/" + url;
    var app = scene.create( { t: "scene", parent: apps, id: index, url: appUrl, w: child_w, h: child_h, clip: true });

    app.on("onMouseDown", function (e)
    {
      if(animAppZoomIn || animAppZoomOut)
      {
        return; // busy
      }

      var hit = e.target;

      if(demoMode == false)
      {
        demoIndex = parseInt(hit.id);
      }

      select.id = hit.id; // always

      //--------------------------------[ CTRL ALT + Click ]-------------------------------
      //
      if ( (e.flags & 48) == 48) // CTRL ALT + Click
      // if ( keys.is_CTRL_ALT(e.flags) ) // Zoom-In
      {
        if(demoMode == false)
        {
          (select.a == 1) ? zoomIn(hit.id) : zoomOut(hit.id);
          e.stopPropagation();
        }
      }
      else
      //----------------------------------[ CTRL + Click ]---------------------------------
      //
      if (e.flags & 16) // CTRL + Click
      {
        hit.cx = hit.w / 2;
        hit.cy = hit.h / 2;

        // rewind if cancelled; reset to 0 when complete
        // ready for the next one
        hit.animateTo({ r: 360 }, 3, scene.animation.TWEEN_STOP, scene.animation.OPTION_REWIND)
        .then(function (o) { o.r = 0; });

        e.stopPropagation();

        // TODO this should work too... see what's wrong
        //c.animateTo({r: 360}, 3, scene.animation.TWEEN_STOP).then(o=>{o.r=0}).catch(o=>{o.r=0});
      }
      //-----------------------------------------------------------------------------------

      hit.focus = true;
      select.animateTo({ x: (hit.x - childPad) * child_sx,
                         y: (hit.y - childPad) * child_sy }, 0.3,
          scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);

      pos_x = Math.round( hit.x / (select_w ) )
      pos_y = Math.round( hit.y / (select_h ) )

          //console.log("DEBUG: moveTo() >> pos_x: " + pos_x + " pos_y: " + pos_y + " <<<<<< MOUSE CLICKED");
    });

    if (index == 0) app.focus = true;
  }, scene); // MAP

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var url = base + "/images/select.png";

  // Create Shadow Highlight
  doppel = scene.create({ t: "image9", parent: root, url: url, a: 0,
                          insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
                          w: (select_w * child_sx), h: (select_h * child_sy), x: 0, y: 0, interactive: false });

  // Create Highlight
  select = scene.create({ t: "image9", parent: root, url: url, id: 0, // <<< Using ID
                          insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
                          w: (select_w * child_sx), h: (select_h * child_sy), x: 0, y: 0, interactive: false });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function sub2ind(x,y)
  {
    return (y * num_cols) + x;
  }

  function ind2sub(sel)
  {
      return { x: Math.floor(sel % num_cols),
               y: Math.floor(sel / num_rows)  };
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  scene.root.on('onKeyDown', function (e)
  {
    //----------------------------------[ CTRL - SHIFT]----------------------------------
    //
    if ( keys.is_CTRL_SHIFT(e.flags) )
    {
      if (e.keyCode == keys.D) // Demo mode
      {
        demoIndex = 0; // reset
        (demoMode == false) ? startDemo() : stopDemo();

        e.stopPropagation();
      }
    }
    //--------------------------------------[ CTRL ]-------------------------------------
    //
    else
    if ( keys.is_CTRL(e.flags) )
    {
      if (e.keyCode == keys.D) // Demo mode
      {
        (demoMode == false) ? startDemo() : stopDemo();

        e.stopPropagation();
      }
      else
      if (e.keyCode == keys.L) // LAST
      {
        if(select.a == 0)
        {
          zoomOut(hit.id);

          e.stopPropagation();
        }
      }
    }
    //-----------------------------------[ CTRL - ALT ]----------------------------------
    //
    else if ( keys.is_CTRL_ALT(e.flags) )
    {
       if(e.keyCode == keys.ENTER)
       {
          var index = parseInt(select.id);
          (select.a == 1.0) ? zoomIn(index) : zoomOut();
          e.stopPropagation();
       }
    }
    //--------------------------------------[ KEYS ]-------------------------------------
    //
    else
    //if ( keys.is_CTRL_ALT(e.flags) ) // Arrows
    {
      var dx = 0, dy = 0;
      var index = parseInt(select.id);

      switch(e.keyCode)
      {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        case keys.SPACE: root.painting = !root.painting; break; // TOGGLE Painting
        case keys.ENTER: zoomIn(index);                  break; // SELECT App
        case keys.UP:    dx =  0; dy = -1;               break; //    UP a row
        case keys.DOWN:  dx =  0; dy =  1;               break; //  DOWN a row
        case keys.LEFT:  dx = -1; dy =  0;               break; //  LEFT a square
        case keys.RIGHT: dx =  1; dy =  0;               break; // RIGHT a square
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      }//SWITCH

      if(animSelectMoveTo == null && (dx != 0 || dy !=0) ) // Not currently moving, and did change ?
      {
        pos_x += dx;   pos_y += dy;

        moveTo(dx,dy);

        e.stopPropagation();
      }
    }
    //-----------------------------------------------------------------------------------
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
        x:             i % num_cols * (child_w + childPad) + childPad,
        y: Math.floor(i / num_cols) * (child_h + childPad) + childPad
      }, 0.3, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function moveTo(dx, dy)
  {
    return new Promise(function(resolve,reject)
    {
      let tt = 0.4;

      var index = sub2ind(pos_x, pos_y);

      console.log("DEBUG: moveTo() >> index: " + index);

    // Do we need the "offscreen" / Pac-Mac  effect ?
    if(pos_x < 0 || pos_x == num_cols ||
       pos_y < 0 || pos_y == num_rows )
    {
        var doppel_x = pos_x * (child_w + childPad) * child_sx;
        var doppel_y = pos_y * (child_h + childPad) * child_sy;

        doppel.a = 1;
        doppel.x = select.x;
        doppel.y = select.y;

        // Compute offscreen position
            if(pos_x < 0)         pos_x = num_cols;
        else if(pos_x == num_cols) pos_x =  -1;

            if(pos_y < 0)         pos_y = num_cols;
        else if(pos_y == num_rows) pos_y =  -1;

        // Teleport selection position
        select.draw = false;
        select.x = pos_x * (child_w + childPad) * child_sx;
        select.y = pos_y * (child_h + childPad) * child_sy;
        select.draw = true;

        // Final correction
        pos_x += dx;
        pos_y += dy;

        doppel.animate({ x: doppel_x, y: doppel_y, a: 0 }, tt, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
      }

      var xx = pos_x * (child_w + childPad) * child_sx;
      var yy = pos_y * (child_h + childPad) * child_sy;

      // ANIMATE: move Select
      animSelectMoveTo = select.animate({ x: xx, y: yy }, tt, scene.animation.TWEEN_STOP, scene.animation.OPTION_LOOP, 1);
      animSelectMoveTo.done.then(function (o)
      {
        select.id = index;

        animSelectMoveTo = null;
        resolve();
      });
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // ANIMATE - move Selection, fade-out Selection, zoom-in on App
  //
  function switchTo(i)
  {
    // console.log("DEBUG: switchTo() >> index: " + i);

    return new Promise(function(resolve,reject)
    {
        var p = ind2sub(i)

        pos_x = p.x; pos_y = p.y;

        moveTo(p.x, p.y)
        .then(function(o)
        {
          zoomIn( parseInt( i ) )
          .then(function(o)
          {
            resolve();

          }, function() { console.log("DEBUG: zoomIn() >> REJECT "); } )

        }, function() { console.log("DEBUG: selectSquare() >> REJECT "); } )
    }); // Pomise
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // ANIMATE - fade-out Selection, zoom-in to App
  //
  function zoomIn(i)
  {
    // console.log("DEBUG: zoomIn() >> index: " + i);

    return new Promise(function(resolve,reject)
    {
      var c = apps.children[ parseInt(i) ];

      if(c == undefined)
      {
        return;
      }

      var tt = 1;

      // ANIMATE: fade Select
      animSelectFadeOut = select.animateTo({ a: 0 }, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_FASTFORWARD, 1);
      animSelectFadeOut.then( function()
      {
        animSelectFadeOut = null;

//      if(demoStopping == true) return;

        var sx = (root.w / c.w);
        var sy = (root.h / c.h);

        var xx = -c.x * sx;
        var yy = -c.y * sy;

        // ANIMATE: zoom-in App
        animAppZoomIn = apps.animateTo({ sx: sx, sy: sy,  x: xx, y: yy }, tt, scene.animation.TWEEN_STOP, scene.animation.OPTION_FASTFORWARD)
        animAppZoomIn.then(function()
        {
          animAppZoomIn = null;

          c.focus = true;
          resolve();

        }) // animAppZoomIn
      });//promise
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // ANIMATE - zoom-out from App, fade-in Selection
  //
  function zoomOut()
  {
    console.log("DEBUG: zoomOut() >> index: " + select.id);

    return new Promise(function(resolve,reject)
    {
      if(select.a == 1.0) // already zoomed out.
      {
        resolve();
        return;
      }

      animAppZoomOut = apps.animateTo({ sx: child_sx, sy: child_sy, x: 0, y: 0 }, 1, scene.animation.TWEEN_STOP, scene.animation.OPTION_FASTFORWARD);
      animAppZoomOut.then( function()
      {
        // Move Selection
        select.animateTo({ a: 1 }, 0.35, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_FASTFORWARD, 1)
        .then( function()
        {
          animAppZoomOut = null;
          resolve();
        });
      });//fade in
    });//promise
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function runDemo(i = 0, timeout = 10000) // default to 10 seconds
  {
    if(demoStopping == true)
    {
      return;
    }

    demoIndex = i;
    var nextApp = i + 1;
    if(nextApp >= apps.children.length)
    {
      nextApp = 0; //wrap
    }

    console.log("DEMO MODE:  Scheduling App Index " + nextApp + " ...")
    demoTimer = setTimeout( function()
    {
      if(demoStopping == true)
      {
        return // turn off
      }

      zoomOut(i).then(function() // ANIMATE - Selection
      {
        if(demoStopping == true)
        {
          return;
        }

        switchTo(nextApp).then(function()
        {
          if(demoMode == true)
          {
            runDemo( nextApp, timeout ); // next !!
          }
        }); // switchTo()

      }); // zoomOut()

    }, timeout);
  }  // animSelectFadeOut

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // startDemo  >>  runDemo
  //
  //  REPEAT:  zoomOut  >> switchTo  >> moveTo  >> zoomIn

  function startDemo()
  {
    demoMode = true;

    showBanner("Demo Mode: ON")
    .then(function()
    {
      zoomIn(demoIndex);

      demoStopping = false;

      runDemo(demoIndex, 3000);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function stopDemo()
  {
    demoStopping = true;

    if(animAppZoomIn != null)
    {
      animAppZoomIn.cancel();
      // revert ZoomIn
    }
    else
    if(animSelectFadeOut != null)
    {
      animSelectFadeOut.cancel();
    }
    else
    if(animSelectMoveTo != null)
    {
      animSelectMoveTo.cancel();
    }

    demoStopping = true;
    demoMode     = false;

    clearTimeout(demoTimer);
    demoTimer = null;

    showBanner("Demo Mode: OFF");
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function showBanner(txt)
  {
    return new Promise(function(resolve,reject)
    {
      var bw = 400;
      var bh = 100;
      var bx = (scene.w - bw)/2;
      var by = (scene.h - bh)/2;

      var banner = scene.create({t:"rect",    parent: root,   interactive: false, fillColor: "#000", x: bx, y: by, w: bw, h: bh });
      var text   = scene.create({t:"textBox", parent: banner, interactive: false, textColor: "#fff",               w: bw, h: bh,
                        font: fontRes, pixelSize: 40,
                        text: txt,
                        alignHorizontal: scene.alignHorizontal.CENTER,
                        alignVertical:   scene.alignVertical.CENTER})

      Promise.all([banner.ready, text.ready])
      .catch( function (err)
      {
          console.log(">>> Loading Assets ... err = " + err);
      })
      .then( function (success, failure)
      {
        banner.moveToFront();

        setTimeout(function()
        {
          banner.animateTo({ a: 0 }, 1.35, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_FASTFORWARD, 1)
          .then(function ()
          {
            banner.remove();
            resolve();
          })
        }, 1000);
      });
    }); // promise

  }//function()

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateSize(w, h)
  {
    select_w = child_w + (2 * childPad);
    select_h = child_h + (2 * childPad);

    child_sx = w / select_w / num_cols;
    child_sy = h / select_h / num_cols;

    bgShade.w = w;
    bgShade.h = h;

    root.w = w;
    root.h = h;

    apps.sx = child_sx;
    apps.sy = child_sy;

    doppel.remove();
    doppel = null;

    // Re-Create Shadow Highlight
    doppel = scene.create({ t: "image9", parent: root, url: url, a: 0,
                insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
                w: (select_w * child_sx), h: (select_h * child_sy), x: 0, y: 0, interactive: false });

    select.remove();
    select = null;

    // Re-Create Highlight
    select = scene.create({ t: "image9", parent: root, url: url, id: 0,  // <<< Using ID
                insetLeft: 16, insetTop: 16, insetRight: 16, insetBottom: 16,
                w: (select_w * child_sx), h: (select_h * child_sy), x: 0, y: 0, interactive: false });

    repositionApps();
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
  console.error("Import for gallery.js failed: " + err);
});