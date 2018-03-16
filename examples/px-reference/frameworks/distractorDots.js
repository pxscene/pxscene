
px.import({ scene: 'px:scene.1.js',
             keys: 'px:tools.keys.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = scene.root;
  var keys  = imports.keys;

  //
  // Properties

  let SCALE = 1;
  let FADE  = 2;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EXAMPLE:  
//
//     var dots = new Distractor( {     url: basePackageUri + "/dot_65x65.png",        <<<<< Image to Animate 
//                                   parent: myParent,
//                                        w: 400, 
//                                        h: 20,
//                                        x: 0,
//                                        y: 15
//    } );
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Distractor(params)
{
  var self = this;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._x = 0;
  Object.defineProperty(this, "x",
  {
      set: function(val) { this._x = val;  notify( "setX( " + val + " )" ); },
      get: function()    { return this._x; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._y = 0;
  Object.defineProperty(this, "y",
  {
      set: function(val) { this._y = val;  notify( "setY( " + val + " )" ); },
      get: function()    { return this._y; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._w = 200; // default
  Object.defineProperty(this, "w",
  {
      set: function(val) { this._w = val;  notify( "setW( " + val + " )\n" );  updateSize(this._w, this._h);},
      get: function()    { return this._w; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._h = 20; // default
  Object.defineProperty(this, "h",
  {
      set: function(val) { this._h = val;  notify( "setH( " + val + " )\n" );  updateSize(this._w, this._h);},
      get: function()    { return this._h; },
  });  

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._style = SCALE;
  Object.defineProperty(this, "style",
  {
      set: function(val) { this._style = val;  notify( "setStyle( " + val + " )\n" ); },
      get: function()    { return this._style; },
  });       
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._duration = 0.35;  // seconds
  Object.defineProperty(this, "duration",
  {
      set: function(val) { this._duration = val;  notify( "setDuration( " + val + " )\n" ); },
      get: function()    { return this._duration; },
  });   
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._gapPercent    = 0.10; // 10% 
  Object.defineProperty(this, "gapPercent",
  {
      set: function(val) { this._gapPercent = val;  notify( "setGapPercent( " + val + " )\n" ); },
      get: function()    { return this._gapPercent; },
  });      
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._numDots = 3;
  Object.defineProperty(this, "numDots",
  {
      set: function(val) { this._numDots = val;  notify( "setNumDots( " + val + " )\n" ); },
      get: function()    { return this._numDots; },
  });      
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      
  function notify( msg )
  {
    //  console.log("layout( " + msg + " ) >>> WxH: " + this._w + " x " + this._h +  " at (" + this._x + "," + this._y + ")");
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var dots = [];  // dot images
  var container;
  var dot_image;

  if( params.url === undefined )
  {
    console.error("createDistractor() .... URL - not defined");
  }

                                                   // set -OR- (default)   
  this.parent    =    "parent" in params ? params.parent    :   scene.root;  // critical
  this._x        =         "x" in params ? params.x         :   0;   
  this._y        =         "y" in params ? params.y         :   0;
  this._w        =         "w" in params ? params.w         : 200;
  this._h        =         "h" in params ? params.h         :  50;
  this._style    =     "style" in params ? params.style     : SCALE;
  this._duration =  "duration" in params ? params.duration  : ((this._style == SCALE) ? 0.55 : 0.75);

  container = this.parent;

  dot_image = scene.create({t:"imageResource", url: params.url});

  Promise.all([ container.ready, dot_image.ready])
        .catch(function(err)
        {
            console.log(">>> IMAGES FAILED ... err = " + err);
        })
        .then(function(success, failure)
        {
//         console.log(">>> IMAGES LOADED ... success = " + success + "  failure = " + failure);
        });

  updateDots(this._x, this._y, this._w, this._h);

// Custom Setters
// 
//  this.__defineSetter__('xy', function(val) 
//  { 
//     this._x = val.x;  
//     this._y = val.y;
//  });

//  this.__defineSetter__('wh', function(val) 
//  { 
//     this._w = val.w;  
//     this._h = val.h;
//  });

//  this.xy = {x: 23, y: 44};

  this.start = function()
  {
    if(self._style == SCALE) 
    {
      animateScaleOut(dots[0]);
    }
    else
    {
      animateFadeOut(dots[0]);
    }
  };

  function updateDots(x,y, w, h)
  {
      console.log(">>> updateDots()  w = " + w + "  h = " + h);

      var cx = x;
      var cy = y;

      var cw = w;
      var ch = h;

      var pc     = (1.0 - self._gapPercent);
      var dot_w  = (cw / self._numDots);

      // Fit width & height ?
      dot_w = (dot_w > ch) ? ch : dot_w;

      var gap_w  = dot_w * self._gapPercent;

      dot_w -= gap_w; // allow for gap between dots.
      var dot_h  = dot_w;

      // Initial centering...
      var px = cx + (cw - ((dot_w + gap_w) * self._numDots)) / 2;
      var py = cy + (ch - dot_h) / 2;

      var dot_cx = dot_w / 2;
      var dot_cy = dot_h / 2;

      for(var i=0; i < self._numDots; i++)
      { 
        if(i >= dots.length)   
        {   
          // Initial Create...
          dots[i] = scene.create({t:"image", parent: container, resource: dot_image, id: (i+1), a: 0, 
                                  x: px, y: py,  w: dot_w,   h: dot_h,
                                  sx: 0, sy: 0, cx: dot_cx, cy: dot_cy,
                                  stretchX: scene.stretch.STRETCH, stretchY: scene.stretch.STRETCH });
        }
        else
        {
           // Reposition...
          dots[i].x  = px;      dots[i].y  = py;     // Position
          dots[i].w  = dot_w;   dots[i].h  = dot_h;  // Size

          dots[i].cx = dot_w / 2;
          dots[i].cy = dot_h / 2;        
        }

        px += gap_w + dot_w;
      }
  }

  function updateSize(w, h)
  {
    var scale = Math.max( (w / 1280), (h/ 720) );

    container.sx = scale;   container.sy = scale;

    this.updatePosition(self._x, self._y);
    
    updateDots(w,h);
  }

  this.updatePosition = function updatePosition(x, y)
  {  
    self._x = x; self._y = y;
  };

  function animateScaleOut(fade_out)
  {
    var tt = self._duration;

    var ii   = Number(fade_out.id);          // make next index
    var idx  = (ii == self._numDots) ? 0 : ii; // wrap         
    var fade_in = dots[idx];

    fade_out.animateTo({a: 0.5, sx: 0.5, sy: 0.5 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1); // FADE OUT
     fade_in.animateTo({a: 1.0, sx: 1.0, sy: 1.0 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)  // FADE IN
    .then( function(dot) 
    {
      animateScaleOut(dot);
    });
  }

  function animateFadeOut(fade_out)
  {
    var tt = self._duration;

    var ii   = Number(fade_out.id);          // make next index
    var idx  = (ii == self._numDots) ? 0 : ii; // wrap         
    var fade_in = dots[idx];

    fade_out.animateTo({a: 0, sx: 0, sy: 0 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1); // FADE OUT
     fade_in.animateTo({a: 1, sx: 1, sy: 1 }, tt, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1)  // FADE IN
    .then( function(dot) 
    {
      animateFadeOut(dot);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this.ready = new Promise(function(resolve, reject)
  {
        Promise.all([dot_image.ready])
        .then(function() {
            console.log("PROMISE ALL IS READY");
            resolve();
        });        
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      
}//class 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Distractor;

}).catch(function importFailed(err){
    console.error("Import failed for distractorDots.js: " + err);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

