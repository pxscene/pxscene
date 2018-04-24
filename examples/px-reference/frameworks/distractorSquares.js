
px.import({ scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = scene.root;
  var keys  = imports.keys;

  var square_w = 50;
  var square_h = square_w;

  var gap_w = 0;
  var gap_h = 0;

  var last_x;
  var last_y;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EXAMPLE:  
//
//     var squares = new DistractorSquares( {  parent: myParent,
//                                                  w: 400, 
//                                                  h: 20,
//                                                  x: 0,
//                                                  y: 15
//    } );
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DistractorSquares(params)
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
  this._duration = 0.35;  // seconds
  Object.defineProperty(this, "duration",
  {
      set: function(val) { this._duration = val;  notify( "setDuration( " + val + " )\n" ); },
      get: function()    { return this._duration; },
  });   
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._gapPercent    = 0.05; // 10% 
  Object.defineProperty(this, "gapPercent",
  {
      set: function(val) { this._gapPercent = val;  notify( "setGapPercent( " + val + " )\n" ); },
      get: function()    { return this._gapPercent; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._tweenType    = scene.animation.EASE_IN_CUBIC;
  Object.defineProperty(this, "tweenType",
  {
      set: function(val) { this._tweenType = val;  notify( "setTweenType( " + val + " )\n" ); },
      get: function()    { return this._tweenType; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this._loopType    = scene.animation.OPTION_LOOP;
  Object.defineProperty(this, "loopType",
  {
      set: function(val) { this._loopType = val;  notify( "setLoopType( " + val + " )\n" ); },
      get: function()    { return this._loopType; },
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      
  function notify( msg )
  {
    //  console.log("layout( " + msg + " ) >>> WxH: " + this._w + " x " + this._h +  " at (" + this._x + "," + this._y + ")");
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var squares = [];  // square rects
  var container;
                                                   // set -OR- (default)   
  this.parent        =       "parent" in params ? params.parent       :   scene.root;  // critical
  this._x            =            "x" in params ? params.x            :   0;   
  this._y            =            "y" in params ? params.y            :   0;
  this._w            =            "w" in params ? params.w            : 200;
  this._h            =            "h" in params ? params.h            : 200;
  this._duration     =     "duration" in params ? params.duration     :  0.35; //seconds
  this._square_color = "square_color" in params ? params.square_color : 0x869CB2ff;  // gray ?  
  this._tweenType    =   "tween_type" in params ? params.tween_type   : scene.animation.EASE_IN_CUBIC;
  this._loopType     =    "loop_type" in params ? params.loop_type    : scene.animation.OPTION_LOOP;
  this._numSquares   = 8;

  container = this.parent;

  // Setup squares
  updateSquares(this._x, this._y, this._w, this._h);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  this.start = function()
  {
    animateMoveTo(squares[5], 
                  squares[5].x,
                  squares[5].y + (square_h + gap_h) );
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function updateSquares(x,y, w, h)
  {
      var pc    = (1.0 - self._gapPercent);
      square_w  = ( w /  self._numSquares);

      // Fit width & height ?
      square_w = (square_w >  h) ?  h : square_w;
      
      gap_w  = square_w * self._gapPercent;
      if(gap_w < 2) gap_w = 2; // clamp

      gap_h  = gap_w;

      square_w -= gap_w; // allow for gap between squares.
      square_h = square_w;

      // Centering
      var cx = (w - ((square_w + gap_w) * 3)) / 2;
      var cy = (h - ((square_h + gap_h) * 3)) / 2;

      // Initial centering...
      var px =  x + cx;
      var py =  y + cy;

      var square_cx = square_w / 2;
      var square_cy = square_h / 2;

      // Indicies of the perimiter squares ... working backwards.
      //
                    // 0  1  2  3      4    5  6  7
      var prev_id =  [ 3, 0, 1, 6,   999,   2, 7, 5 ]; // 999 is dummy middle square

      for(var i=0; i < self._numSquares; i++)
      { 
        if(squares.length < self._numSquares )   
        {   
            // Initial Create...
            squares[i] = scene.create({ t: "rect", parent: container, x: px, y: py, w: square_w, h: square_h, 
                                    fillColor: self._square_color });         

            squares[i].id = prev_id[i]; // set the previous square ... prearranged by indicies

            squares[i].cx = square_w / 2;
            squares[i].cy = square_h / 2;   
        }
        else
        {
           // Reposition...
          squares[i].x  = px;         squares[i].y  = py;        // Position
          squares[i].w  = square_w;   squares[i].h  = square_h;  // Size

          squares[i].cx = square_w / 2;
          squares[i].cy = square_h / 2;        
        }

        px += (gap_w + square_w);
        if( i > 0 && ( (i + 1) % 3) === 0)
        {
          px  =  x + cx;
          py += (gap_h + square_h);
        }
      }//FOR
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function animateMoveTo(square, new_x, new_y)
  {
    var tt = self._duration;

    self.last_x = square.x;
    self.last_y = square.y;

    square.animateTo({x: new_x, y: new_y }, tt, self._tweenType ,  self._loopType, 1)
    .then( function(moved) 
    {
      var prev = Number(moved.id); // get the previous square ... prearranged by indicies

      animateMoveTo(squares[prev], self.last_x, self.last_y);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  this.ready = new Promise(function(resolve, reject)
  {
        Promise.all([container.ready])
        .then(function() {
            console.log("PROMISE ALL IS READY");
            resolve();
        });        
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      
}//class 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = DistractorSquares;

}).catch(function importFailed(err){
    console.error("Import failed for distractorSquares.js: " + err);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

