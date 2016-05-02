/**
 * Created by tcarro004
 * on 7/6/15.
 */
"use strict";

px.import({KeyCodes:'../enums/keycodes.js'}).then( function(imports) {
  var getVirtualKeyCode = imports.KeyCodes.getVirtualKeyCode;
  var KeyCode = imports.KeyCodes.KeyCode;


  function RenderedComponent(componentModel) {
    this.componentModel = componentModel;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.clip = false;
    this.scene = null;
    this.pxParent = null;
    this.isFocused = false;
    this.mainPxElement = null;
    this.listeners = {};

    // copy in any incoming parameters that match our expected set
    if (typeof componentModel != 'undefined') {
      for (var key in componentModel) {
        if (this.hasOwnProperty(key)) {
          if( key === 'x' || key === 'y' || key === 'w' || key === 'h' ) {
            console.log("TJC: [" + key + "]: " + componentModel[key] + " - " + (typeof componentModel[key]) );
            if( typeof componentModel[key] === 'number' ) {
              this[key] = componentModel[key];
            }
          } else {
            this[key] = componentModel[key];
          }
        }
      }

      // let's check some model defaults for dimensions
      if( !this.componentModel.hasOwnProperty('x') ) {
        this.componentModel['x'] = 0;
      }
      if( !this.componentModel.hasOwnProperty('y') ) {
        this.componentModel['y'] = 0;
      }
      if( !this.componentModel.hasOwnProperty('w') ) {
        this.componentModel['w'] = "parentWidth";
      }
      if( !this.componentModel.hasOwnProperty('h') ) {
        this.componentModel['h'] = "parentHeight";
      }
    } else {
      componentModel = {x:0, y:0, w:"parentWidth", h:"parentHeight"};
    }
  }

  function isDigit(c) {
  }

  RenderedComponent.prototype.getName = function() {
    if( typeof this.componentModel !== 'undefined'  && this.componentModel.hasOwnProperty('name')) {
      return this.componentModel.name;
    } else {
      return "";
    }
  }

  RenderedComponent.prototype.setFocus = function(isFocused) {
    console.log("TJC: RenderedComponent: calling setFocusCurrentElement(" + isFocused + ") on " + this);
    this.isFocused = isFocused;
    this.setFocusCurrentElement(isFocused);
  }


  RenderedComponent.prototype.getLayoutWidth = function(layoutParams, defaultValue) {
    this.showObject("RenderedComponent#getLayoutWidth layoutParams", layoutParams);

    return this.getLayoutValue('w', layoutParams, defaultValue);
    /*
    if (typeof this.componentModel != 'undefined') {
      if( this.componentModel.hasOwnProperty('w')) {
        var value = this.componentModel['w'];
        if( typeof value === 'number' ) {
          return value;
        } else if( layoutParams !== 'undefined' && layoutParams != null && layoutParams.hasOwnProperty(value)) {
          return layoutParams[value];
        }
      }
    }
    */

    return defaultValue;
  }

  //TODO - depending how this plays out getLayoutWidth and getLayoutHeight could share the same base code
  RenderedComponent.prototype.getLayoutHeight = function(layoutParams, defaultValue) {
    if (typeof this.componentModel != 'undefined') {
      if( this.componentModel.hasOwnProperty('h')) {
        var value = this.componentModel['h'];
        if( typeof value === 'number' ) {
          return value;
        } else if( layoutParams !== 'undefined' && layoutParams != null && layoutParams.hasOwnProperty(value)) {
          return layoutParams[value];
        }
      }
    }

    return defaultValue;
  }


  RenderedComponent.prototype.getLayoutValue = function(modelPropertyKey, layoutParams, defaultValue) {
    if (typeof this.componentModel != 'undefined') {
      if( this.componentModel.hasOwnProperty(modelPropertyKey)) {
        var value = this.componentModel[modelPropertyKey];
        console.log("TJC: getModelValue(" + modelPropertyKey + ") - value=" + value);
        if( typeof value === 'number' ) {
          return value;
        } else if( layoutParams !== 'undefined' && layoutParams != null && layoutParams.hasOwnProperty(value)) {
          return layoutParams[value];
        } else if( value === "parentWidth" ) {
          if( this.getMainPxElement() != null ) {
            //console.log("pxMainElement ")
            var parentWidth = this.getMainPxElement().parent.w;
            console.log("TJC: RenderedComponent parentWidth=" + parentWidth);
            if( typeof parentWidth === 'number' ) {
              return parentWidth;
            } else {
              console.log("parentWidth is not a number");
            }
          } else {
            console.log("RenderedComponent#getLayoutValue( - pxMainElement is NULL)");
          }
        }
      }
    }

    return defaultValue;
  }


  RenderedComponent.prototype.getMainPxElement = function () {
    return this.mainPxElement;
  }

  RenderedComponent.prototype.setX = function (x) {
    this.x = x;
    if (this.mainPxElement != null && this.mainPxElement != "undefined") {
      this.mainPxElement.x = x;
    }
  }

  RenderedComponent.prototype.setY = function (y) {
    this.y = y;
    if (this.mainPxElement != null && this.mainPxElement != "undefined" && typeof y === 'number') {
      this.mainPxElement.y = y;
    }
  }

  RenderedComponent.prototype.setWidth = function (w) {
    console.log("TJC: RenderedComponent#setWidth("+w+")");
    this.w = w;
    if (this.mainPxElement != null && this.mainPxElement != "undefined" && typeof w === 'number') {
      this.mainPxElement.w = w;
    }
  }

  RenderedComponent.prototype.setHeight = function (h) {
    this.h = h;
    if (this.mainPxElement != null && this.mainPxElement != "undefined" && typeof h === 'number') {
      this.mainPxElement.h = h;
    }
  }

  RenderedComponent.prototype.getPreferredGeom = function () {
    // overridden
    px.log.error("getPreferredGeom() not implemented for component: " + this.componentModel.name)
  };

  RenderedComponent.prototype.layout = function () {
    // overridden
    px.log.error("layout() not implemented for component: " + this.componentModel.name)
  };

  RenderedComponent.prototype.render = function () {
    // overridden
    px.log.error("render() not implemented for component: " + this.componentModel.name)
  };
  RenderedComponent.prototype.unrender = function () {
    // overridden
    px.log.error("unrender() not implemented for component: " + this.componentModel.name)
  };

  RenderedComponent.prototype.onDataUpdate = function () {
    // overridden
    px.log.error("onDataUpdate() not implemented for component: " + this.componentModel.name)
  };

  RenderedComponent.prototype.addResizeListener = function (callback, userdata) {
    if( typeof this.listeners.resize === 'undefined') {
      this.listeners.resize = [];
    }

    this.listeners.resize.push({callback:callback, userdata: userdata});
  };

  RenderedComponent.prototype.notifyResizeListeners = function() {
    if( typeof this.listeners.resize !== 'undefined') {
      for(var k=0; k < this.listeners.resize.length; ++k) {
        this.listeners.resize[k].callback(this,this.listeners.resize[k].userdata);
      }
    }
  }

  RenderedComponent.prototype.onKeyDown = function (callback) {
    console.log("TJC-- 100");

    if (this.mainPxElement != null) {
      this.mainPxElement.on('onKeyDown', function (e) {
        var virtualKeyCode = getVirtualKeyCode(e.keyCode, e.flags);
        e.virtualKeyCode = virtualKeyCode;
        callback(e);
      });
    }
    console.log("TJC-- 105");
  };


  RenderedComponent.prototype.showObject = function(name, obj) {
    console.log("      " + name + ":");
    if( obj === undefined || obj === null ) {
      console.log("       object is undefined");
      return;
    }
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        console.log("          prop." + prop + " = " + obj[prop]);
      }
    }
  }

  module.exports = RenderedComponent;

});
