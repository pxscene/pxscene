/**
 * text selection class
 * //TODO select code block not support yet, inline code already support, also don't support select inner scene, markdown, txt, and table
 */
px.import({
  style: 'markdown.style.js',
  keys: 'px:tools.keys.js',
}).then(function importsAreReady(imports) {

  var NEW_LINE = '\n';
  var BOTTOM_LINE = 'bottom-line';
  var TOP_LINE = 'top-line';
  var mdStyle = imports.style.styles.container;
  var keys = imports.keys;
  var offsetX = mdStyle.paddingLeft;
  var offsetY = mdStyle.paddingTop;
  var scrollSpeed = 4;


  /**
   * create new text selector
   * @param options the options from markdown render
   * @constructor
   */
  function TextSelector(options) {
    this.options = options || {};
    this.texts = [];
    this.isPressed = false;
    this.isMouseOut = false;


    this.lastClickPos = null;
    this.startClickPos = null;

    this.testRect = null;
    this.preSelectionTime = Date.now();
    this.firstItem = {};
    this.lastItem = {};
    this.cursorItem = {};
    this.selectText = '';
    this.rootContent = this.options.parent.parent;
    
    this.keyEvent = {
      type: '',
      times: 0
    };

    this.container = options.scene.create({
      t: 'object',
      interactive: false,
      x: 0,
      y: 0,
      parent: options.parent,
    })


    this.dragContainer = options.scene.create({
      t: 'object',
      interactive: false,
      x: 0,
      y: 0,
      parent: options.parent,
    })

    this.cursor = this.options.scene.create({
      t: "rect", w: 2, h: 22,
      fillColor: this.options.styles.container.cusorColor,
      parent: this.dragContainer, x: 0, y: 0
    });

    options.scene.root.on("onMouseMove", (e) => {
      if (!this.isPressed || !this.startClickPos) {
        return;
      }


      var p = this.convertToContentPosition(e);

      if (this.isMouseOut) {

      }

      if (this.testRect) {
        this.testRect.remove();
      }

      this.testRect = options.scene.create({
        t: 'rect',
        x: Math.min(this.startClickPos.x, p.x) - offsetX,
        y: Math.min(this.startClickPos.y, p.y) - offsetY,
        w: Math.abs(this.startClickPos.x - p.x),
        h: Math.abs(this.startClickPos.y - p.y),
        fillColor: this.options.styles.container.dragBackgourd,
        interactive: false,
        parent: this.dragContainer,
      });
      this.select(this.startClickPos, p);

      if(this.rootContent.scrollbar.isBottomEdge(p.y)) {
        this.rootContent.scrollbar.scrollByDiff(scrollSpeed);
      } else if(this.rootContent.scrollbar.isTopEdge(p.y)) {
        this.rootContent.scrollbar.scrollByDiff(-scrollSpeed);
      }
    });

    options.scene.root.on("onMouseUp", (e) => {
      var p = this.convertToContentPosition(e);
      this.lastClickPos = p;
      this.releaseMouse();
    });

    options.scene.root.on('onMouseDown', (e) => {
      this.isPressed = true;
      this.isMouseOut = false;
      var p = this.convertToContentPosition(e);
      this.startClickPos = p;
    });

    options.scene.root.on('onMouseLeave', (e) => {
      //TODO here need scroll content when mouse out of screen
      this.releaseMouse();
      this.isMouseOut = true;
    });

    options.scene.root.on('onMouseEnter', (e) => {
      this.isMouseOut = false;
    });

    options.scene.root.on("onKeyDown", (e) => {
      var code = e.keyCode;
      var flags = e.flags;

      var isPressedCtrl = keys.is_CTRL(flags) || keys.is_CMD(flags);
      if (isPressedCtrl && code === keys.A) {
        this.select({x: 0, y: 0}, {x: 0, y: this.rootContent.h});
      } else if (isPressedCtrl && code === keys.C) {
        if (this.firstItem.id >= 0 && this.lastItem.id >= 0) {
          this.copyToClipboard();
        }
      } else if (isPressedCtrl && code === keys.LEFT) {
        this.selectByKeyBoard('left');
      } else if (isPressedCtrl && code === keys.RIGHT) {
        this.selectByKeyBoard('right');
      } else if (isPressedCtrl && code === keys.UP) {

        if(this.keyEvent.type === BOTTOM_LINE) { // rollback
          this.keyEvent.times -= 1;
          this.selectByKeyBoard(BOTTOM_LINE, -1);
          if(this.keyEvent.times <= 0) {
            this.keyEvent.times = 0;
            this.keyEvent.type = '';
          }
        } else if(this.keyEvent.type === TOP_LINE) { // continuously press 
          this.keyEvent.times += 1;
          this.selectByKeyBoard(TOP_LINE);
        } else {
          this.keyEvent.type = TOP_LINE;
          this.keyEvent.times = 1;
          this.selectByKeyBoard(TOP_LINE);
        }


      } else if (isPressedCtrl && code === keys.DOWN) {

        // continuously press 
        if(this.keyEvent.type === BOTTOM_LINE) {
          this.keyEvent.times += 1;
          this.selectByKeyBoard(BOTTOM_LINE);
        } else if(this.keyEvent.type === TOP_LINE) { // rollback
          this.keyEvent.times -= 1;
          this.selectByKeyBoard(TOP_LINE, -1);
          if(this.keyEvent.times <= 0) {
            this.keyEvent.times = 0;
            this.keyEvent.type = '';
          }
        } else {
          this.keyEvent.times = 1;
          this.keyEvent.type = BOTTOM_LINE;
          this.selectByKeyBoard(BOTTOM_LINE);
        }
 
      } else if (isPressedCtrl && code === keys.HOME) {
        this.selectByKeyBoard('top');
      } else if (isPressedCtrl && code === keys.END) {
        this.selectByKeyBoard('bottom');
      }
    });


    setTimeout(() => { // ensure the listen invoke in last position
      this.options.emitter.on('onContainerResize', () => {
        this.containerResize();
      });
    }, 16);

    this.clearSelection();
    this.hideCursor();
  }

  /**
   * when container resize event trigge
   * here should redraw selection
   */
  TextSelector.prototype.containerResize = function () {
    this.clearSelection();
    this.hideCursor();

    // TODO here need reselection
  }

  /**
   * copy text to system clipboard
   */
  TextSelector.prototype.copyToClipboard = function () {
    this.options.scene.clipboardSet('PX_CLIP_STRING', this.selectText);
  }

  /**
   * mouse release event
   */
  TextSelector.prototype.releaseMouse = function () {
    this.keyEvent = {type:'', times:0};
    // just a simple click
    if (this.lastClickPos && this.startClickPos &&
      this.lastClickPos.x === this.startClickPos.x
      && this.lastClickPos.y === this.startClickPos.y
    )
    {
      this.clearSelection();
      this.simpleClick(this.lastClickPos);
    }

    this.isPressed = false;
    this.startClickPos = null;
    if (this.testRect) {
      this.testRect.remove();
    }
    this.testRect = null;
  }


  /**
   * convert root content position
   * @param e the mouse click event
   * @returns {{x: *, y: *}} the position
   */
  TextSelector.prototype.convertToContentPosition = function (e) {
    var rootContent = this.rootContent;
    return {
      x: e.x + rootContent.x + (e.target ? e.target.x : 0),
      y: Math.abs(rootContent.y) + e.y + (e.target ? e.target.y : 0)
    }
  }


  /**
   * select text by keyboard
   * @param type the keyboard type
   */
  TextSelector.prototype.selectByKeyBoard = function (type, step) {
    console.log('this.keyEvent', this.keyEvent);
    if (!this.cursorItem || this.cursorItem.id < 0) {
      return;
    }

    const lineIndex = this.findLine(this.cursorItem.id);
    if (lineIndex < 0) {
      return;
    }

    var diff = 5;
    var cursorPos = {
      x: this.cursor.x,
      y: this.cursor.y + this.cursorItem.t.pixelSize * 0.5,
    };

    switch (type) {
      case 'left': {
        var blocks = this.texts[lineIndex];
        const sp = this.getGlobalPosition(blocks[0]);
        var offset = -diff;
        if (blocks[blocks.length - 1].textId === this.cursorItem.id && this.cursorItem.pos === this.cursorItem.t.text.length) {
          offset = diff;
        }
        var y = sp.y + diff;
        this.select({x: sp.x, y: y + diff}, {x: this.cursorItem.x + offset, y: cursorPos.y + diff});
        break;
      }
      case 'right': {
        var blocks = this.texts[lineIndex];
        const sp = this.getGlobalPosition(blocks[blocks.length - 1]);
        var y = sp.y + diff;
        this.select({x: this.cursorItem.x, y: y}, {x: sp.x + sp.w + diff, y: y});
        break;
      }
      case 'top-line': {
        step = step || 1;

        var newIndex = lineIndex - step;
        if (newIndex < 0) { newIndex = 0; this.keyEvent.times -= 1;}
        if (newIndex >= this.texts.length) { newIndex = this.texts.length - 1; this.keyEvent.times -= 1; }

        var currentBlocks = this.texts[lineIndex];
        const sp = this.getGlobalPosition(this.texts[newIndex][0]);
        var item = this.lastItem.id >= 0 ? this.lastItem : this.cursorItem;
        const ep = this.getGlobalPosition(item.t);
        var offset = -diff;

        if (currentBlocks[currentBlocks.length - 1].textId === item.id 
          && item.pos === item.t.text.length
        ) {
          offset = diff;
        }

        if(this.keyEvent.times === 0) {
          var r = this.binarySearch(item.t.text, item.x - ep.x + item.t.pixelSize, item.t.font, item.t.pixelSize);
          this.clearSelection();
          this.simpleClick({x:ep.x + r[1], y: ep.y + diff});
        } else {
          this.select({x: sp.x, y: sp.y + diff}, 
            {x: item.x + (this.keyEvent.times <= 1 && step > 0 ? offset : 0), y: ep.y + diff});
          this.showCursor(sp.x, sp.y, sp.h);
          this.cursorItem = this.firstItem;
          this.rootContent.scrollbar.scrollTo(sp);
        }
        break;
      }
      case 'bottom-line': {
        step = step || 1;
        var newIndex = lineIndex + step;
        if (newIndex < 0) { newIndex = 0; this.keyEvent.times -= 1; }
        if (newIndex >= this.texts.length) { newIndex = this.texts.length - 1; this.keyEvent.times -= 1; }
        var blocks = this.texts[newIndex];

        const sp = this.getGlobalPosition(blocks[blocks.length - 1]);
        var item = this.firstItem.id < 0 ? this.cursorItem : this.firstItem;
        const ep = this.getGlobalPosition(item.t);
        if(this.keyEvent.times === 0) {
          this.cursorItem = this.firstItem;
          this.clearSelection();
          this.showCursor(this.cursorItem.x, ep.y, ep.h);
        } else {
          this.select({x: item.x, y: ep.y + diff}, {
            x: Math.max(sp.x + sp.w + diff, item.x),
            y: sp.y + diff
          });
          this.showCursor(sp.x + sp.w, sp.y, sp.h);
          this.cursorItem = this.lastItem;
          this.rootContent.scrollbar.scrollTo(sp);
        }
        break;
      }
      case 'top': {
        const ep = this.getGlobalPosition(this.cursorItem.t);
        this.select({x: 0, y: 0}, {x: cursorPos.x, y: ep.y + diff});
        break;
      }
      case 'bottom': {
        const ep = this.getGlobalPosition(this.cursorItem.t);
        this.select({x: this.cursorItem.x + diff, y: ep.y + diff}, {x: this.rootContent.w, y: this.rootContent.h});
        break;
      }
    }
  }

  TextSelector.prototype.simpleClick = function (e) {
    for (var i = 0; i < this.texts.length; i++) {
      var lineBlocks = this.texts[i];
      for (var j = 0; j < lineBlocks.length; j++) {
        var b = lineBlocks[j];
        var p = this.getGlobalPosition(b);
        if (p.x <= e.x && p.x + p.w >= e.x + b.pixelSize*0.6 && p.y <= e.y && p.y + p.h >= e.y) {
          var t = this.binarySearch(b.text, e.x - p.x, b.font, b.pixelSize);
          var tw = b.font.measureText(b.pixelSize, b.text).w;
          var leftWidth = tw - t[1];

          if(t[0] === b.text.length - 1 && e.x - p.x >= t[1] + leftWidth*0.5) {
            this.cursorItem = {id: b.textId, pos: b.text.length, x: p.x + tw, t: b};
            this.showCursor(p.x + tw, p.y, b.h);
          } else {
            this.cursorItem = {id: b.textId, pos: t[0], x: p.x + t[1], t: b};
            this.showCursor(p.x + t[1], p.y, b.h);
          }
          return;
        }
      }
    }
    this.hideCursor();
  }

  TextSelector.prototype.pushBlocks = function(blocks) {
    var r = [];
    if(blocks && blocks.length > 0) {
      blocks.forEach(b => {
        if(!b || !b.text || !b.font || b.isTableText) {
          return;
        }
        r.push(b);
      });
    }
    if(r.length > 0) {
      this.texts.push(r);
    }
  }

  /**
   * find the line of markdown
   * @param textId the text id
   * @returns {number} the line number index
   */
  TextSelector.prototype.findLine = function (textId) {
    for (var i = 0; i < this.texts.length; i++) {
      var lineBlocks = this.texts[i];
      for (var j = 0; j < lineBlocks.length; j++) {
        var b = lineBlocks[j];
        if (b.textId === textId) {
          return i;
        }
      }
    }
    return -1;
  }

  /**
   * hide text cursor
   */
  TextSelector.prototype.hideCursor = function () {
    this.cursorItem = null;
    this.cursor.a = 0;
  }

  /**
   * show mouse cursor
   * @param x the x
   * @param y the y
   * @param h the height
   */
  TextSelector.prototype.showCursor = function (x, y, h) {
    this.cursor.x = x - offsetX;
    this.cursor.y = y - offsetY;
    this.cursor.h = h;
    this.cursor.a = 1;
    this.animateCursor();
  }

  /**
   * play animation for cursor
   */
  TextSelector.prototype.animateCursor = function () {
    var scene = this.options.scene;
    this.cursor.animateTo({a: 0}, 0.5, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, scene.animation.COUNT_FOREVER);
  }

  /**
   * get global position for scroll content root
   * @param node the text node
   * @returns {{x: *, y: *, w: number, h: *, scrollbar: *}} the result
   */
  TextSelector.prototype.getGlobalPosition = function (node) {
    var x = node.x;
    var y = node.y;
    var parent = node.parent;

    while (parent && parent.name !== 'scroll-content') {
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

  /**
   * get or create select rect
   * @param rect the origin rect, maybe null
   * @returns {*} the rect
   */
  TextSelector.prototype.getSelectRect = function (rect) {
    if (rect) return rect;

    rect = this.options.scene.create({
      t: 'rect',
      fillColor: this.options.styles.container.selectionBackgroudColor,
      interactive: false,
      parent: this.container,
    })

    rect.isSelectRect = true;
    return rect;
  }

  /**
   * clear text selection
   */
  TextSelector.prototype.clearSelection = function () {
    var children = this.container.children;
    for (var i = 0; i < children.length; i++) {
      children[i].remove();
    }
    this.firstItem = {id: -1, pos: 0, x: 0, t: null};
    this.lastItem = {id: -1, pos: 0, x: 0, t: null};
    this.selectText = '';
  }

  /**
   * select text
   * @param sp the start position
   * @param ep the end position
   */
  TextSelector.prototype.select = function (sp, ep) {

    var now = Date.now();
    if (now - this.preSelectionTime < 60) {
      return;
    }
    this.preSelectionTime = now;

    this.clearSelection();

    var startPos = {x: Math.min(sp.x, ep.x), y: Math.min(sp.y, ep.y)};
    var endPos = {x: Math.max(sp.x, ep.x), y: Math.max(sp.y, ep.y)};
    var isNeedBreak = false;
    var firstItem = this.firstItem;
    var lastItem = this.lastItem;

    for (var i = 0; i < this.texts.length; i++) { // for each text block (maybe it is a line, or cell)
      var lineBlocks = this.texts[i];
      var selectRect = null;

      for (var j = 0; j < lineBlocks.length; j++) { // each block (rtText)
        var b = lineBlocks[j];
        var p = this.getGlobalPosition(b);
        b.gPos = p;

        if (startPos.y >= p.y + p.h || endPos.y < p.y) { // not in rect
          continue;
        }

        if (startPos.y <= p.y && firstItem.id < 0) { // full contain line, this is first
          firstItem = {id: b.textId, pos: 0, lx: 0, x: p.x, t: b};
          selectRect = this.getSelectRect(selectRect);
          selectRect.x = p.x - offsetX;
          selectRect.y = p.y - offsetY;
          selectRect.w = b.w;
          selectRect.h = b.h;
          this.selectText = b.text;
        }

        if (firstItem.id < 0 && p.x + p.w <= startPos.x) {
          continue;
        }


        var addedLength = 0;
        if (startPos.x >= p.x && p.x + p.w >= startPos.x && firstItem.id < 0) // top edge, split text
        {
          var t = this.binarySearch(b.text, startPos.x - p.x, b.font, b.pixelSize);
          firstItem = {id: b.textId, pos: t[0], lx: t[1], x: p.x + t[1], t: b};
          selectRect = this.getSelectRect(selectRect);
          selectRect.x = firstItem.x - offsetX;
          selectRect.y = p.y - offsetY;
          selectRect.w = b.w - t[1];
          selectRect.h = b.h;
          this.selectText = b.text.substr(t[0], b.text.length);
        } else { // normal

          this.selectText += b.text;
          addedLength = b.text.length;
          if (selectRect && b.textId !== firstItem.id) {
            selectRect.w += b.w;
          } else {
            selectRect = this.getSelectRect(selectRect);
            selectRect.x = p.x - offsetX;
            selectRect.y = p.y - offsetY;
            selectRect.w = b.w;
            selectRect.h = b.h;
          }
        }

        lastItem = {id: b.textId, pos: b.text.length, lx: p.w, x: p.x + p.w, t: b};


        if (endPos.x >= p.x && p.x + p.w >= endPos.x && endPos.y >= p.y && endPos.y <= p.y + p.h) { // last text item
          isNeedBreak = true;
          var t = this.binarySearch(b.text, endPos.x - p.x, b.font, b.pixelSize);
          // no matter is same first item or not
          selectRect = this.getSelectRect(selectRect);
          selectRect.w = t[1] + p.x - selectRect.x;
          lastItem = {id: b.textId, pos: t[0], lx: t[1], x: p.x + t[1], t: b};


          if (b.textId === firstItem.id) {
            this.selectText = b.text.substr(firstItem.pos, lastItem.pos - firstItem.pos + 1);
          } else {
            if (addedLength > 0) {
              this.selectText = this.selectText.substr(0, this.selectText.length - addedLength);
            }
            this.selectText += b.text.substr(0, lastItem.pos + 1);
          }
          break;
        }
      }
      if (isNeedBreak) {
        break;
      }
      if (this.selectText !== '') {
        this.selectText += NEW_LINE;
      }
    }

    this.firstItem = firstItem;
    this.lastItem = lastItem;

    if(this.isPressed && this.lastItem.id >= 0) {
      var pos = this.lastItem.t.gPos;
      this.showCursor(this.lastItem.x,pos.y,pos.h);
      this.cursorItem = this.lastItem;
    }
    this.selectText = this.selectText.replace(/\n+$/, "");
  }

  /**
   * search position from text
   * more details see here https://en.wikipedia.org/wiki/Binary_search_algorithm
   * @param array the string array
   * @param x the posotion in string
   * @param fontRes the font resource
   * @param pts the text font size
   * @returns {number[]} the string index and position
   */
  TextSelector.prototype.binarySearch = function (array, x, fontRes, pts) {
    var snip;
    var metrics;
    var pos_x = 0;

    var lo = -1, hi = array.length;
    while (1 + lo !== hi) {
      var mi = lo + ((hi - lo) >> 1);
      snip = array.slice(0, mi);
      metrics = fontRes.measureText(pts, snip);

      if (metrics.w > x) // Test
      {
        hi = mi;
      }
      else {
        pos_x = metrics.w;
        lo = mi;
      }
    }
    return [lo < 0 ? 0 : lo, pos_x];// metrics.w]; // return tuple
  }

  module.exports = TextSelector;
});



