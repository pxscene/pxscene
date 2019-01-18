/**
 * Renders markdown by source
 *
 * The code is based on markit (https://github.com/lepture/markit)
 * So the original code can be used to extend functionality of the current implementation
 * which was cut to set of supported functions:
 * - Emphasis
 * - Ordered lists
 * - Unordered lists
 * - Headers
 * - Images (using the MIME dispatcher)
 * - Blockquotes
 * - Inline/block code (without coloring)
 *
 * The implementation has several sections:
 * - `block` - is keept as it is the full support of markdown
 * - `Lexer` - is limited to supported functions only
 * - `inline`- is keept as it is the full support of markdown
 * - `InlineLexer` - is limited to supported functions only
 * - `Renderer` - is limited to supported functions only
 * - `Parser`   - is limited to supported functions only
 */
px.import({
  style: 'markdown.style.js',
  TextSelector: 'textSelector.js',
  keys: 'px:tools.keys.js'
}).then(function importsAreReady(imports) {

  var style = imports.style;
  var keys = imports.keys;
  var TextSelector = imports.TextSelector;

  /**
   * Block-Level Grammar
   */

  function _eventEmitter() {
    this.handlers = {}
    this.on = function(eventName, eventHandler) {
      if (!this.handlers[eventName])
        this.handlers[eventName] = []
      this.handlers[eventName].push(eventHandler)
    }
    this.emit = function(eventName) {
      console.log('firing event: ', eventName)
      var handlerz = this.handlers[eventName]
      if (handlerz) {
        for (var h of handlerz) {
          h()
        }
      }
    }
  }

  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: noop,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *( {1}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
    def: /^ *\[([^^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    footnote: noop,
    table: noop,
    paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
    text: /^[^\n]+/
  };

  block.bullet = /(?:[*+-]|\d+\.)/;
  block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
  block.item = replace(block.item, 'gm')
    (/bull/g, block.bullet)
    ();

  block.list = replace(block.list)
    (/bull/g, block.bullet)
    ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
    ();

  block._tag = '(?!(?:'
    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
    + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
    + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

  block.html = replace(block.html)
    ('comment', /<!--[\s\S]*?-->/)
    ('closed', /<(tag)[\s\S]+?<\/\1>/)
    ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
    (/tag/g, block._tag)
    ();

  block.paragraph = replace(block.paragraph)
    ('hr', block.hr)
    ('heading', block.heading)
    ('lheading', block.lheading)
    ('blockquote', block.blockquote)
    ('tag', '<' + block._tag)
    ('def', block.def)
    ();

  var urlDetectRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
  /**
   * Normal Block Grammar
   */

  block.normal = merge({}, block);

  /**
   * GFM Block Grammar
   */

  block.gfm = merge({}, block.normal, {
    fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/
  });
  block.gfm.paragraph = replace(block.paragraph)
    ('(?!', '(?!'
      + block.gfm.fences.source.replace('\\1', '\\2') + '|'
      + block.list.source.replace('\\1', '\\3') + '|')
    ();

  /**
   * Tables Block Grammar
   */

  block.tables = {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
  };

  /**
   * Footnotes Block Grammar
   */
  block.footnotes = {
    footnote: /^\[(\^[^\]]+)\]: *([^\n]*(?:\n [^\n]*)*)/,
  };
  block.footnotes.normal = {
    footnote: block.footnotes.footnote
  };
  block.footnotes.normal.paragraph = replace(block.paragraph)(
    '))+)', '|' + block.footnotes.footnote.source + '))+)'
  )();
  block.footnotes.gfm = {
    footnote: block.footnotes.footnote
  };
  block.footnotes.gfm.paragraph = replace(block.gfm.paragraph)(
    '))+)', '|' + block.footnotes.footnote.source + '))+)'
  )();

  /**
   * Block Lexer
   */

  function Lexer(options) {
    this.tokens = [];
    this.tokens.links = {};
    this.tokens.footnotes = [];
    this.options = options || marked.defaults;
    this.rules = block.normal;

    if (this.options.gfm) {
      this.rules = block.gfm;
    }
    if (this.options.tables) {
      this.rules = merge({}, this.rules, block.tables);
    }
  }

  /**
   * Expose Block Rules
   */

  Lexer.rules = block;

  /**
   * Static Lex Method
   */

  Lexer.lex = function(src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
  };

  /**
   * Preprocessing
   */

  Lexer.prototype.lex = function(src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n');

    return this.token(src, true);
  };

  /**
   * Lexing
   */

  Lexer.prototype.token = function(src, top) {
    var src = src.replace(/^ +$/gm, '')
      , next
      , loose
      , cap
      , bull
      , b
      , item
      , space
      , i
      , l;

    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          });
        }
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        cap = cap[0].replace(/^ {4}/gm, '');
        this.tokens.push({
          type: 'code',
          text: !this.options.pedantic
            ? cap.replace(/\n+$/, '')
            : cap
        });
        continue;
      }

      // fences (gfm)
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2],
          text: cap[3]
        });
        continue;
      }

      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[3]
        });
        continue;
      }

      // table no leading pipe (gfm)
      if (top && (cap = this.rules.nptable.exec(src))) {
        src = src.substring(cap[0].length);

        item = {
          type: 'table',
          header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3].replace(/\n$/, '').split('\n')
        };

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = item.cells[i].split(/ *\| */);
        }

        this.tokens.push(item);

        continue;
      }

      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2] === '=' ? 1 : 2,
          text: cap[1]
        });
        continue;
      }

      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);

        this.tokens.push({
          type: 'blockquote_start'
        });

        cap = cap[0].replace(/^ *> ?/gm, '');

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);

        this.tokens.push({
          type: 'blockquote_end'
        });

        continue;
      }

      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];

        this.tokens.push({
          type: 'list_start',
          ordered: bull.length > 1
        });

        // Get each top-level item.
        cap = cap[0].match(this.rules.item);

        next = false;
        l = cap.length;
        i = 0;

        for (; i < l; i++) {
          item = cap[i];

          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) +/, '');

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '');
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (this.options.smartLists && i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0];
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }

          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) loose = next;
          }

          this.tokens.push({
            type: loose
              ? 'loose_item_start'
              : 'list_item_start'
          });

          // Recurse.
          this.token(item, false);

          this.tokens.push({
            type: 'list_item_end'
          });
        }

        this.tokens.push({
          type: 'list_end'
        });

        continue;
      }

      // table (gfm)
      if (top && (cap = this.rules.table.exec(src))) {
        src = src.substring(cap[0].length);

        item = {
          type: 'table',
          header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
        };

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = item.cells[i]
            .replace(/^ *\| *| *\| *$/g, '')
            .split(/ *\| */);
        }

        this.tokens.push(item);

        continue;
      }

      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1]
        });
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0]
        });
        continue;
      }

      if (src) {
        throw new
          Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return this.tokens;
  };

  /**
   * Inline-Level Grammar
   */

  var inline = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: noop,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
    strong: /^\*\*([\s\S]+?)\*\*(?!\*)/,
    underline: /^__([\s\S]+?)__(?!_)/,
    em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: noop,
    footnote: noop,
    text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
  };

  inline._inside = /(?:\[[^^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
  inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

  inline.link = replace(inline.link)
    ('inside', inline._inside)
    ('href', inline._href)
    ();

  inline.reflink = replace(inline.reflink)
    ('inside', inline._inside)
    ();

  /**
   * Normal Inline Grammar
   */

  inline.normal = merge({}, inline);

  /**
   * Pedantic Inline Grammar
   */

  inline.pedantic = {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
  };

  /**
   * GFM Inline Grammar
   */

  inline.gfm = merge({}, inline.normal, {
    escape: replace(inline.escape)('])', '~|])')(),
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: replace(inline.text)
      (']|', '~]|')
      ('|', '|https?://|')
      ()
  });

  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline.breaks = merge({}, inline.gfm, {
    br: replace(inline.br)('{2,}', '*')(),
    text: replace(inline.gfm.text)('{2,}', '*')()
  });

  /**
   * Footnote Inline Grammar
   */

  inline.footnote = {
    footnote: /^\[\^([^\]]+)\]/
  };

  /**
   * Inline Lexer & Compiler
   */

  function InlineLexer(links, footnotes, options) {
    this.options = options || marked.defaults;
    this.links = links;
    this.footnotes = footnotes || {};
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer(this.options);

    if (!this.links) {
      throw new
        Error('Tokens array requires a `links` property.');
    }

    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    }

    if (this.options.footnotes) {
      this.rules = merge({}, this.rules, inline.footnote);
    }

    if (this.options.pedantic) {
      this.rules = merge({}, this.rules, inline.pedantic);
    }
  }

  /**
   * Expose Inline Rules
   */

  InlineLexer.rules = inline;

  /**
   * Static Lexing/Compiling Method
   */

  InlineLexer.output = function(src, links, footnotes, options) {
    var inline = new InlineLexer(links, footnotes, options);
    return inline.output(src);
  };

  /**
   * Lexing/Compiling
   */

  InlineLexer.prototype.output = function(src) {
    var out = []
      , cap;

    while (src) {
      // link and image
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.outputLink(cap, {
          href: cap[2],
          title: cap[3]
        }));
        continue;
      }
      
      if(cap = urlDetectRegex.exec(src)){
        if (cap['index'] === 0) {
          src = src.substring(cap[0].length);
          out.push(this.outputLink(cap, {
            href: cap[0],
            title: cap[0]
          }, true));
          continue;
        }
      }

      // underline
      if (cap = this.rules.underline.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.underline(cap[2] || cap[1]));
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.strong(cap[2] || cap[1]));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.em(cap[2] || cap[1]));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out.push(this.renderer.codespan(cap[2]));
        continue;
      }

      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        var delOutputNodes = this.renderer.del(this.output(cap[2] || cap[1]));
        delOutputNodes.forEach((delOutputNode) => {
          out.push(delOutputNode);
        });
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        var matchedStr = cap[0];
        src = src.substring(matchedStr.length);
        out.push(this.renderer.text(matchedStr.replace(/[\t\n\r]+/g, ' ')));
        continue;
      }

      if (src) {
        throw new
          Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  };

  /**
   * Compile Link
   */

  InlineLexer.prototype.outputLink = function(cap, link, nest) {
    var href = link.href, title = link.title ? link.title : null;
    var ext = href.toLowerCase().split('.').pop();
    if(cap[0].charAt(0) === '!') {
      return this.renderer.image(href, title, cap[1])
    } else {
      if(nest && (ext === 'md' || ext === 'txt' || ext === 'html')){
        return this.renderer.image(href, title, cap[1])
      }
      return this.renderer.link(href, title, cap[1])
    }
  };

  /**
   * Mangle Links
   */

  InlineLexer.prototype.mangle = function(text) {
    var out = ''
      , l = text.length
      , i = 0
      , ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  };

  /**
   * Renderer
   */

  function Renderer(options) {
    this.options = options || {};

    this.onResizeListeners = [];
    this.textIndex = 0;
    this.textSelector = new TextSelector(options);
    this.options.emitter.on('onContainerResize', () => {
      this.textIndex = 0;
      this.textSelector.texts = []; // clear it
    });
    this.linkMap = {}; // used to store link elements
    this.currentLinkId = null; // current link
    this.autoGenLinkId = 0; // Link ID (auto incremented, starts from 0)
    
    // on key down bind
    options.scene.root.on("onKeyUp", (e) => {
      var code = e.keyCode; var flags = e.flags;
      if (code === keys.ENTER) {
        if (this.linkMap[this.currentLinkId] && this.linkMap[this.currentLinkId].length > 0) {
          this.linkMap[this.currentLinkId][0].onClick();
        }
      } else if(code === keys.TAB) {
        var idArr = Object.keys(this.linkMap);
        idArr = idArr.map((id) => +id);
        var oldIndex = idArr.findIndex(id => id === this.currentLinkId);
        var newIndex = 0;
        if(keys.is_SHIFT(flags)) {
          newIndex = oldIndex < 0 ? (idArr.length - 1) : ((oldIndex - 1 + idArr.length)%idArr.length);
        } else {
          newIndex = oldIndex < 0 ? 0 : ((oldIndex + 1)%idArr.length);
        }
        this.currentLinkId = idArr[newIndex];
        idArr.forEach( id => {
          var links = this.linkMap[id] || [];
          links.forEach(l => {
            if (id === this.currentLinkId) {
              if (l.highlight) {
                l.highlight();
                var p = this.getGlobalPosition(l);
                p.scrollbar.scrollTo(p);
              }
            } else {
              l.unhighlight && l.unhighlight();
            }
          });
        });
      }
    });
  }
  
  /**
   * get global position for scroll content root
   */
  Renderer.prototype.getGlobalPosition = function(node) {
    var x = node.x;
    var y = node.y;
    var parent = node.parent;
    
    while(parent && parent.name !== 'scroll-content') {
      x += parent.x;
      y += parent.y;
      parent = parent.parent;
    }

    return {
      x: x,
      y: y,
      w: node.w,
      h: node.h,
      scrollbar: parent.scrollbar,
    };
  }

  Renderer.prototype.code = function(code, offsetLeft) {
    var options = this.options;
    var scene = options.scene;

    var container = scene.create({
      t: 'object',
      interactive: false,
      parent: options.parent,
    });

    var decor = scene.create({
      t: 'rect',
      parent: container,
      interactive: false,
      fillColor: options.styles.code.fillColor,
      lineColor: options.styles.code.lineColor,
      lineWidth: options.styles.code.lineWidth,
    });

    var textBox = scene.create({
      t: 'textBox',
      parent: container,
      interactive: false,
      text: code,
      x: options.styles.code.paddingLeft || 0,
      y: options.styles.code.paddingTop || 0,
      wordWrap: true,
      font: options.styles.code.font,
      textColor: options.styles.code.textColor,
    });

    function updateSize() {
      container.w = options.parent.w - offsetLeft;
      decor.w = container.w;
      textBox.w = decor.w
        - (options.styles.code.paddingLeft || 0)
        - (options.styles.code.paddingRight || 0);

      var textMeasure = textBox.measureText();

      textBox.h = textMeasure.bounds.y2;
      decor.h = textBox.h
        + (options.styles.code.paddingTop || 0)
        + (options.styles.code.paddingBottom || 0);
      container.h = decor.h + (options.styles.code.marginBottom || 0);
    }

    options.emitter.on('onContainerResize',updateSize)
  
    updateSize();

    return container;
  };

  Renderer.prototype.blockquote = function(blocks, offsetLeft) {
    var options = this.options
    var scene = options.scene

    var container = scene.create({
      t: 'object',
      interactive: false,
      parent: options.parent,
    });

    var decor = scene.create({
      t: 'rect',
      parent: container,
      interactive: false,
      fillColor: options.styles.blockquote.lineColor,
      x: options.styles.blockquote.lineOffsetLeft,
      w: options.styles.blockquote.lineWidth,
    });

    blocks.forEach((block) => {
      block.parent = container;
      block.x = options.styles.blockquote.paddingLeft;
    });

    function updateSize() {
      container.w = options.parent.w - offsetLeft;

      var y = 0;
      blocks.forEach((block) => {
        block.parent = container;
        block.y = y;
        y += block.h;
      });

      container.h = y + (options.styles.blockquote.marginBottom || 0);
      decor.h = y;
    }

    this.options.emitter.on('onContainerResize', updateSize)
    updateSize();

    return container;
  };

  Renderer.prototype.heading = function(inlineBlocks, level, offsetLeft) {
    return this.renderTextBlockWithStyle(inlineBlocks, this.options.styles['header-' + level], offsetLeft);
  };

  Renderer.prototype.list = function(listItems, ordered, offsetLeft) {
    var options = this.options
    var scene = options.scene

    var container = scene.create({
      t: 'object',
      parent: options.parent,
      interactive: false,
    });

    var markers = [];

    listItems.forEach((listItem, index) => {
      var marker = null;
      if (ordered) {
        marker = this.renderInlineTextWithStyle(`${index + 1}.`, options.styles['list-item']);
      } else {
        marker = scene.create({
          t: 'image',
          url: options.mimeBaseURL+'res/unordered_list_fill.svg',
          x: 0,
          y: 0,
          interactive: false,
          h: options.styles['list-item'].pixelSize,
        })
      }
      

      marker.parent = container;
      marker.x = options.styles['list-item'].symbolOffsetLeft;

      markers.push(marker);

      listItem.parent = container;
      listItem.x = options.styles['list-item'].paddingLeft;
    });

    function updateSize() {
      container.w = options.parent.w - offsetLeft;

      var y = 0

      listItems.forEach((listItem, index) => {
        var listItemContainer = listItem.children && listItem.children[0];
        var listItemInlineBlock = listItemContainer && listItemContainer.children && listItemContainer.children[0];
        var listItemHeight = listItemInlineBlock
          ? (listItemInlineBlock.h + listItemInlineBlock.y)
          : listItem.h;

        markers[index].y = y + (listItemHeight - markers[index].h);
        listItem.y = y;

        y += listItem.h;
      });

      container.h = y
        + (options.styles.list.marginBottom || 0)
        - (options.styles['list-item'].marginBottom || 0);
    }

    options.emitter.on('onContainerResize',updateSize)
    updateSize();

    return container;
  };

  Renderer.prototype.listitem = function(content, offsetLeft) {
    var options = this.options;
    var scene = this.options.scene;

    var container = scene.create({
      t: "object",
      parent: options.parent,
      interactive: false,
      x: 0,
      y: 0,
    });

    var items = [];

    content.forEach((contentItem) => {
      if (Array.isArray(contentItem)) {
        var listItem = this.renderTextBlockWithStyle(
          contentItem,
          options.styles['list-item'],
          offsetLeft + options.styles['list-item'].paddingLeft
        );
        listItem.parent = container;

        items.push(listItem);
      } else if (contentItem !== null) {
        contentItem.parent = container;
        items.push(contentItem);
      }
    });

    function updateSize() {
      container.w = options.parent.w - offsetLeft;

      var y = 0;
      items.forEach((item) => {
        item.y = y;
        y += item.h;
      })

      container.h = y;
    }

    this.options.emitter.on('onContainerResize',updateSize)
    updateSize();

    return container;
  };

  Renderer.prototype.renderTextBlockWithStyle = function(inlineBlocks, style, offsetLeft, width, isTableText) {
    var scene = this.options.scene;
    var options = this.options
    var that = this;

    var container = scene.create({
      t: "object",
      parent: options.parent,
      interactive: false,
      x: 0,
      y: 0,
      w: width || (options.parent.w - offsetLeft),
    });
    container.resizeable = true;

    // All link ID in this inlineBlocks
    var linkIds = [];

    function resolveFont(blockFont, inlineFont) {
      if (inlineFont === options.FONT_STYLE.BOLD && blockFont === options.FONT_STYLE.ITAlIC ||
        inlineFont === options.FONT_STYLE.ITALIC && blockFont === options.FONT_STYLE.BOLD
      ) {
        return options.FONT_STYLE.BOLD_ITALIC
      }

      if (inlineFont === options.FONT_STYLE.REGULAR) {
        return blockFont;
      }

      return inlineFont ? inlineFont : blockFont;
    }

    // Update link click object (should be called after setting the text)
    function updateLinkClickObj(inlineBlock) {
      // for falsy values just return
      if (!inlineBlock) {
        return;
      }
      // Do nothing for non-link text.
      var type = inlineBlock.type;
      if (type !== 'link') {
        return;
      }

      var linkId = inlineBlock.linkId;
      var links = that.linkMap[linkId];
      if (links && links[0] && links[0].clickObj) {
        // The same linkId has existed, don't need to create a new clickObj,
        // just extend the width & height of the existing clickObj
        clickObj = that.linkMap[linkId][0].clickObj;
        clickObj.w = Math.max(clickObj.w, inlineBlock.w);
        clickObj.h = Math.max(clickObj.h, inlineBlock.y - that.linkMap[linkId][0].y + inlineBlock.h);
        clickObj.x = Math.min(clickObj.x, inlineBlock.x - links[0].x);
      } else {
        var clickObjOffsetX = 6;
        var clickObj = scene.create({
          t: "rect", fillColor:0x00000000,
          lineColor: 0x00000000,
          lineWidth: options.styles.link.activeBorderWidth,
          parent: inlineBlock, x: -4, y: 0,
          w: inlineBlock.w + clickObjOffsetX, h: inlineBlock.h,
        });
        clickObj.on('onMouseUp',function() {
          inlineBlock.onClick();
        });
        clickObj.on('onMouseEnter', function(){
          var links = that.linkMap[linkId];
          if (!links || links.length <= 0 || links[0].timestamp !== inlineBlock.timestamp) {
            inlineBlock.textColor = options.styles.link.activeColor;
          } else {
            links.forEach((linkBlock) => {
              linkBlock.textColor = options.styles.link.activeColor;
            });
          }
        });
        clickObj.on('onMouseLeave', function(){
          var links = that.linkMap[linkId];
          if (!links || links.length <= 0 || links[0].timestamp !== inlineBlock.timestamp) {
            inlineBlock.textColor = options.styles.link.textColor;
          } else {
            links.forEach((linkBlock) => {
              linkBlock.textColor = options.styles.link.textColor;
            });
          }
        });
        // Show the rectangle (highlighted)
        clickObj.highlight = function() {
          clickObj.lineColor = options.styles.link.activeBorderColor;
        };
        // Hide the rectangle (unhighlighted)
        clickObj.unhighlight = function() {
          clickObj.lineColor = 0x00000000;
        };
      }

      inlineBlock.clickObj = clickObj;

      inlineBlock.highlight = function() {
        clickObj.highlight();
      }
      inlineBlock.unhighlight = function() {
        clickObj.unhighlight();
      }

      if(that.currentLinkId === linkId) {
        inlineBlock.highlight();
      }
    }

    function copy(inlineBlock) {
      // for falsy values just return the same value
      if (!inlineBlock) {
        return inlineBlock;
      }

      var type = inlineBlock.type;
      var textColor = style.textColor;
      if( type === 'link' ){
        textColor = options.styles.link.textColor;
      }

      var inlineBlockCopy = scene.create({
        id: inlineBlock.id,
        t: 'text',
        interactive: false,
        x: inlineBlock.x,
        y: inlineBlock.y,
        text: inlineBlock.text,
        textColor: textColor,
        font: resolveFont(style.font, inlineBlock.font),
        pixelSize: style.pixelSize,
      });
      inlineBlockCopy.type = inlineBlock.type;

      if(type === 'link') {
        inlineBlockCopy.onClick = inlineBlock.onClick;
        var linkId = inlineBlock.linkId;
        inlineBlockCopy.linkId = linkId;
        inlineBlockCopy.timestamp = inlineBlock.timestamp;
        var oldLinks = that.linkMap[linkId];
        if (!oldLinks || oldLinks.length <= 0 || oldLinks[0].timestamp !== inlineBlock.timestamp) {
          that.linkMap[linkId] = [inlineBlockCopy];
        } else {
          that.linkMap[linkId].push(inlineBlockCopy);
        }

        linkIds.push(linkId);
      }
      inlineBlockCopy.isTableText = isTableText;
      return inlineBlockCopy;
    }

    function renderInlineBlocks() {
      container.removeAll();
      linkIds.forEach((linkId) => that.linkMap[linkId] = undefined);

      var x = 0;
      var y = 0;

      var inlineBlock;
      var someBlock;
      var blocksToRender = inlineBlocks.slice();
      var lineBlocks = [];

      function getLineHeight() {
        var heights = lineBlocks.map((block) =>  block.h);
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
        that.textSelector.pushBlocks(lineBlocks);
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
            newWord = inlineBlock.text.substring(inlineBlock.text.length-1) + newWord;
            inlineBlock.text = inlineBlock.text.substring(0,inlineBlock.text.length-1);
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
        lineBlocks.push(inlineBlock);;

        if (inlineBlock.type === 'underline') { // draw a under line
          scene.create({
            t: 'rect',
            h: options.styles.underline.height,
            fillColor: options.styles.underline.fillColor,
            w: inlineBlock.w,
            interactive: false,
            parent: inlineBlock,
            x: 0,
            y: inlineBlock.h - 1,
          });
        } else if (inlineBlock.type === 'del') {
          scene.create({
            t: 'rect',
            h: options.styles.del.height,
            fillColor: options.styles.del.fillColor,
            w: inlineBlock.w,
            interactive: false,
            parent: inlineBlock,
            x: 0,
            y: inlineBlock.h / 2 + 1,
          });
        }
        updateLinkClickObj(inlineBlock);
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

        if(inlineBlocks.length > 0) {
          that.textSelector.pushBlocks(lineBlocks);
        }
    }

    this.options.emitter.on('onContainerResize', function() {
      if (!container.resizeable) return;
      container.w = options.parent.w - offsetLeft;

      renderInlineBlocks();
    });
    
    renderInlineBlocks();

    container.setWidth = function(w) {
      container.w = w;
      renderInlineBlocks();
    }
    return container;
  }

  Renderer.prototype.paragraph = function(inlineBlocks, offsetLeft, style) {
    style = style || {};
    return this.renderTextBlockWithStyle(inlineBlocks, Object.assign({}, this.options.styles.paragraph, style), offsetLeft);
  };

  /**
   * render table into spark
   * @param header the table header
   * @param body the table body
   * @param offsetLeft the table offset left
   */
  Renderer.prototype.table = function(header, body, offsetLeft) {
    var options = this.options;
    var scene = options.scene;
    var cellWidths = [];
    var vLines = []; // vertical lines
    var hLines = []; // horizontal
    var backgroupRects = []; // background rect

    if(body.length === 1 && body[0].length === 1 && body[0][0].content.length === 0){
      body = [];
    }
    var container = scene.create({
      t: 'object',
      interactive: false,
      name: 'table-root',
      parent: options.parent,
    });

    var borderFrame = scene.create({  // table border frame
      t: 'rect',
      parent: container,
      interactive: false,
      lineColor: options.styles.table.borderColor,
      fillColor: options.styles.table.rowBackgrounColor[0],
      lineWidth: options.styles.table.borderWidth,
    });

    /**
     * get cell origin inline block width
     * @param rowIndex  the row index
     * @param columnIndex the column index
     */
    var getCellOriginWidth = function(rowIndex, columnIndex) {
      var blocks = [];
      if( rowIndex === 0) {
        blocks = header[columnIndex];
      } else {
        blocks = body[rowIndex - 1][columnIndex];
      }
      var w = 0;
      blocks.content.forEach(b => w += b.w);
      return w;
    }
    /**
     * get cell alignment from table
     * @param rowIndex  the row index
     * @param columnIndex the column index
     */
    var getAlignment = function(rowIndex, columnIndex) {
      if( rowIndex === 0) {
        return header[columnIndex].align;
      } else {
        return body[rowIndex - 1][columnIndex].align;
      }
    }

    /**
     * get start x position for column
     * @param columnWidth  the columnWidth arr
     * @param index  the column index
     */
    var getStartXPosition = function(columnWidth, index) {
      if (index === 0) return 0;
      var x = 0;
      for(var i = 0; i < index; i ++) {
        x += columnWidth[i];
      }
      return x;
    }

    /**
     * get total table width
     * @param columnWidth  the columnWidth arr
     */
    var getTotalWidth = function(columnWidth) {
      var sum = 0;
      for(var i = 0 ; i < columnWidth.length; i ++){
        sum += columnWidth[i];
      }
      return sum;
    }

    for(var i = 0 ; i < body.length; i ++) {
      var bgRect = scene.create({  // table border frame
        t: 'rect',
        interactive: false,
        parent: container,
        lineColor: 0x00000000,
        fillColor: options.styles.table.rowBackgrounColor[1],
        lineWidth: 0,
      });
      backgroupRects.push(bgRect);
    }

    var rows = [];
    var row = [];
    cellWidths[0] = [];
    header.forEach( (h, columnIndex) => {
      var headerText = this.renderTextBlockWithStyle(
        h.content,
        options.styles['table-header'],
        offsetLeft, 0 , true
      );
      headerText.resizeable = false;
      headerText.parent = container;
      cellWidths[0][columnIndex] = getCellOriginWidth(0, columnIndex);
      row.push(headerText);
    });
    rows.push(row);

    
    body.forEach((r, rowIndex) => {
      var row = [];
      cellWidths[rowIndex+1] = [];
      r.forEach((cell, columnIndex) => {
        var cellText = this.renderTextBlockWithStyle(
          cell.content,
          options.styles['table-cell'],
          offsetLeft, 0 , true
        );
        cellText.resizeable = false;
        cellText.parent = container;
        cellWidths[rowIndex+1][columnIndex] = getCellOriginWidth(rowIndex+1, columnIndex);
        row.push(cellText);
      });
      rows.push(row);
    });

    console.log("origin table width arr = ", cellWidths);
    var pLeft = options.styles['table-cell'].paddingLeft;
    var pRight = options.styles['table-cell'].paddingRight;
    var pTop = options.styles['table-cell'].paddingTop;
    var pBottom = options.styles['table-cell'].paddingBottom;

    var columnNumber = header.length;
    var rowNumber = body.length + 1;

    // lines
    for (var i = 0; i < columnNumber - 1; i ++) {
      var line = scene.create({
        t: 'rect',
        parent: container,
        lineColor: 0x00000000,
        fillColor: options.styles.table.borderColor,
        w: options.styles.table.borderWidth,
        interactive: false,
        lineWidth: 0,
      });
      vLines.push(line);
    }

    for (var i = 0; i < rowNumber - 1; i ++) {
      var line = scene.create({
        t: 'rect',
        parent: container,
        lineColor: 0x00000000,
        interactive: false,
        fillColor: options.styles.table.borderColor,
        h: options.styles.table.borderWidth,
        lineWidth: 0,
      });
      hLines.push(line);
    }



    var textWidthOffset = 4;
    function updateSize() {
      container.w = options.parent.w - offsetLeft;

      var columnWidth = [];
      var avgWidth = container.w / columnNumber;
      var longWidthCount = 0;
      var totalUsedWidth = 0;
      var textOffset =  options.styles['table-cell'].pixelSize;

      for( var i = 0; i < columnNumber; i ++) {
        var maxWidth = 0;
        for( var j = 0; j < rowNumber; j ++) {
          maxWidth = Math.max(maxWidth, cellWidths[j][i]);
        }
        if (maxWidth + pLeft + pRight < avgWidth)
        {
          columnWidth[i] = maxWidth + pLeft + pRight + textOffset;
          totalUsedWidth += columnWidth[i];
        } else {
          columnWidth[i] = -1;
          longWidthCount += 1;
        }
      }

      // avg long width cell
      for( var i = 0; i < columnNumber; i ++) {
        if( columnWidth[i] < 0) {
          columnWidth[i] = (container.w - totalUsedWidth) / longWidthCount;
        }
      }

      var totalW = getTotalWidth(columnWidth);

      var y = 0;
      for( var i = 0 ; i < rowNumber; i ++) {
        
        if( i > 0) {
          hLines[i-1].x = 0;
          hLines[i-1].w = totalW;
          hLines[i-1].y = y;
        }

        y += pTop;

        // set position
        var maxHeight = 0;
        for( var j = 0; j < columnNumber ; j ++) {
          var cellW = columnWidth[j];
          var newW = cellW - pLeft - pRight;
          var cell = rows[i][j];
          cell.setWidth(newW + textWidthOffset);
          maxHeight = Math.max(maxHeight, cell.h);
          cell.y = y;

          var startX = getStartXPosition(columnWidth, j);
          var align = getAlignment(i, j);
          var originW = cellWidths[i][j];

          if(!align || align === 'left') {
            cell.x = startX + pLeft;
          } else if(align === 'center'){
            cell.x = startX + (columnWidth[j] > avgWidth ? pLeft : ( (cellW - originW)*0.5 ));
          } else {
            cell.x = startX + (columnWidth[j] > avgWidth ? pLeft : (cellW - originW - pRight - textOffset*0.5));
          }
        }

        // cell vertical centering
        for( var j = 0; j < columnNumber ; j ++) {
          var cell = rows[i][j];
          cell.y = (maxHeight - cell.h)*0.5 + y;
        }

        y += maxHeight + pBottom;

        if( i > 0) {
          backgroupRects[i-1].w = totalW;
          backgroupRects[i-1].h = maxHeight + pTop + pBottom;
          backgroupRects[i-1].x = 0;
          backgroupRects[i-1].y = y - backgroupRects[i-1].h;
          backgroupRects[i-1].fillColor = options.styles.table.rowBackgrounColor[i%2 == 0 ? 1 : 0];
        }

      }
      borderFrame.h = y;
      borderFrame.w = totalW;
      container.h = y + options.styles['table'].marginBottom;
      
      for(var j = 0 ; j < columnNumber - 1; j ++) {
        vLines[j].h = y;
        vLines[j].y = 0;
        vLines[j].x = getStartXPosition(columnWidth, j+1);
      }
    }

    this.options.emitter.on('onContainerResize',updateSize)
    updateSize();
    return container;
  };

  Renderer.prototype.renderInlineTextWithStyle = function(text, style) {
    var scene = this.options.scene;
    var textInlineStyle = {
      t: 'text',
      interactive: false,
      text: text,
      font: style.font || 'REGULAR',
      textColor: style.textColor,
    };
    var textInline = scene.create(textInlineStyle);
    textInline.style = textInlineStyle;

    return textInline;
  }

  // span level renderer
  Renderer.prototype.strong = function(text) {
    return this.renderInlineTextWithStyle(text, this.options.styles.strong);
  };
  
  Renderer.prototype.underline = function(text) {
    var underlineNode = this.renderInlineTextWithStyle(text, this.options.styles.underline);
    underlineNode.type = 'underline';
    return underlineNode;
  };

  Renderer.prototype.em = function(text) {
    return this.renderInlineTextWithStyle(text, this.options.styles.em);
  };

  Renderer.prototype.text = function(text) {
    return this.renderInlineTextWithStyle(text, this.options.styles.text);
  };

  Renderer.prototype.codespan = function(text) {
    return this.renderInlineTextWithStyle(text, this.options.styles.codespan);
  };

  Renderer.prototype.del = function(inlineTexts) {
    var delNodes = [];
    inlineTexts.forEach((inlineText) => {
      var style = inlineText.style;
      var text = style.text;
      var delNode = this.renderInlineTextWithStyle(text, style);
      delNode.type = 'del';
      delNodes.push(delNode);
    })
    return delNodes;
  };

  Renderer.prototype.link = function(href, title, text) {
    var options = this.options;
    var link = this.renderInlineTextWithStyle(text || title, this.options.styles.link);
    link.type = 'link';

    var url = href
    if (!href.match(/^(?:file|https?|ftp):\/\//)) {
      url = options.basePath + href;
    }
    link.linkId = this.autoGenLinkId++;
    link.onClick = function(){
      var scene = options.scene;

      // Send navigate request via bubbling service manager up
      // the chain.
      var n = scene.getService(".navigate");
      if (n) {
        console.log("before navigation request");
        n.setUrl(url);
      }
      else console.log(".navigate service not available");

    }
    return link;
  };

  // This will handle multiple document types
  // Allowing for nested Images, Markdown, Text and Spark Content
  Renderer.prototype.image = function(href, title, text) {
    var scene = this.options.scene;
    var options = this.options;

    var url = href;
    if (!href.match(/^(?:file|https?|ftp):\/\//)) {
      url = options.basePath + href;
    }

    var fontMetrics = options.styles.paragraph.font.getFontMetrics(
      options.styles.paragraph.pixelSize
    );

    let hasWxH = (href.indexOf(' =')  >= 0);
    var WxH = [];

    if(hasWxH)
    {
      var splitz = url.split(' =');

      url = splitz[0].trim();
      WxH = splitz.pop();
      WxH = WxH.split('x');
    }

    // Init
    // Use a 16:9 default aspect ratio
    var ww = (WxH.length > 0 && WxH[0] != '') ? parseInt(WxH[0]) : 528
    var hh = (WxH.length > 1 && WxH[1] != '') ? parseInt(WxH[1]) : 297

    /*
    console.log("#############  MD::Image >>>>  WxH = " + ww + " x " + hh); // JUNK
    console.log("#############  MD::Image >>>>  url = " + url);  // JUNK
    console.log("#############  MD::Image >>>> href = " + href); // JUNK
    */

    var img = scene.create({t:'scene',url:url,w:ww,h:hh,parent:this.options.parent,clip:true})

    
    function updateSize() {
      /*
      if (!img.resource) {
      //img.w = 800
      //img.h = 600
      return;
      }
      if(img.resource.w <= 0 || img.resource.h <= 0){ // w or h is 0, skip this
        return;
      }
      img.maxWidth = options.parent.w;
      var w = Math.min(img.resource.w, options.parent.w);
      var ar = img.resource.w / img.resource.h;

      img.w = w;
      img.h = w / ar;
      */
    }

    if (!hasWxH) {
      img.ready.then(() => {
        if (img.api._ready) {
          img.api._ready.then(function(){
            img.w = img.api._preferredW
            img.h = img.api._preferredH
          })
        }

        this.options.emitter.emit('onImageReady')
      })
    }

    return img;
  };

  Renderer.prototype.emptyLine = function(offsetLeft) {
    var inlineBlock = this.renderInlineTextWithStyle('', this.options.styles.text);

    return this.renderTextBlockWithStyle([inlineBlock], this.options.styles.paragraph, offsetLeft);
  }

  /**
   * Parsing & Compiling
   */

  function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults;
    this.options.renderer = this.options.renderer || new Renderer(this.options);
    this.renderer = this.options.renderer;
  }

  /**
   * Static Parse Method
   */

  Parser.parse = function(src, options, renderer) {
    var parser = new Parser(options, renderer);
    return parser.parse(src);
  };

  /**
   * Parse Loop
   */

  Parser.prototype.parse = function(src) {
    var options = this.options;
    this.inline = new InlineLexer(src.links, src.footnotes, this.options);
    this.tokens = src.reverse();

    var out = [];
    while (this.next()) {
      var block = this.tok();

      out.push(block);
    }

    function updateSize() {
      var y = 0;

      out.forEach(function(block) {
        // skip space blocks (null)
        if (!block) return;
        block.y = y;
        y += block.h;
      });

      options.parent.h = y;
    }

    this.options.emitter.on('onContainerResize',updateSize)
    updateSize();

    if (src.footnotes.length) {
      out.push(this.renderer.footnotes(src.footnotes));
    }

    return out;
  };

  /**
   * Next Token
   */

  Parser.prototype.next = function() {
    return this.token = this.tokens.pop();
  };

  /**
   * Preview Next Token
   */

  Parser.prototype.peek = function() {
    return this.tokens[this.tokens.length - 1] || 0;
  };

  /**
   * Parse Text Tokens
   */

  Parser.prototype.parseText = function() {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  };

  /**
   * Parse Current Token
   */

  Parser.prototype.tok = function(offsetLeft = 0, style = {}) {
    var options = this.options;

    switch (this.token.type) {
      case 'space': {
        return null;
      }
      case 'heading': {
        return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          offsetLeft
        );
      }
      case 'code': {
        return this.renderer.code(this.token.text, offsetLeft);
      }
      case 'table': {
        var header = []
          , body = []
          , i
          , row
          , bodyRow
          , j
          , numColumns;
  
        // header
        for (i = 0; i < this.token.header.length; i++) {
          flags = { header: true, align: this.token.align[i] };
          header.push({
            content: this.inline.output(this.token.header[i]),
            header: true,
            align: this.token.align[i]
          });
        }
  
        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];
          // Ignore the extra column
          numColumns = Math.min(row.length, this.token.header.length);
          bodyRow = [];
          for (j = 0; j < numColumns; j++) {
            bodyRow.push({
              content: this.inline.output(row[j]),
              header: false,
              align: this.token.align[j]
            });
          }

          // Make sure each row has enough columns
          for (j = numColumns; j < this.token.header.length; j++) {
            bodyRow.push({
              content: this.inline.output(''), // Put an empty string
              header: false,
              align: this.token.align[j],
            });
          }

          body.push(bodyRow);
        }
        return this.renderer.table(header, body, offsetLeft);
      }
      case 'blockquote_start': {
        var body = [];

        while (this.next().type !== 'blockquote_end') {
          body.push(this.tok(offsetLeft + (options.styles.blockquote.paddingLeft || 0), { marginBottom: 0 }));
        }

        return this.renderer.blockquote(body, offsetLeft);
      }
      case 'list_start': {
        var body = []
          , ordered = this.token.ordered;

        while (this.next().type !== 'list_end') {
          body.push(this.tok(offsetLeft + (options.styles.list.paddingLeft || 0)));
        }

        return this.renderer.list(body, ordered, offsetLeft);
      }
      case 'list_item_start': {
        var body = [];

        while (this.next().type !== 'list_item_end') {
          var tok = this.token.type === 'text'
            ? this.parseText(offsetLeft + (options.styles['list-item'].paddingLeft || 0))
            : this.tok(offsetLeft + (options.styles['list-item'].paddingLeft || 0));

          body.push(tok);
        }

        return this.renderer.listitem(body, offsetLeft);
      }
      case 'loose_item_start': {
        var body = [];

        while (this.next().type !== 'list_item_end') {
          body.push(this.tok(offsetLeft + (options.styles['list-item'].paddingLeft || 0)));
        }

        return this.renderer.listitem(body, offsetLeft);
      }
      case 'paragraph': {
        return this.renderer.paragraph(this.inline.output(this.token.text), offsetLeft, style);
      }
      case 'text': {
        return this.renderer.paragraph(this.parseText(), offsetLeft);
      }
    }
  };

  /**
   * Helpers
   */
  function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';
    return function self(name, val) {
      if (!name) return new RegExp(regex, opt);
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return self;
    };
  }

  function noop() {}
  noop.exec = noop;

  function merge(obj) {
    var i = 1
      , target
      , key;

    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  var defaults = {
    gfm: true,
    tables: true,
    footnotes: false,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    silent: false,
    highlight: null,
    langPrefix: 'lang-',
    headerPrefix: '',
    renderer: null,
    xhtml: false
  };

  function Markdown(scene, parent, options) {
    this.scene = scene;
    this.parent = parent;
    this.options = options;

    this.source;

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

    this.update = this.update.bind(this);

    //JRJR why do we need to do this?
    var that = this
    this.update2 = function() {
      that.update()
    }

    this.scene.on('onResize', this.update2)

    this.emitter.on('onImageReady', this.update)
  }

  Markdown.prototype.getParentRoot = function() {
    return this.parent.root ? this.parent.root : this.parent;
  }

  Markdown.prototype.prepareStyle = function(style, baseURL) {
    this.options.FONT_STYLE = {};
    Object.keys(style.FONT_STYLE).forEach((fontStyle) => {

      this.options.FONT_STYLE[fontStyle] = this.scene.create({
        t: 'fontResource',
        url: baseURL + style.FONT_STYLE[fontStyle],
      });
    });

    this.options.styles = {};
    Object.keys(style.styles).forEach((blockName) => {
      var blockStyle = Object.assign({}, style.styles[blockName]);

      if (blockStyle.font) {
        blockStyle.font = this.options.FONT_STYLE[blockStyle.font];
      }

      this.options.styles[blockName] = blockStyle;
    });
  }

  Markdown.prototype.setSource = function(markdownSource) {
    this.source = markdownSource;
    this.render();
  }

  Markdown.prototype.update = function() {
    var parentRoot = this.getParentRoot();

    this.container.w = parentRoot.w
      - (this.options.styles.container.paddingLeft || 0)
      - (this.options.styles.container.paddingRight || 0);

    this.emitter.emit('onContainerResize')

    this.updateParent();
  }

  Markdown.prototype.render = function() {
    var opt = merge({}, defaults, {
      basePath: this.options.basePath,
      scene: this.scene,
      parent: this.container,
      emitter: this.emitter,
      FONT_STYLE: this.options.FONT_STYLE,
      styles: this.options.styles,
      mimeBaseURL: this.options.mimeURL || '',
    });

    var tokens = Lexer.lex(this.source, opt);

    Parser.parse(tokens, opt);

    this.updateParent();
  }

  Markdown.prototype.updateParent = function() {
    this.getParentRoot().h = this.container.h
        + (this.options.styles.container.paddingTop || 0)
        + (this.options.styles.container.paddingBottom || 0);

    this.parent.update && this.parent.update();
  }

  Markdown.prototype.prepare = function(){

    var fontsResources = [];
    var keys = Object.keys(this.options.FONT_STYLE);
    var scene = this.scene;
    keys.forEach((fontStyle) => {
      fontsResources.push(scene.create({ t: 'fontResource', url: this.options.FONT_STYLE[fontStyle].url}).ready)
    });
    var that = this;

    // clear old node
    var children = scene.root.children;
    for( var i = 0 ; i < children.length; i ++){
      if( children[i].markAsDelete === true){
        children[i].remove()
      }
    }

    return Promise.all(fontsResources).then(function (resources) {
      for(var i = 0 ; i < keys.length ; i ++){
        that.options.FONT_STYLE[keys[i]] = resources[i];
        console.log("font " + resources[i].url + " loaded.")
      }
      return Promise.resolve(that);
    });
  }
  module.exports.Markdown = Markdown;

}).catch(function importFailed(err) {
  console.error("Import failed: " + err);
});
