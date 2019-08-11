px.import({
  style: 'richText.style.js',
  utils: 'utils.js',
  keys: 'px:tools.keys.js',
  richTextLib: 'richTextLib.js',
  combinatorics: 'combinatorics.js',
}).then(function importsAreReady(imports) {

  var style = imports.style;
  var keys = imports.keys;
  var _eventEmitter = imports.utils._eventEmitter;
  var merge = imports.utils.merge;
  var htmlparser2 = imports.richTextLib.htmlparser2;
  var color = imports.richTextLib.color;
  var css = imports.richTextLib.css;
  var combinatorics = imports.combinatorics;

  var defaults = {
    decodeEntities: true
  }

  /**
   * css properties to spark object properties
   */
  var cssToSparkPropertiesMap = {
    color: true,   //color
    opacity: true, //opacity
    'font-size': true, //font size
    'font-family': true, // font face
    'font-weight': true, // bold
    'font-style': true,  // italic
    'text-decoration': true, //underline
  };

  /**
   * RichText renderer engine
   * @param {*} options the engine options
   */
  function RTEngine(options) {
    this.options = options;
    this.externalCssMap = {};
    this.innerCssMap = {};
    this.inlineCssMap = {};
    this.parsedNodeArr = [];
    this.parsingNode = {};
    this.htmlParsed = false;
    this.cssDirty = false;


    var classStack = [];
    var parsingNode = {};
    var that = this;
    var previousTag = null;
    this.parser = new htmlparser2.Parser({
      onopentag: function (name, attribs) {
        if (name === 'link' && attribs['rel'] === 'stylesheet') {
          that.readExternalCss(attribs['href'])
        }
        parsingNode.name = name;
        classStack.push(that.getClassFromAttrib(attribs['class']));
      },
      ontext: function (text) {
        if (!text) {
          return;
        }
        parsingNode.text = text;
        if (!that.isIgnoredText(parsingNode.name)) {
          that.parsedNodeArr.push({ type: 'text', text: parsingNode.text, class: that.contactClass(classStack) });
        }
      },
      onclosetag: function (name) {
        if (parsingNode.name === 'style') {
          that.readCss(parsingNode.text, that.innerCssMap);
        }
        if (name === 'br') {
          that.parsedNodeArr.push({ type: 'br' })
        }
        parsingNode = {};
        previousTag = name;
        classStack.pop();
      },
      onend: function () {
        that.htmlParsed = true;
        that.render();
      }
    }, defaults);

    var addtionalCssFiles = options.addtionalCssFiles || [];
    addtionalCssFiles.forEach(file => {
      this.readExternalCss(file);
    })
  }


  /**
   * read external css file
   * @param file the css file path
   */
  RTEngine.prototype.readExternalCss = function (file) {
    var url = this.options.basePath + file;
    if (file.indexOf('http://') >= 0 || file.indexOf('https://') >= 0) {
      url = file;
    }
    px.getFile(this.options.basePath + file).then((cssContent) => {
      this.readCss(cssContent ? cssContent.toString() : '', this.externalCssMap);
      console.log('external css ' + file + ' inject successful');
    })
      .catch((err) => {
        console.error(err);
        console.error("fetch " + url + " failed");
      });
  };

  /**
   * parse string css to engine css map
   * @param cssStr the css string content
   * @param cssMap the engine css map
   */
  RTEngine.prototype.readCss = function (cssStr, cssMap) {
    if (!cssStr) {
      return;
    }
    var cssBody = css.parse(cssStr) || {};
    var rules = ((cssBody['stylesheet'] || {}).rules) || [];
    for (var i = 0; i < rules.length; i++) {
      var selectors = rules[i].selectors || [];
      var declarations = rules[i].declarations || [];
      var cssObj = {};
      for (var j = 0; j < declarations.length; j++) {
        var item = declarations[j];
        var property = item.property;
        if (cssToSparkPropertiesMap[property]) {
          cssObj[property] = item.value;
          if (property.indexOf('color') >= 0) {
            cssObj[property] = color(item.value);
          }
        }
      }
      for (var j = 0; j < selectors.length; j++) {
        var selector = selectors[j];
        cssMap[selector] = cssMap[selector] || {};
        merge(cssMap[selector], cssObj);
      }
    }

    this.cssDirty = true;
    this.options.emitter.emit('onContainerResize'); // css reload
  }


  /**
   * conver css to spark properties
   * @param classes the css classes name
   */
  RTEngine.prototype.getSparkProperties = function (classes) {


    var convertCssToSpark = (css) => {
      var defaultFontSize = this.options.styles.defaultFontSize;
      var defaultFontColor = this.options.styles.defaultFontColor;

      var fontName = 'OpenSans';
      var spark = { pixelSize: defaultFontSize, textColor: defaultFontColor }
      if (css['font-size']) {
        var strSize = css['font-size'];
        var size = parseFloat(strSize.substr(0, strSize.length - 2));
        var pixelSize = defaultFontSize
        if (strSize.indexOf('em') >= 0) {
          pixelSize = size * pixelSize;
        } else if (strSize.indexOf("px") >= 0) {
          pixelSize = size
        }
        spark.pixelSize = pixelSize;
      }


      if (css['font-family']) {
        fontName = css['font-family'];
      }
      var isBold = css['font-weight'] === 'bold';
      var isItalic = css['font-style'] === 'italic';
      var suffix = 'REGULAR';
      if (isBold && isItalic) {
        suffix = 'BOLD_ITALIC'
      } else if (isBold) {
        suffix = 'BOLD'
      } else if (isItalic) {
        suffix = 'ITALIC'
      }

      spark.font = this.options.FONT_STYLE[fontName + '-' + suffix];

      var opacity = 255;
      if (css['opacity']) {
        opacity = Math.floor(255 * parseFloat(css['opacity']));
      }

      if (css['color']) {
        var c = css['color'];
        spark.textColor = (c.red() << 24) | (c.green() << 16) | (c.blue() << 8) | opacity;
      }

      if (css['text-decoration'] === 'underline') {
        spark.underline = true
        spark.underlineColor = spark.textColor;
      }
      return spark;
    }

    var css = {};
    var allClasses = combinatorics.power(classes)
    allClasses.forEach((selectors) => {
      if (!selectors || selectors.length <= 0) {
        return;
      }
      var cssName = '';
      selectors.forEach((selector) => {
        cssName = cssName + '.' + selector;
      })
      merge(css, this.externalCssMap[cssName], this.innerCssMap[cssName]);
    })

    return convertCssToSpark(css);
  };


  /**
   * render text block
   * @param inlineBlocks the inline blocks
   * @param offsetLeft the offset left position
   * @param width the container width
   */
  RTEngine.prototype.renderTextBlockWithStyle = function (inlineBlocks, offsetLeft, width) {

    if (inlineBlocks.length <= 0) {
      return null;
    }
    var isAllEmpty = true;
    inlineBlocks.forEach(item => {
      if (item.text.trim().length > 0) {
        isAllEmpty = false;
      }
    });

    var options = this.options;
    var scene = options.scene;
    var that = this;
    offsetLeft = offsetLeft || 0;

    var container = scene.create({
      t: "object",
      parent: options.parent,
      interactive: false,
      x: 0,
      y: 0,
      w: width || (options.parent.w - offsetLeft),
    });
    container.resizeable = true;

    function copy(inlineBlock) {
      // for falsy values just return the same value
      if (!inlineBlock) {
        return inlineBlock;
      }

      var newStyle = {};
      if (that.cssDirty) {
        newStyle = that.getSparkProperties(inlineBlock.classes || []);
        merge(inlineBlock, newStyle);
      }

      var inlineBlockCopy = scene.create({
        t: 'text',
        interactive: false,
        x: inlineBlock.x,
        y: inlineBlock.y,
        text: inlineBlock.text,
        textColor: inlineBlock.textColor,
        font: inlineBlock.font,
        pixelSize: inlineBlock.pixelSize,
      });

      inlineBlockCopy.underline = inlineBlock.underline;
      inlineBlockCopy.underlineColor = inlineBlock.underlineColor;

      return inlineBlockCopy;
    }

    function renderInlineBlocks() {
      container.removeAll();

      var x = 0;
      var y = 0;

      var inlineBlock;
      var someBlock;
      var blocksToRender = inlineBlocks.slice();
      var lineBlocks = [];

      function getLineHeight() {
        var heights = lineBlocks.map((block) => block.h);
        var maxHeight = Math.max(Math.max.apply(null, heights), 0);
        return maxHeight;
      }

      function updateLineBlocksHeights(lineHeight) {
        lineBlocks.forEach((block) => {
          var lineHeightDiff = lineHeight - block.h;
          block.y = block.y + lineHeightDiff;
        });
      }

      function newLine() {
        var lineHeight = getLineHeight();

        updateLineBlocksHeights(lineHeight);
        // that.textSelector.pushBlocks(lineBlocks);
        lineBlocks = [];

        x = 0;
        y += lineHeight;
      }

      var timestamp = Date.now();
      while (someBlock = blocksToRender.shift()) {
        someBlock.timestamp = timestamp;
        if (typeof someBlock.text === 'undefined') {
          if (x + someBlock.w > container.w && x !== 0) {
            newLine();
            // put block back to the list, to draw on the new line
            blocksToRender.unshift(someBlock);
          } else {
            someBlock.x = x;
            someBlock.y = y;
            someBlock.parent = container;

            x += someBlock.w;
            lineBlocks.push(someBlock);
          }
          continue;
        }

        var inlineBlock = copy(someBlock);

        var currentBlockWords = inlineBlock.text.split(' ');
        var newBlockWords = [];


        // if a word length greater than conatiner.w, and cannot split by space
        if (currentBlockWords.length <= 1 && x + inlineBlock.w > container.w) {
          var newWord = '';
          while (x + inlineBlock.w > container.w) {
            newWord = inlineBlock.text.substring(inlineBlock.text.length - 1) + newWord;
            inlineBlock.text = inlineBlock.text.substring(0, inlineBlock.text.length - 1);
          }
          newBlockWords = [newWord];
        }

        while (x + inlineBlock.w > container.w && currentBlockWords.length > 0) {
          newBlockWords.unshift(currentBlockWords.pop());
          inlineBlock.text = currentBlockWords.join(' ');
        }

        // if even one word cannot be rendered on the new line, then render it anyway
        if (currentBlockWords.length === 0 && x === 0) {
          inlineBlock.text = newBlockWords.shift();
        }

        // render block
        inlineBlock.x = x;
        inlineBlock.y = y;
        inlineBlock.parent = container;
        inlineBlock.textId = that.textIndex++;
        lineBlocks.push(inlineBlock);


        if (inlineBlock.underline) { // draw a under line
          scene.create({
            t: 'rect',
            h: options.styles.underline.height,
            fillColor: inlineBlock.underlineColor,
            w: inlineBlock.w,
            interactive: false,
            parent: inlineBlock,
            x: 0,
            y: inlineBlock.h - 1,
          });
        }

        // updateLinkClickObj(inlineBlock);
        // create same style block with the words which don't fit the line
        if (newBlockWords.length > 0) {
          var newInlineBlock = copy(inlineBlock);

          newInlineBlock.text = newBlockWords.join(' ');

          blocksToRender.unshift(newInlineBlock);

          newLine();
        } else {
          x += inlineBlock.w;

          if (x > container.w) {
            newLine();
          }
        }
      }

      var lastLineHeight = getLineHeight();
      updateLineBlocksHeights(lastLineHeight);

      container.h = y
        + lastLineHeight
        + (style.marginBottom || 0);
    }

    this.options.emitter.on('onContainerResize', function () {
      if (!container.resizeable) {
        return;
      }
      container.w = options.parent.w - offsetLeft;
      renderInlineBlocks();
    });
    renderInlineBlocks();

    return container;
  }

  /**
   * render single inline text
   * @param text the text
   * @param style the spark style
   * @param classes the css classes
   */
  RTEngine.prototype.renderInlineTextWithStyle = function (text, style, classes) {
    var scene = this.options.scene;
    var textInlineStyle = merge({}, style, {
      t: 'text',
      text: text,
      font: style.font,
    });
    var textInline = scene.create(textInlineStyle);
    textInline.classes = classes;
    return textInline;
  }

  RTEngine.prototype.newLine = function () {
    var options = this.options;
    return options.scene.create({
      t: 'rect',
      x: 0,
      y: 0,
      parent: options.parent,
      h: options.styles.blankLineHeight,
    });
  }

  /**
   * render function
   */
  RTEngine.prototype.render = function () {
    var options = this.options;
    var out = [];
    var inlineBlocks = [];
    for (var nodeIndex = 0; nodeIndex < this.parsedNodeArr.length; nodeIndex++) {
      var node = this.parsedNodeArr[nodeIndex];
      if (node.type === 'br') {
        out.push(this.renderTextBlockWithStyle(inlineBlocks));
        inlineBlocks = [];
        out.push(this.newLine());
        continue;
      }
      var nodeClass = node.class || [];
      var style = this.getSparkProperties(nodeClass);
      var strArr = node.text.split('\n');
      // console.log(">>>>",node.text);
      if (strArr.length > 1) {
        strArr.forEach(text => {
          if (text) {
            inlineBlocks.push(this.renderInlineTextWithStyle(text, style, nodeClass));
          } else {
            out.push(this.renderTextBlockWithStyle(inlineBlocks));
            inlineBlocks = [];
          }
        });
      } else {
        inlineBlocks.push(this.renderInlineTextWithStyle(node.text, style, nodeClass));
      }
    }

    if (inlineBlocks.length > 0) {
      out.push(this.renderTextBlockWithStyle(inlineBlocks))
    }

    function updateSize() {
      var y = 0;
      out.forEach(function (block) {
        if (!block) {
          return;
        }
        block.y = y;
        y += block.h;
      });
      options.parent.h = y;
      options.richText.updateParent(); // update parent
    }


    options.emitter.on('onContainerResize', () => {
      updateSize();
      this.cssDirty = false;
    });

    updateSize();
  };


  /**
   * get class name from html attributes
   * @param classStr the class string, maybe combine in ,
   */
  RTEngine.prototype.getClassFromAttrib = function (classStr) {
    var classes = (classStr || '').split(' ');
    var result = [];
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].trim().length > 0) {
        result.push(classes[i].trim());
      }
    }
    return result;
  };

  /**
   * contact class to in single array
   * @param stack the css stack
   */
  RTEngine.prototype.contactClass = function (stack) {
    var result = [];
    for (var i = 0; i < stack.length; i++) {
      for (var j = 0; j < stack[i].length; j++) {
        result.push(stack[i][j]);
      }
    }
    return result;
  };

  /**
   * is need ignore for this tag ?
   * @param name the tag name
   */
  RTEngine.prototype.isIgnoredText = function (name) {
    return name === 'style' || name === 'link';
  };

  /**
   * the rich text adapter for spark to rt engine
   * @param {*} scene the spark scene
   * @param {*} parent the scrollbar container
   * @param {*} options the options
   */
  function RichText(scene, parent, options) {
    this.scene = scene;
    this.parent = parent;
    this.options = options;

    this.source = null;

    this.emitter = new _eventEmitter()

    this.prepareStyle(style, this.options.mimeURL || '');

    this.container = scene.create({
      t: 'object',
      x: this.options.styles.container.paddingLeft || 0,
      y: this.options.styles.container.paddingTop || 0,
      parent: this.getParentRoot(),
      interactive: false,
      w: parent.root.w
        - (this.options.styles.container.paddingLeft || 0)
        - (this.options.styles.container.paddingRight || 0),
      h: parent.root.h
        - (this.options.styles.container.paddingTop || 0)
        - (this.options.styles.container.paddingBottom || 0),
    });

    var that = this;
    this.scene.on('onResize', function () {
      that.update()
    })
  }

  /**
   * get parent root
   */
  RichText.prototype.getParentRoot = function () {
    return this.parent.root ? this.parent.root : this.parent;
  }

  /**
   * copy style from theme to engine
   */
  RichText.prototype.prepareStyle = function (style, baseURL) {
    this.options.fonts = style.fonts;
    this.options.styles = merge({}, style.styles);
    this.options.FONT_STYLE = {};
  }

  /**
   * set rich text content
   */
  RichText.prototype.setSource = function (source) {
    this.source = source;
    this.render();
  }

  /**
   * update
   */
  RichText.prototype.update = function () {
    var parentRoot = this.getParentRoot();

    this.container.w = parentRoot.w
      - (this.options.styles.container.paddingLeft || 0)
      - (this.options.styles.container.paddingRight || 0);
    this.emitter.emit('onContainerResize');
  }

  /**
   * render, parse rich text
   */
  RichText.prototype.render = function () {
    var opt = merge({}, defaults, {
      basePath: this.options.basePath,
      scene: this.scene,
      parent: this.container,
      emitter: this.emitter,
      FONT_STYLE: this.options.FONT_STYLE,
      styles: this.options.styles,
      mimeBaseURL: this.options.mimeURL || '',
      addtionalCssFiles: this.options.addtionalCssFiles || [],
      richText: this,
    });

    this.rTEngine = new RTEngine(opt);
    this.rTEngine.parser.write(this.source);
    this.rTEngine.parser.end();
  }

  /**
   * update parent height, and notify parent update
   */
  RichText.prototype.updateParent = function () {
    this.getParentRoot().h = this.container.h
      + (this.options.styles.container.paddingTop || 0)
      + (this.options.styles.container.paddingBottom || 0);

    this.parent.update && this.parent.update();
  }

  /**
   * load fonts
   */
  RichText.prototype.prepare = function () {
    var fontsResources = [];
    var fonts = Object.keys(this.options.fonts);
    var scene = this.scene;
    var fontKeys = [];
    fonts.forEach((k) => {
      var font = this.options.fonts[k];
      var styles = Object.keys(font)
      styles.forEach((fontName) => {
        fontsResources.push(scene.create({
          t: 'fontResource',
          url: this.options.mimeURL + "/" + font[fontName]
        }).ready);
        fontKeys.push(k + '-' + fontName);
      });
    });

    var that = this;
    // clear old node
    var children = scene.root.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].markAsDelete === true) {
        children[i].remove()
      }
    }

    return Promise.all(fontsResources).then(function (resources) {
      for (var i = 0; i < fontKeys.length; i++) {
        that.options.FONT_STYLE[fontKeys[i]] = resources[i];
        console.log("font " + resources[i].url + " loaded, key=" + fontKeys[i])
      }
      return Promise.resolve(that);
    });
  }

  module.exports.RichText = RichText;
}).catch(function importFailed(err) {
  console.error("Import failed: " + err);
});