/*

pxCore Copyright 2005-2018 John Robinson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Hugh Fitzpatrick

*/

function EqualizerSVG(scene, params)
{
    var root = scene.root;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // READY
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._ready = null;
    Object.defineProperty(this, "ready",
    {
        get: function ()    { return this._ready; },
    });

    if( scene.capabilities              == undefined ||
        scene.capabilities.graphics     == undefined ||
        scene.capabilities.graphics.svg == undefined)
    {
        this._ready = Promise.reject("Oh NO ... SVG is not supported in this build.");

        return this;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // ALPHA
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._a = (params && params.a) ? params.a : 0;
    Object.defineProperty(this, "a",
    {
        set: function (val) { this._a = val;  compObj.a = this._a; },
        get: function ()    { return this._a; },
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // POSITION
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._x = (params && params.x) ? params.x : 0;
    Object.defineProperty(this, "x",
    {
        set: function (val) { this._x = val;  compObj.x = this._x; },
        get: function ()    { return this._x; },
    });

    this._y = (params && params.y) ? params.y : 0;
    Object.defineProperty(this, "y",
    {
        set: function (val) { this._y = val;  compObj.y = this._y; },
        get: function ()    { return this._y; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // DIMENSION
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._w = (params && params.w) ? params.w : 800;
    Object.defineProperty(this, "w",
    {
        set: function (val) { this._w = val;  },
        get: function ()    { return this._w; },
    });
    this._h = (params && params.h) ? params.h : 200;
    Object.defineProperty(this, "h",
    {
        set: function (val) { this._h = val;  },
        get: function ()    { return this._h; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // ROWS & COLS
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._rows = (params && params.rows) ? params.rows : 10; // default
    Object.defineProperty(this, "rows",
    {
        set: function (val) { this._rows = val;  },
        get: function ()    { return this._rows; },
    });
    this._cols = (params && params.cols) ? params.cols : 40; // default
    Object.defineProperty(this, "cols",
    {
        set: function (val) { this._cols = val;  },
        get: function ()    { return this._cols; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // SPEED
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._t = (params && params.t) ? params.t : 140; // default
    Object.defineProperty(this, "t",
    {
        set: function (val) { this._t = val;  },
        get: function ()    { return this._t; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // GRID
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._grid = (params && params.grid) ? params.grid : 8; // default
    Object.defineProperty(this, "grid",
    {
        set: function (val) { this._grid = val;  },
        get: function ()    { return this._grid; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // BACKGROUND
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._bg = (params && params.bg) ? params.bg : "#111"; // default
    Object.defineProperty(this, "bg",
    {
        set: function (val) { this._bg = val;  },
        get: function ()    { return this._bg; },
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // GRADIENT STOPS
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    this._stops = (params && params.stops) ? params.stops : // defaults
    [
        { offset:   0, color: "#0f0"},
        { offset:  25, color: "#0f0"},
        { offset:  50, color: "#ff0"},
        { offset:  75, color: "#f80"},
        { offset: 100, color: "#f00"},
    ];

    Object.defineProperty(this, "stops",
    {
        set: function (val) { this._stops = val;  },
        get: function ()    { return this._stops; },
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    var timer          = null;
    var blocksObj      = null;
    var blackout       = [];
    var blackout_ready = [];

    var ww = this._w;  // WxH of the component
    var hh = this._h;

    var rows = this._rows;
    var cols = this._cols;

    var dx = this._w / cols;  // WxH of the cells
    var dy = this._h / rows;

    var gg = this._grid;      // Grid stroke width
    var bg = this._bg;        // Background color

    var color_stops = "";

    this._stops.map( (o) => {
        color_stops += '<stop offset=  "'+o.offset+'%" style="stop-color:'+o.color+'; "/>"';
    })

    // Gradient images  GREEN > YELLOW > ORANGE > RED
    var gradient =  'data:image/svg,' + '<svg>'+
                    '<defs> "'+
                    '<linearGradient id="gg" x1="0%" y1="100%" x2="0%" y2="0%"> "'+
                    color_stops +
                    '</linearGradient> "'+
                    '</defs>"'+
                    '<rect x="0" y="0" width="'+ww+'" height="'+hh+'" fill="url(#gg)"/>"'+
                    '</svg>"';

    // Construct 'grid' to overlay the gradient image
    var grid = 'data:image/svg,' + "<svg>";

    grid += "<g><path d = '";
    for(var i = 0; i <= cols; i++ )
    {
        grid += " M" + (i*dx) + ",0 V " + hh; // VERTICAL LINES
    }
    grid += "' stroke='"+bg+"' stroke-width='"+gg+"'/></g>";

    grid += "<g><path d = '";
    for(var j = 0; j <= rows; j++ )
    {
        grid += " M 0," + (j*dy) + " H " + ww; // HORIZONTAL LINES
    }
    grid += "' stroke='"+bg+"' stroke-width='"+gg+"'/></g>";

    grid += "</svg>";

    // Construct:   compImg <-- [ gradImg + gridImg ]
    //
    // Construct final image (equalImg) with (gradImg) gradient and (gridImg) "window frame" over top.
    var compObj = scene.create({ t: "object", parent: root,    w: ww, h: hh });
    var compImg = scene.create({ t: "rect",   parent: compObj, w: ww, h: hh, fillColor: bg });

    // Construct 'gradImg' with gradient image
    var gradRes = scene.create({ t: "imageResource", w: ww, h: hh, url: gradient });
    var gradImg = scene.create({ t: "image",  parent: compImg, resource: gradRes });

    // Construct 'gridImg' of "window frame" overlay.
    var gridRes = scene.create({ t: "imageResource", w: ww, h: hh, url: grid     });
    var gridImg = scene.create({ t: "image",  parent: compImg, resource: gridRes });

    var assets = [compImg.ready, gradRes.ready, gradImg.ready, gridRes.ready, gridImg.ready];

    var gradReady = Promise.all( assets ).then( function(o)
    {
        compImg.painting = false; // Create composite image
        gradImg.remove(); gradRes = gradImg = null; // ... dump the bits !
        gridImg.remove(); gridRes = gridImg = null; // ... dump the bits !

        assets = null;
    });

    // Create black rectangles to hide columns of 'equalImg'
    function createBlackout()
    {
        blocksObj = scene.create({ t: "object", parent: compObj, x:0, y:0, w: ww, h: hh, draw: false });
        for(var i = 0; i < cols; i++ )
        {
            blackout[i] = scene.create({ t: "rect", parent: blocksObj, x: (dx * i), dy: 0, w: dx, h: dy, fillColor: bg });
            blackout_ready.push( blackout[i].ready );
        }
        blocksObj.draw = true;
    }

    function randomInt(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Randomly size black rectangles to hide columns of 'equalImg' from top-down
    function updateEqualizer()
    {
        if(blocksObj != undefined)
        {
            blocksObj.draw = false;
            for(var i = 0; i < cols; i++ )
            {
                blackout[i].h = randomInt(1,rows - 1) * dy;
            }
            blocksObj.draw = true;
        }
    }

    createBlackout();

    blackout_ready.push(gradReady);
    this._ready = Promise.all(blackout_ready);

    // Public Methods
    this.start = function()
    {
        timer = setInterval(updateEqualizer, this._t);
    };

    this.stop = function()
    {
        if(timer)
        {
            clearInterval(timer);
            timer = null;
        }
    };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = EqualizerSVG;

