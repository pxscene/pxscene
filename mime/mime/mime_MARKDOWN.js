/**
 * Markdown Mime Renderer
 *
 * - renders scrollbar if document too big
 */
'use strict';

px.import({
  scrollable: 'components/scrollable.js',
  markdown: 'components/markdown.js',
}).then(function importsAreReady(imports) {
  /**
   * Variables
   */
  var Scrollable = imports.scrollable.Scrollable;
  var Markdown = imports.markdown.Markdown;

  /**
   * Private method to render markdown
   *
   * @param {String} markdownSource source of markdown
   */
  function renderMarkdown(markdownSource) {
    this.scrollable = new Scrollable(this.scene, this.container, {blank: this.options.args.from === 'markdown'});

    var mimeURL = this.options.mimeType.url.split('/');
    mimeURL.pop();
    this.markdown = new Markdown(this.scene, this.scrollable, {
      basePath: this.basePath,
      mimeURL: mimeURL.join('/') + '/',
    });
    
    var md = this.markdown;
    this.markdown.prepare().then(() => {
      md.setSource(markdownSource);
      this.renderDefer.resolve(md);
    }).catch((err) => {
      console.error(err);
      md.setSource("#### failed process markdown, " + JSON.stringify(err));
      this.renderDefer.reject(err);
    });
  }

  /**
   * Markdown Mime Renderer
   *
   * @param {Object} scene   scene
   * @param {Object} options regular object options
   */
  function MarkdownMimeRenderer(scene, options) {
    this.scene = scene;
    this.options = options;

    this._url;
    this.basePath;
    this.scrollable;
    this.markdown;

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
        var separatorMatch = url.match(/[\\\/]{1}/);
        var separator = separatorMatch ? separatorMatch[0] : '/';
        this.basePath = url.split(separator).slice(0, -1).join(separator) + separator;

        this.renderDefer = Promise.defer();
        this.renderReady = this.renderDefer.promise;

        px.getFile(url)
          .then((markdownSource) => {
            renderMarkdown.call(this, markdownSource);
          })
          .catch((err) => {
            console.log(err);
            console.log("get Markdown failed ####" + url);
            renderMarkdown.call(this, "#### Load markdown file failed");
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
          this.container[prop] = val;

          if (this.scrollable) {
            this.scrollable.update();
          }
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
          if (this.markdown) {
            // for now make markdown report the height not more than 500
            var h = this.options.args.from === 'markdown' ? this.markdown.container.h : Math.min(this.markdown.container.h, 500);
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
    return new MarkdownMimeRenderer(scene, option);
  }

  module.exports.MarkdownMimeRenderer = MarkdownMimeRenderer;
  module.exports.createRenderer = createRenderer;

}).catch(function importFailed(err){
  console.error("Import failed: " + err);
});
