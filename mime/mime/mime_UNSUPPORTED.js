/**
 * Mime Renderer which renders message for unsupported types.
 */
'use strict';

/**
 * Styles
 */
var TEXT_SIZE        = 16;
var COLOR_TEXT       = 0xFF0000FF;

/**
 * Image Mime Renderer
 *
 * @param {Object} scene   scene
 * @param {Object} options regular image object options
 */
function UnsupportedMimeRenderer(scene, options) {
  this.scene = scene;
  this.options = options;

  this._url;

  this.fontRes = scene.create({
    t: 'fontResource',
    url: 'FreeSans.ttf'
  });

  this.textBox = scene.create({
    t: 'textBox',
    parent: options.parent,
    interactive: false,
    w: options.parent.w,
    h: options.parent.h,
    text: '',
    textColor: COLOR_TEXT,
    font: this.fontRes,
    pixelSize: TEXT_SIZE,
    wordWrap: true,
    alignHorizontal: scene.alignHorizontal.CENTER,
    alignVertical: scene.alignVertical.CENTER /* looks like this doesn't work */
  });

  // set url
  Object.defineProperty(this, 'url', {
    set: function(url) {
      this._url = url;

      var ext = url ? url.split('.').pop() : '';
      var textUnsupported = 'Unsupported file type' + (ext ? ': .' + ext : '');

      this.textBox.text = textUnsupported;
    },
    get: function() {
      return this._url;
    }
  });

  // set/get props to textBlock
  ['parent', 'x', 'y', 'w', 'h'].forEach((prop) => {
    Object.defineProperty(this, prop, {
      set: function (val) {
        this.textBox[prop] = val;
      },
      get: function () {
        return this.textBox[prop];
      },
    });
  });

  // ready
  Object.defineProperty(this, 'ready', {
    get: function () {
      return this.textBox.ready;
    },
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

  // resource
  ['resource'].forEach((prop) => {
    Object.defineProperty(this, prop, {
      get: function () {
        return {
          h: this.textBox.h,
          w: options.maxWidth || this.textBox.w,
        };
      },
    });
  });

  // apply options defined in constructor
  Object.keys(this.options).forEach((prop) => {
    this[prop] = this.options[prop];
  });
}

function createRenderer(scene, option) {
  return new UnsupportedMimeRenderer(scene, option);
}

module.exports.UnsupportedMimeRenderer = UnsupportedMimeRenderer;
module.exports.createRenderer = createRenderer;
