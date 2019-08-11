/**
 * rich text Mime Renderer
 *
 * - renders scrollbar if document too big
 */
//'use strict';

px.import({
  scene: 'px:scene.1.js',
  scrollable: 'components/scrollable.js',
  richText: 'components/richText.js'
}).then(function importsAreReady(imports) {

  var scene = imports.scene;
  /**
   * Variables
   */
  var Scrollable = imports.scrollable.Scrollable;
  var RichText = imports.richText.RichText;

  /**
   * Private method to render rich text
   *
   * @param {String} richTextContent source of rich text
   */
  function renderRichText(richTextContent) {
    this.scrollable = new Scrollable(this.scene, this.container, {blank: this.options.args.from === 'richtext'});
    var mimeURL = px.getPackageBaseFilePath();
    this.instance = new RichText(this.scene, this.scrollable, {
      basePath: this.basePath,
      mimeURL: mimeURL,
    });    
    
    var is = this.instance;
    this.instance.prepare().then(() => {
      is.setSource(richTextContent);
      this.renderDefer.resolve(is);
    }).catch((err) => {
      console.error(err);
      is.setSource("<span> failed process rich text, " + JSON.stringify(err) + "</span>");
      this.renderDefer.reject(err);
    });
  }

  /**
   * rich tet Mime Renderer
   *
   * @param {Object} scene   scene
   * @param {Object} options regular object options
   */
  function RichTextMimeRenderer(scene, options) {
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
          .then((fileContent) => {
            renderRichText.call(this, fileContent ? fileContent.toString() : '');
          })
          .catch((err) => {
            console.log(err);
            console.log("get rich text failed ####" + url);
            renderRichText.call(this, "<span> Load rich text file failed </span>");
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
          if (this.instance) {
            // for now make rich text report the height not more than 500
            var h = this.options.args.from === 'richtext' ? this.instance.container.h : Math.min(this.instance.container.h, 500);
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
        }
      });
    });
    

    // apply options defined in constructor
    Object.keys(this.options).forEach((prop) => {
      this[prop] = this.options[prop];
    });
  }

  function createRenderer(scene, option) {
    return new RichTextMimeRenderer(scene, option);
  }

  var fileUrl = px.appQueryParams.url;
  var r = createRenderer(scene, {parent:scene.root, url:fileUrl, args:{from:''}})

  function updSize(w,h)
  {
    r.w = w
    r.h = h
  }

  scene.on("onResize", function(e) { updSize(e.w,e.h) })

  updSize(scene.w,scene.h)

}).catch(function importFailed(err){
  console.error("Import failed: " + err);
});
