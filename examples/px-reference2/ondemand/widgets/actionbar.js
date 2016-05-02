/**
 * Created by tcarro004
 * on 8/10/15.
 */
"use strict";

px.import({
  RenderedComponent:'renderedcomponent.js',
  //app: '../framework/appcontext.js',
  ComponentViewPort:'componentviewport.js',
  KeyCodes:'../enums/keycodes.js',
  Animations:'Animations.js'
}).then(

function importsAreReady(imports) {
  var RenderedComponent = imports.RenderedComponent;
  //var app = imports.app;
  var ComponentViewPort = imports.ComponentViewPort;

  var KeyCode = imports.KeyCodes.KeyCode;
  var getKeyEnum = imports.KeyCodes.getKeyEnum;
  var AnimationEasing = imports.Animations.AnimationEasing;
  var AnimationType = imports.Animations.AnimationType;

  function ActionBar(params) {
    this.componentList = [];
    this.currentSelection = 0;
    this.topIndex = 0;
    this.topRule = null;
    this.bottomRule = null;
    this.topFocusRule = null;
    this.bottomFocusRule = null;
    this.scroller = null;
    RenderedComponent.call(this, params);
  }

  ActionBar.prototype = Object.create(RenderedComponent.prototype);
  ActionBar.prototype.constructor = ActionBar;

  ActionBar.prototype.initialize = function(params) {

   px.log.message(2, "Call ActionBar constructor");
///    RenderedComponent.call(this, params);
   px.log.message(2, "Back from call to ActionBar constructor");


  }

  ActionBar.prototype.addChild = function (component) {
    this.componentList.push(component);
  };

  ActionBar.prototype.setPxParent = function (pxParent) {
    this.pxParent = pxParent;
    if (this.mainPxElement != null && this.mainPxElement != "undefined") {
      //this.mainPxElement.parent = pxParent;
    }
  };


  ActionBar.prototype.getUnfocusedHeight = function () {
    return 45; //this.h;
  };

  // overridden
  ActionBar.prototype.layout = function (layoutParams) {
    console.log("TJC: ActionBar#layout");
    this.showObject("ActionBar layoutParams", layoutParams);
    var proposedWidth = this.getLayoutWidth(layoutParams,1280);
    console.log("TJC: ActionBar#layout3");
    console.log("TJC: ActionBar#layout - before horizontal layout.  proposedWidth=" + proposedWidth);
    this.horizontalLayout(layoutParams.scene)
    console.log("TJC: ActionBar#layout - after horizontal layout");
    this.topRule.w = proposedWidth;
    this.bottomRule.w = proposedWidth;
    this.setWidth( this.getLayoutWidth(layoutParams, 1280) );

  };

  ActionBar.prototype.render = function (renderContext) {
    console.log("TJC: ActionBar#render scene=" + renderContext.scene);

    this.w = this.getLayoutWidth({},1280);
    this.h = 45;

    if( this.scroller === null ) {
      var scene = renderContext.scene;
      var pxParent = renderContext.pxParent;

      this.scroller = new ComponentViewPort({scene:scene,w:this.w,h:this.h});
      this.scroller.setY(this.y);
      this.scroller.render(renderContext);
      var container = this.scroller.getPresentationContainer();
      this.mainPxElement = this.scroller.getMainPxElement();

      this.topRule = scene.create({'t':'rect',
        fillColor: Color.ALMOST_WHITE,
        x: this.x,
        y: this.y + 1,
        w: this.w,
        h: 1,
        parent: container
      });

      this.bottomRule = scene.create({'t':'rect',
        fillColor: Color.ALMOST_WHITE,
        x: this.x,
        y: this.y + this.h - 1,
        w: this.w,
        h: 1,
        parent: container
      });

      this.topFocusRule = scene.create({'t':'rect',
        fillColor: Color.ALMOST_WHITE,
        x: this.x,
        y: 1,
        w: 197,
        h: 3,
        parent: container
      });
      this.topFocusRule.visible = false;
      this.topFocusRule.draw = false;

      this.bottomFocusRule = scene.create({'t':'rect',
        fillColor: Color.ALMOST_WHITE,
        x: this.x,
        y:this.h - 4,
        w: 197,
        h: 3,
        parent: container
      });
      this.bottomFocusRule.visible = false;
      this.bottomFocusRule.draw = false;

      this.horizontalLayout(scene);

      container.on('onPreKeyDown', function (e) {
        px.log.message(2, "ActionBar[container] - preview keydown:" + e.keyCode);
        //e.stopPropagation();
      });

      container.on('onKeyDown', function (e) {
        px.log.message(2, "ActionBar[container] - on keydown:" + e.keyCode);
        //e.stopPropagation();
      });

      this.setFocusCurrentElement(false);
      ///scene.setFocus(container);
    }

  }

  ActionBar.prototype.horizontalLayout = function(scene) {
    var container = this.scroller.getPresentationContainer();
    var buttonGap = 35;

    // Render all the elements to determine size
    // New font metrics API might replace the need to render(?)
    console.log("TJC: ActionBar#horizontalLayout - this.w=" + this.w);
    var renderingParams = {scene:scene, pxParent:container, y:0, w:this.w, h: 35};
    for (var k = 0; k < this.componentList.length; ++k) {
      this.componentList[k].setPxParent(container);
      if (this.isFocused === true && k === this.currentSelection) {
        renderingParams.isFocused = true;
      } else {
        renderingParams.isFocused = false;
      }
      this.componentList[k].render(renderingParams);
    }

    // calculate width of all buttons
    var buttonSetWidth = 0;
    console.log("TJC: ActionBar#horizontalLayout - numButtons=" + this.componentList.length);
    for (var k = 0; k < this.componentList.length; ++k) {
      buttonSetWidth += this.componentList[k].w;
      console.log("TJC: ActionBar#horizontalLayout - buttonSetWidth=" + buttonSetWidth);
    }
    var numGaps = 0;
    if( this.componentList.length > 1) {
      numGaps = this.componentList.length - 1;
    }
    var desiredWidth = buttonSetWidth + (buttonGap*numGaps);

    var startX = 0;
    if( desiredWidth > this.w ) {
      // Need chevrons
    } else {
      startX = (this.w - desiredWidth)/2;
    }
    console.log("TJC: ActionBar#horizontalLayout - desiredWidth=" + desiredWidth);
    console.log("TJC: ActionBar#horizontalLayout - startX=" + startX);

    var nextX = startX;
    for (var k = 0; k < this.componentList.length; ++k) {
      //params.x = nextX;
      console.log("TJC: ActionBar#horizontalLayout - nextX=" + nextX);
      this.componentList[k].setX(nextX);
      this.componentList[k].setY(0);

      nextX += (this.componentList[k].w + buttonGap);
    }
    container.h = 35;
    console.log("TJC: ActionBar#horizontalLayout - done=" + nextX);

  }

  ActionBar.prototype.verticalLayout = function(params) {
    var container = this.scroller.getPresentationContainer();

    var nextY = 0;
    for (var k = 0; k < this.componentList.length; ++k) {
      var heighty = this.componentList[k].getUnfocusedHeight();
      var lineMargin = 4;
      if( typeof params == 'undefined' ) {
        params = {pxParent: container};
      }
      if (this.isFocused === true && k === this.currentSelection) {
        params.isFocused = true;
      } else {
        params.isFocused = false;
      }
      params.y = nextY;
      params.pxParent = container;
      this.componentList[k].setPxParent(container);
      this.componentList[k].setY(nextY);
      this.componentList[k].render(params);

      var unfocusedHeight = this.componentList[k].getUnfocusedHeight();
      nextY += unfocusedHeight;
      if (!this.scroller.isPartiallyVisible(this.componentList[k])) {
        this.componentList[k].unrender();
      } else {
      }
      var rect = this.scene.create({'t':'rect',fillColor: 0xffffffff, x: 0, y: nextY, w: this.w, h: 1, parent: container});
    }
    container.h = nextY;

  }

  ActionBar.prototype.setFocus = function (isFocused) {
    console.log("ActionBar#setFocus(" + isFocused + ")");
    this.isFocused = isFocused;
    this.setFocusCurrentElement(isFocused);

    this.topFocusRule.visible = false; //isFocused;
    this.bottomFocusRule.visible = false; //isFocused;
    this.topFocusRule.draw = isFocused;
    this.bottomFocusRule.draw = isFocused;
  }

  ActionBar.prototype.setFocusCurrentElement = function (isFocused) {
    if( typeof this.componentList[this.currentSelection] === 'undefined' ) {
      px.log.trace("No component yet");
    }
    if( isFocused ) {
      this.componentList[this.currentSelection].setFocusIndicators(this.topFocusRule, this.bottomFocusRule);
    } else {
      this.componentList[this.currentSelection].setFocusIndicators(null, null);
    }
    this.componentList[this.currentSelection].setFocus(isFocused);
  }

  ActionBar.prototype.handleKeyDown = function (keyEvent) {
    switch (keyEvent.keyCode) {
      case KeyCode.ENTER:
        var element = this.componentList[this.currentSelection];

        var vkey = getKeyEnum(keyEvent.keyCode);
        if (element.keyActionMap !== null && element.keyActionMap !== 'undefined' && element.keyActionMap.hasOwnProperty(vkey)) {
         px.log.message(2, "Handle ENTER key");
          //app.actionProcessor.processAction(element.keyActionMap[vkey]);
        }
        break;
      case KeyCode.DOWN:
        if (this.currentSelection != this.componentList.length - 1) {
          this.componentList[this.currentSelection].setFocus(false);
          ++this.currentSelection;
          var element = this.componentList[this.currentSelection];
         px.log.message(2, "selectedElement y=" + element.y);
          element.setFocus(true);
          this.componentList[this.currentSelection].render({scene:keyEvent.scene});
          // we've just focused an element.
          // let's see if the bottom edge of it is below the view port
          var y2 = element.y + element.h;
          var pby = this.scroller.getPresentationBottomY();
         px.log.message(2, "elementY=" + element.y + "y2=" + y2 + ", PresBottomY = " + pby);
          if (y2 > this.scroller.getPresentationBottomY()) {
           px.log.message(2, "\n");
            // Before we scroll up, render the element below the current one,
            // in case it becomes partially visible - this could be optimized
            if (this.currentSelection != this.componentList.length) {
              this.componentList[this.currentSelection + 1].render({scene:keyEvent.scene});
            }

            var prevTopElement = this.componentList[this.topIndex];
            if (this.scroller.isPartiallyVisible(prevTopElement)) {
             px.log.message(2, "Previous element still partially visible");
            }
            ++this.topIndex;
            var topElement = this.componentList[this.topIndex];
           px.log.message(2, "getUnfocusedHeight()=" + topElement.getUnfocusedHeight());
           px.log.message(2, "topElement.h= " + topElement.h);
            this.scroller.setTopY(topElement.y, function () {
              prevTopElement.unrender();
            });
           px.log.message(2, "topIndex=" + this.topIndex);
           px.log.message(2, "beyond bottom: " + topElement.y);
          }
        }
        break;
      case KeyCode.UP:
        if (this.currentSelection != 0) {
          var prevElement = this.componentList[this.currentSelection];
          prevElement.setFocus(false);
          --this.currentSelection;
          var element = this.componentList[this.currentSelection];
         px.log.message(2, "selectedElement y=" + element.y);
          element.setFocus(true);
          // we've just focused an element.
          // let's see if the top edge of it is above the view port
          var y2 = element.y + element.h;
          if (element.y < this.scroller.getPresentationTopY()) {
           px.log.message(2, "\n");
            var topElement = element;
            if (this.scroller.isPartiallyVisible(prevElement)) {
             px.log.message(2, "Previous element still partially visible");
            }
            for (var k = this.topIndex; k < this.componentList.lenth; ++k) {
              if (!this.scroller.isPartiallyVisible(this.componentList[k])) {
                this.componentList[k].unrender();
                break;
              }
            }
            //prevElement.unrender();
            topElement.render({scene:keyEvent.scene});
            --this.topIndex;
           px.log.message(2, "topIndex=" + this.topIndex);
            this.topIndex = this.currentSelection;
           px.log.message(2, "getUnfocusedHeight()=" + topElement.getUnfocusedHeight());
           px.log.message(2, "topElement.h= " + topElement.h);
            this.scroller.setTopY(topElement.y);
           px.log.message(2, "beyond top: " + topElement.y);
          }
        }
        break;
      case KeyCode.RIGHT:
        if (this.currentSelection != this.componentList.length - 1) {
          ///this.componentList[this.currentSelection].setFocus(false);
          this.setFocusCurrentElement(false);
          ++this.currentSelection;
          var element = this.componentList[this.currentSelection];
          px.log.message(2, "selectedElement y=" + element.y);
          ///element.setFocus(true);
          this.setFocusCurrentElement(true);
          this.componentList[this.currentSelection].render({scene:keyEvent.scene});
          // we've just focused an element.
          // let's see if the bottom edge of it is below the view port
          var x2 = element.x + element.w;
          var pby = this.scroller.getPresentationRightX();
          ///px.log.message(2, "elementY=" + element.y + "y2=" + y2 + ", PresBottomY = " + pby);
          if (x2 > this.scroller.getPresentationRightX()) {
            px.log.message(2, "\n");
            // Before we scroll up, render the element below the current one,
            // in case it becomes partially visible - this could be optimized
            if (this.currentSelection != this.componentList.length) {
              this.componentList[this.currentSelection + 1].render({scene:keyEvent.scene});
            }

            var prevTopElement = this.componentList[this.topIndex];
            if (this.scroller.isPartiallyVisible(prevTopElement)) {
              px.log.message(2, "Previous element still partially visible");
            }
            ++this.topIndex;
            var topElement = this.componentList[this.topIndex];
            ///px.log.message(2, "getUnfocusedHeight()=" + topElement.getUnfocusedHeight());
            ///px.log.message(2, "topElement.h= " + topElement.h);
            this.scroller.setTopX(topElement.x, function () {
              prevTopElement.unrender();
            });
            px.log.message(2, "topIndex=" + this.topIndex);
            px.log.message(2, "beyond bottom: " + topElement.x);
          }
        }
        break;
      case KeyCode.LEFT:
        if (this.currentSelection != 0) {
          var prevElement = this.componentList[this.currentSelection];
          ///prevElement.setFocus(false);
          this.setFocusCurrentElement(false);
          --this.currentSelection;
          var element = this.componentList[this.currentSelection];
          px.log.message(2, "selectedElement y=" + element.y);
          //element.setFocus(true);
          this.setFocusCurrentElement(true);
          // we've just focused an element.
          // let's see if the top edge of it is above the view port
          var y2 = element.y + element.h;
          if (element.y < this.scroller.getPresentationTopY()) {
            px.log.message(2, "\n");
            var topElement = element;
            if (this.scroller.isPartiallyVisible(prevElement)) {
              px.log.message(2, "Previous element still partially visible");
            }
            for (var k = this.topIndex; k < this.componentList.lenth; ++k) {
              if (!this.scroller.isPartiallyVisible(this.componentList[k])) {
                this.componentList[k].unrender();
                break;
              }
            }
            //prevElement.unrender();
            topElement.render({scene:keyEvent.scene});
            --this.topIndex;
            px.log.message(2, "topIndex=" + this.topIndex);
            this.topIndex = this.currentSelection;
            px.log.message(2, "getUnfocusedHeight()=" + topElement.getUnfocusedHeight());
            px.log.message(2, "topElement.h= " + topElement.h);
            this.scroller.setTopY(topElement.y);
            px.log.message(2, "beyond top: " + topElement.y);
          }
        }
        break;
    }
  }

  function walkThroughAncestors0(element) {
   px.log.message(2, "Element parent=" + element.parent);
    for(var key in element) {
     px.log.message(2, "prop[" + key + "]: " + element[key]);
    }
    while( typeof element.parent !== 'undefined' ) {
     px.log.message(2, "pelement=" + element.parent);
      element = element.parent;
    }
  }

  module.exports = ActionBar;

});

