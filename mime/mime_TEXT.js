"use strict";
px.import({
  scene: 'px:scene.1.js',
  scrollable: 'components/scrollable.js',
  style: 'components/text.style.js',
  keys: 'px:tools.keys.js'}
).then( function ready(imports)
{
  var CONSOLE_VERSION = "1.0";

  var scene = imports.scene;
  var Scrollable = imports.scrollable.Scrollable;
  var style            = imports.style;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  var TEXT_SIZE        = style.textSize;
  var COLOR_TEXT       = style.textColor;
  var COLOR_BACKGROUND = style.backgroundColor;

  var marginTop = style.marginTop;
  var marginBottom = style.marginBottom;
  var marginLeft = style.marginLeft;
  var marginRight = style.marginRight;

  var historyMax = style.historyMax; // lines

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var fontRes = scene.create({t:"fontResource",url:"FreeSans.ttf"});


  /**
   * Variables
   */
  var Scrollable = imports.scrollable.Scrollable;

  /**
   * Private method to render text
   *
   * @param {String} text source of text content
   */
  function renderText(text) {

    var isNest = this.options.args.from === 'markdown';
    marginLeft = isNest ? style.marginLeftForNest : style.marginLeft; // update margin left
    this.scrollable = new Scrollable(this.scene, this.container, {blank: isNest});
    this.scrollable.container.fillColor = COLOR_BACKGROUND;

    this.consoleTxt = scene.create({
      t: "textBox" ,
      parent: this.scrollable.root,   
      interactive: false, 
      x: marginLeft,
      y:  marginTop, 
      w: this.scrollable.getContentWidth() - marginLeft - marginRight,                          
      text: "", 
      textColor: COLOR_TEXT, 
      font: fontRes, 
      pixelSize: TEXT_SIZE, 
      wordWrap: true, 
      lignHorizontal: scene.alignHorizontal.LEFT,
      alignVertical: scene.alignVertical.TOP
    });
    var that = this;
    function appendLog(txt)
    {
      txt = txt + ""; // NB: Force to string

      var lines = txt.split("\n"); // process multi-line output...

      // Add lines to history
      for(var l = 0; l < lines.length; l++)
      {
        if(that.history.length > historyMax)
        {
          that.history.shift();                // remove from HEAD
        }
        that.history.push( lines[l] + "\n" );  // append at   TAIL
      }

      // Assemble new string
      var txt = "";
      for(var h = 0; h < that.history.length; h++)
      {
        txt += that.history[h];
      }

      // Update the Console text ....
      that.consoleTxt.text = txt;
    }

    appendLog(text);
    updateSize.call(this);
    this.renderDefer.resolve(this.consoleTxt);
  }

  function updateSize() {
    this.consoleTxt.w = this.scrollable.getContentWidth() - marginLeft - marginRight;
    var measure = this.consoleTxt.measureText();
    this.scrollable.root.h = measure.bounds.y2 + marginTop + marginBottom;
    this.scrollable.update();
  }

  /**
   * Markdown Text Renderer
   *
   * @param {Object} scene   scene
   * @param {Object} options regular object options
   */
  function MarkdownTextRenderer(scene, options) {
    this.scene = scene;
    this.options = options;

    this._url;
    this.basePath;
    this.scrollable;
    this.consoleTxt;
    this.history    = [];

    this.renderDefer = Promise.defer();
    this.renderReady = this.renderDefer.promise;

    this.container = scene.create({
      t: "object",
      parent: options.parent,
      interactive: true,
      w: options.maxWidth || options.parent.w,
      h: options.parent.h,
      draw: true,
      clip: true,
    });

    // set url
    Object.defineProperty(this, 'url', {
      set: function(url) {
        this._url = url;
        this.renderDefer = Promise.defer();
        this.renderReady = this.renderDefer.promise;

        console.log('start to fetch txt file ' + url);
        px.getFile(url)
          .then((text) => {
            renderText.call(this, text);
          })
          .catch((err) => {
            console.log(err);
            renderText.call(this, "#### Load txt file failed from " + url);
          });
      }
    });

    // ready
    Object.defineProperty(this, 'ready', {
      get: function () {
        return this.renderReady;
      },
    });

    // read/write props for both container and renderer
    ['w', 'h'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        set: function (val) {
          this.container[prop] = val
          updateSize.call(this);
        },
        get: function () {
          return this.container[prop];
        },
      });
    });

    // this props we set/get only to container
    ['parent', 'x', 'y'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        set: function (val) {
          this.container[prop] = val;
        },
        get: function () {
          return this.container[prop];
        },
      });
    });

    // resource
    ['resource'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        get: function () {
          if (this.consoleTxt) {
            var totalH = this.scrollable.root.h;
            // for now make markdown report the height not more than 500
            var h = this.options.args.from === 'markdown' ? totalH : Math.min(totalH, 500);
            return {
              h: h,
              w: options.maxWidth || this.container.w,
            };
          }
        },
      });
    });

    // read/write options
    ['maxWidth'].forEach((prop) => {
      Object.defineProperty(this, prop, {
        get: function () {
          return options[prop];
        },
        set: function (val) {
          options[prop] = val;
        },
      });
    });

    // apply options defined in constructor
    Object.keys(this.options).forEach((prop) => {
      this[prop] = this.options[prop];
    });
  }

  function createRenderer(scene, option) {
    return new MarkdownTextRenderer(scene, option);
  }

  module.exports.MarkdownTextRenderer = MarkdownTextRenderer;
  module.exports.createRenderer = createRenderer;
}).catch( function importFailed(err){
  console.log("err: " + err);
  console.error("Import for mime_TEXT.js failed: " + err)
});