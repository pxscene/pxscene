/**
 * Scrollable block
 */
'use strict'


px.configImport({
  "components:" : px.getPackageBaseFilePath() + "/components/"
});

px.import({
  style: 'components:scrollable.style.js',
  keys: 'px:tools.keys.js'
}).then(function importsAreReady(imports) {

  var style = imports.style;
  var keys  = imports.keys;
  var EDGE_DIFF = 45;
  
  /**
   * Shows scrollbars if inner content too big
   *
   * Supports vertical scrollbars only
   *
   * @param {Object} scene  scene
   * @param {Object} parent parent
   * @param {Object} render additional args {blank:}
   */
  function Scrollable(scene, parent, args) {
    this.scene = scene;
    this.parent = parent;
    this.options = JSON.parse(JSON.stringify(style)); // deep clone
    this.args = args || {};
    this.isDragging = false;

    if(this.args.blank){ // ignore
      this.options.scrollbarStyle.w = 0;
      this.options.lineWidth = 0;
      this.options.scrollbarHandleStyle.w = 0;
      this.options.scrollbarHandleActiveStyle.w = 0;
    }
    this.mouseDownYStart;
    this.scrollbarHandleMargin = Math.round(
      (this.options.scrollbarStyle.w - this.options.scrollbarHandleStyle.w) / 2
    );

    this.container = scene.create(Object.assign({
      t: "rect",
      x: 0,
      y: 0,
      parent: parent,
      interactive: false,
    }, this.options.containerStyle));

    this.content = scene.create({
      t: "object",
      x: 0,
      y: 0,
      parent: this.container,
      interactive: false,
    });

    this.scrollbar = scene.create(Object.assign({
      t: "rect",
      y: 0,
      w: this.options.scrollbarStyle.w,
      parent: this.container,
    }, this.options.scrollbarStyle));

    this.scrollbarHandle = scene.create(Object.assign({
      t: "rect",
      parent: this.scrollbar,
      x: this.scrollbarHandleMargin,
      y: this.scrollbarHandleMargin,
      w: this.options.scrollbarStyle.w,
    }, this.options.scrollbarHandleStyle));

    // bind event handlers to the scope
    this.onMouseEnter       = this.onMouseEnter.bind(this);
    this.onMouseLeave       = this.onMouseLeave.bind(this);
    this.onMouseDown        = this.onMouseDown.bind(this);
    //this.onScrollWheel      = this.onScrollWheel.bind(this);

    this.onSceneMouseDown   = this.onSceneMouseDown.bind(this);
    this.onSceneMouseMove   = this.onSceneMouseMove.bind(this);
    this.onSceneScrollWheel = this.onSceneScrollWheel.bind(this);

    this.onSceneMouseUp = this.onSceneMouseUp.bind(this);
    this.update = this.update.bind(this);

    // attach events
    this.scrollbarHandle.on('onMouseEnter', this.onMouseEnter);
    this.scrollbarHandle.on('onMouseLeave', this.onMouseLeave);
    this.scrollbarHandle.on('onMouseDown', this.onMouseDown);
    this.scrollbar.on('onMouseUp', this.onScrollBarClick.bind(this));
    this.scene.on('onMouseDown', this.onSceneMouseDown);
    this.scene.on('onResize', this.update);

    this.scene.root.on('onScrollWheel', this.onSceneScrollWheel.bind(this));
    this.scene.root.on("onKeyDown", this.onKeyDown.bind(this));

    // expose this.content as a root for users of this class
    this.content.name = 'scroll-content';
    this.content.scrollbar = this;
    this.root = this.content;

    // calculate positions of all scrollbar elements
    this.update();
  }

  Scrollable.prototype.onKeyDown = function(e) {
    var code = e.keyCode; var flags = e.flags;
    // console.log("DEBUG: onKeyDown > [ " + e.keyCode + " ]   << No Key modifier");

    if(flags > 0) {
      return;
    }
    switch(code)
    {
      case keys.UP: {
        if(style.useArrowKeys)
        {
          this.scrollByDiff(-style.keyboardDiffHeight);
        }
        break;
      }

      case keys.DOWN: {
        if(style.useArrowKeys)
        {
          this.scrollByDiff(style.keyboardDiffHeight);
        }
        break;
      }
      case keys.PAGEUP: {
        if(style.usePageKeys)
        {
          this.scrollByDiff(-style.rowScrollHeight);
        }
        break;
      }

      case keys.PAGEDOWN: {
        if(style.usePageKeys)
        {
          this.scrollByDiff(style.rowScrollHeight);
        }
        break;
      }
    }
  }

  Scrollable.prototype.scrollByDiff = function(diff) {
    var currentY =  this.scrollbarHandle.y;
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;
    this.doScroll(currentY + diff, maxY);
  }

  Scrollable.prototype.isTopEdge = function(y) {
    return EDGE_DIFF > y + this.content.y;
  }

  Scrollable.prototype.isBottomEdge = function(y) {
    return EDGE_DIFF > this.parent.h - this.content.y - y;
  }

  Scrollable.prototype.getContentWidth = function() {
    return this.container.w - this.options.scrollbarStyle.w;
  }

  Scrollable.prototype.update = function() {
    this.container.w = this.parent.w;
    this.container.h = this.parent.h;

    this.content.w = this.container.w - this.options.scrollbarStyle.w;
    this.content.h = Math.max(this.container.h, this.content.h);

    var scrollDiff = this.content.h - this.container.h;

    this.content.y = Math.max(this.content.y, - scrollDiff);

    this.scrollbar.x = this.container.w - this.options.scrollbarStyle.w;
    this.scrollbar.h = this.container.h;

    this.scrollbarHandle.draw = scrollDiff;
    if (scrollDiff) {
      this.scrollbarHandle.h = (this.scrollbar.h - 2 * this.options.scrollbarStyle.lineWidth)
      * this.container.h / this.content.h;

      this.scrollbarHandle.y = this.clampScrollbarHandleY(
        - this.content.y / scrollDiff
        * (this.scrollbar.h - this.scrollbarHandle.h)
      );
    }
  }

  Scrollable.prototype.onMouseEnter = function() {
    Object.assign(this.scrollbarHandle, this.options.scrollbarHandleActiveStyle);
  }

  Scrollable.prototype.onMouseLeave = function() {
    Object.assign(this.scrollbarHandle, this.options.scrollbarHandleStyle);
  }

  Scrollable.prototype.onSceneMouseDown = function(evt) {
    this.mouseDownYStart = evt.y;
  }

  Scrollable.prototype.onMouseDown = function(e) {
    this.scene.on('onMouseMove', this.onSceneMouseMove);
    this.scene.on('onMouseUp', this.onSceneMouseUp);
    // we have to stop scrolling when mouse goes beyond scene
    // as we don't get events from beyond scene
    // so we cannot know if user releases the scrollbar handle outside of the scene

    // JRJR BUG BUG window mouse capture bug
    this.scene.on('onMouseLeave', this.onSceneMouseUp);
    this.isDragging = true; // think is draging
    // mouse down in scrollbar thumb don't let scrollbar track
    // get it
    e.stopPropagation()
  }

  Scrollable.prototype.onScrollBarClick = function(evt){
    if (evt.target != this.scrollbar)
      return
    var newY = Math.max(evt.y - this.scrollbarHandle.h*0.5, this.scrollbarHandleMargin);
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;
    this.doScroll(newY, maxY);
  }

  Scrollable.prototype.onSceneMouseMove = function(evt) {
    if (!this.isDragging)
      return;
    var newY = Math.max(this.scrollbarHandle.y + evt.y - this.mouseDownYStart, this.scrollbarHandleMargin);
    this.mouseDownYStart = evt.y;
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;
    this.doScroll(newY, maxY);
  }

  Scrollable.prototype.onSceneScrollWheel = function(evt) {
    this.isDragging = true; // think is dragging

    var currentY =  this.scrollbarHandle.y;
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;
  
    currentY = currentY-evt.dy

    // if an object can scroll consume the event.
    // Otherwise let it propogate naturally to see if a parent can
    // scroll
    if ((currentY > this.scrollbarHandleMargin && evt.dy > 0) || (currentY < maxY && evt.dy < 0)) {
      this.doScroll(currentY, maxY)
      evt.stopPropagation()
    }

  }

  // Get y in the content
  Scrollable.prototype.getYInContainer = function(object) {
    // check cache, if exists, return cached value directly
    if (object.yInContent !== undefined) {
      return object.yInContent;
    }
    var y = object.y;
    var parent = object.parent;
    while (parent && parent !== this.content) {
      y += parent.y;
      parent = parent.parent;
    }
    // Cache it to avoid unnecessary duplicated calculation
    object.yInContent = y;
    return y;
  }

  // Check if the object is not viewable
  Scrollable.prototype.isObjectViewable = function(object) {
    var yInContent = this.getYInContainer(object);
    var yInContainer = yInContent + this.content.y;
    return 0 < yInContainer && yInContainer + object.h < this.container.h;
  }

  // Scroll to object (if it's not viewable)
  Scrollable.prototype.scrollTo = function(object) {
    if (this.isObjectViewable(object)) {
      // If the object is viewable, then do nothing
      return;
    }
    // Otherwise, scroll to it.
    var scrollToY = 100 - this.getYInContainer(object);
    var scrollRate = scrollToY / (this.container.h - this.content.h);
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;
    var newY = scrollRate * maxY + this.scrollbarHandleMargin;
    this.doScroll(newY, maxY);
  }

  Scrollable.prototype.doScroll = function(newY, maxY) {
    newY = Math.max(0, newY);
    newY = Math.min(newY, maxY);
    this.scrollbarHandle.y = Math.max(2, newY);
    var scrollRate = (newY - this.scrollbarHandleMargin) / maxY;

  //  this.content.y = Math.min(0, - (this.content.h - this.container.h) * scrollRate);
    var newY = Math.min(0, - (this.content.h - this.container.h) * scrollRate);
    this.content.animate( { y: newY }, .30, this.scene.animation.TWEEN_LINEAR, this.scene.animation.OPTION_FASTFORWARD, 1);
  }

  Scrollable.prototype.onSceneMouseUp = function(e) {
    this.mouseDownYStart = null;
    var that = this;

    this.isDragging = false

    this.scene.delListener('onMouseMove', this.onSceneMouseMove);
    this.scene.delListener('onMouseUp', this.onSceneMouseUp);
    this.scene.delListener('onMouseLeave', this.onSceneMouseUp);    
  }

  Scrollable.prototype.clampScrollbarHandleY = function(y) {
    var minY = this.scrollbarHandleMargin;
    var maxY = this.scrollbar.h - this.scrollbarHandleMargin - this.scrollbarHandle.h;

    return Math.min(Math.max(y, minY), maxY);
  }

  module.exports.Scrollable = Scrollable;

}).catch(function importFailed(err) {
  console.error("Import failed: " + err);
});
