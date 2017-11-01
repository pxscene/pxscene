
px.import({     scene: 'px:scene.1.js',
                 keys: 'px:tools.keys.js',
            bodymovin: 'bodymovin.1.min.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function() 
  {
    return true; // skip clearscreen by framework... using opaque bg.
  };

  var scene     = imports.scene;
  var keys      = imports.keys;
  var root      = scene.root;

  var Bodymovin = imports.bodymovin;
  var paused    = true;
  var jsonFile = px.getPackageBaseFilePath() + "/" + "ballEase.json";

  function getFnName(fn)
  {
    var f = typeof fn == 'function';
    var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
    return (!f && 'not a function') || (s && s[1] || 'anonymous') + "()";
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function containerElement()
  {
      var vv = true;

      this.setAttribute          = function(s, v)  { if(vv) console.log("CONTAINER >> setAttribute( "+s+" )      VALUE: " + JSON.stringify(v) );  this[s] = v; };
      this.appendChild           = function(c)     { if(vv) console.log("CONTAINER >> appendChild()              CHILD: " + JSON.stringify(c) );               };
      this.addEventListener      = function(s,e,b) { if(vv) console.log("CONTAINER >> addEventListener( \"" + s + "\" >> " + getFnName(e) + " )");             };
      this.insertBefore          = function(p,n)   { if(vv) console.log("CONTAINER >> insertBefore( )          ");                                             };
      this.requestAnimationFrame = function(f)     { if(vv) console.log("CONTAINER >> requestAnimationFrame( ) ");  return setTimeout(f, 1000/60);             }; 
      this.getContext            = function(e)     { if(vv) console.log("CONTAINER >> getContext( "+e+" )   ");     return this._context;                      };

      this.scene    = scene;
      this._context = scene.create({ t: "object", parent: scene.root, id: "MyWrapper"});
      
      Object.defineProperty(this, "context",
      {
          set: function (val) { this._context = val;  },
          get: function ()    { return this._context; },
      });

      Object.defineProperty(this, "clip",
      {
          set: function (val) { this._context.clip = val;  },
          get: function ()    { return this._context.clip; },
      });

      Object.defineProperty(this, "x",
      {
          set: function (val) { this._context.x = val;  },
          get: function ()    { return this._context.x; },
      });

      Object.defineProperty(this, "y",
      {
          set: function (val) { this._context.y = val;  },
          get: function ()    { return this._context.y; },
      });

      Object.defineProperty(this, "w",
      {
          set: function (val) { this._context.w = val;  },
          get: function ()    { return this._context.w; },
      });

      Object.defineProperty(this, "h",
      {
          set: function (val) { this._context.h = val;  },
          get: function ()    { return this._context.h; },
      });

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      this.ready = new Promise(function (resolve, reject)
      {
          Promise.all([ this._context ])
              .then(function ()
              {
                  resolve();
              });
      });
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - -    
 
      module.exports = containerElement;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var bmContainer = new containerElement();

    var animData1 =
    {
        renderer:  'pxscene',
        loop:     true,
        autoplay: true,
        rendererSettings: {
            progressiveLoad: false
        },
        path:     jsonFile,
        wrapper:  bmContainer,
    };

    var testBM = {};

 // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });
  var bg      = scene.create({ t: "rect", parent: root,  x:  0, y:  0, fillColor: 0x000000FF, w: 800, h: 600, id: "BG Rect"});
  var title   = scene.create({ t: "text", parent: root,  x: 20, y:  0, textColor: 0xEEEEEEff, pixelSize: 32, text: "BM JSON PARSER", id: "title text"});

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var promises = [ fontRes.ready, bmContainer._context.ready];

  Promise.all(promises)
      .catch((err) => {
          console.log(">>> Loading Assets ... err = " + err);
      })
      .then((success, failure) => {

        bmContainer._context.moveToFront();

        testBM = Bodymovin.loadAnimation(animData1);

        updateSize( scene.getWidth(), scene.getHeight() );
      });
      
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w, h)
  {
    bg.w = w;
    bg.h = h;

    bmContainer.x = 20;
    bmContainer.y = 20;

    bmContainer.w = 800;
    bmContainer.h = 600;
  }

  scene.on("onResize", function(e)
  { 
     updateSize(e.w,e.h); layout(); 
  });

  scene.root.on("onKeyDown", function(e)
  {
    if(paused)
    {
      testBM.play();
    }
    else
    {
      testBM.pause();
    }

    paused = !paused;

  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
}).catch( function importFailed(err){
  console.error("Import failed for test_importBM.js: " + err);
});

