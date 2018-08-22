/**
 * Image Mime Renderer
 *
 * It centers image in the parent object.
 */
'use strict';

/**
 * Image Mime Renderer
 *
 * @param {Object} scene   scene
 * @param {Object} options regular image object options
 */
function ImageMimeRenderer(scene, options) {
  this.scene = scene;
  this.options = options;

  this.img = scene.create(Object.assign({
    t: 'image',
    stretchX: scene.stretch.STRETCH,
    stretchY: scene.stretch.STRETCH,
    smoothDownscale: true,
    h: 0,
    w: 0
  }, options));

  // read/write props
  ['x', 'y', 'w', 'h'].forEach((prop) => {
    Object.defineProperty(this, prop, {
      set: function(val) {
        this.img[prop] = val;

        // if sizes are set from outside, reset position
        if (prop === 'w') {
          this.img.x = 0;
        }

        if (prop === 'h') {
          this.img.y = 0;
        }
      },
      get: function () {
        return this.img[prop];
      },
    });
  });

  // read-only props
  ['resource', 'ready'].forEach((prop) => {
    Object.defineProperty(this, prop, {
      get: function () {
        return this.img[prop];
      },
    });
  });

  // bind event listeners to the object
  this.fitParent = this.fitParent.bind(this);

  this.img.ready.then(() => {
    this.fitParent();
  });
  this.scene.on('onResize', this.fitParent);
}

ImageMimeRenderer.prototype.fitParent = function() {
  if (!this.img.resource || !this.options.parent) {
    return;
  }
  var w = Math.min(this.img.resource.w, this.options.parent.w);
  var h = Math.min(this.img.resource.h, this.options.parent.h);
  var containerAr = this.options.parent.w / this.options.parent.h;
  var ar = this.img.resource.w / this.img.resource.h;

  // fit width & height
  if (containerAr > ar) {
    this.img.h = h;
    this.img.w = h * ar;
  } else {
    this.img.w = w;
    this.img.h = w / ar;
  }

  // center image
  this.y = (this.options.parent.h - this.img.h) / 2;
  this.x = (this.options.parent.w - this.img.w) / 2;
}

function createRenderer(scene, option) {
  return new ImageMimeRenderer(scene, option);
}

module.exports.ImageMimeRenderer = ImageMimeRenderer;
module.exports.createRenderer = createRenderer;
