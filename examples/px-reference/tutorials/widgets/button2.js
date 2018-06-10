/**
 * Created by tjcarroll2
 * on 2/27/16.
 */

px.import({scene:"px:scene.1.js", paramutils:"../utils/paramutils.js", FontStore:"../utils/fontstore.js",
           Color:"../enums/colors.js",
           ui_enum:"../enums/ui_enums.js", listener_utils:"../utils/listener_utils.js"}).then( function ready(imports) {

  var TextButton2 = function (params) {
    var scene = imports.scene;
    var Color = imports.Color;
    var x = params.x;
    var y = params.y;
    var label = params.label;
    var styleClass = params.class;
    var onSelectionCallback = params.onSelection;
    var onSelectionListeners = new imports.listener_utils.ListenerGroup();
    var userSelectionContext = params.userSelectionContext;
    var enabled = imports.paramutils.getParam(params,"enabled",true);
    var focused = imports.paramutils.getParam(params, "isFocused",false);
    var textFocusedColor = params.focusedColor;
    var textUnfocusedColor = params.textColor;
    var userContext = imports.paramutils.getParam(params, "userContext",null);
    var onFocusListeners = new imports.listener_utils.ListenerGroup();
    var _this = this;

    if( imports.paramutils.getParam(params, "onFocus", null) !== null ) {
      onFocusListeners.addListener(imports.paramutils.getParam(params, "onFocus", null).callback,
                                   imports.paramutils.getParam(params, "onFocus", null).userContext);
    }

    var bg = imports.scene.create({t:"rect", x:x, y:y, w:2, h:1, class:styleClass, parent:params.parent});

    var initialTextColor = enabled? params.focusedColor : Color.GRAY;

    var labelElement = imports.scene.create({t:"text", textColor:textFocusedColor, clip:true, parent:params.parent, x:x, y:y, class:styleClass, rx:0, ry:0, rz:0});

    var fontMetrics = labelElement.font.getFontMetrics(labelElement.pixelSize);
    var calcTextHeight = fontMetrics.ascent; // + fontMetrics.descent;
    var vWhitespace = fontMetrics.height - calcTextHeight;
    if( (vWhitespace%2) === 1 ) {
      vWhitespace += 1;
    }

    var boxHeight = fontMetrics.height; //calcTextHeight; //; + vWhitespace;
    var textVertOffset = 0;//-9; ///vWhitespace/2;
    var textHorizOffset = 0; //textVertOffset;

    labelElement.y += fontMetrics.naturalLeading/2;
    labelElement.h=-1;
    labelElement.w=-1;
    //labelElement.leading=0;
    labelElement.alignHorizontal=1;
    labelElement.alignVertical=0;
    labelElement.xStartPos=0;
    labelElement.xStopPos=0;
    labelElement.wordWrap=true;
    labelElement.ellipsis=true;
    labelElement.truncation=1;

    labelElement.text=label;

    //bg.h = fontMetrics.height;
    measurements = labelElement.font.measureText(labelElement.pixelSize, label);
    bg.w = measurements.w; // + 2*textHorizOffset;
    bg.h = boxHeight; //measurements.h;

    labelElement.on("onMouseDown", function() {
      if( enabled ) {
        labelElement.textColor = Color.WHITE;
        _this.setFocused(true);
        onSelectionListeners.callListeners({element:_this});
      }
    });

    labelElement.on("onMouseUp", function() {
      if( enabled ) {
        labelElement.textColor = textFocusedColor;
      }
    });

    labelElement.on("onMouseEnter", function() {
      if( enabled ) {
        onFocusListeners.callListeners({element:_this, focusType:imports.ui_enum.FocusType.HOVER, isFocused:true});
      }
    });

    labelElement.on("onMouseLeave", (function() {
      if( enabled ) {
          onFocusListeners.callListeners({element:_this, focusType:imports.ui_enum.FocusType.HOVER, isFocused:false});
      }
    }).bind(this));

    this.getHeight = function() {
      return boxHeight;
    }

    this.getWidth = function() {
      return bg.w;
    }

    this.adjustX = function(offset) {
      bg.x += offset;
      labelElement.x += offset;
    }

    this.setEnabled = function(isEnabled) {
      if( enabled != isEnabled ) {
        enabled = isEnabled;
        setButtonColor();
      }
    }

    this.setFocused = function(isFocused, doCallback) {
      if( isFocused != focused ) {
        focused = isFocused;
        setButtonColor();
        if( doCallback === undefined || doCallback === true ) {
          onFocusListeners.callListeners({element:this, focusType:imports.ui_enum.FocusType.SELECTION, isFocused:isFocused});
        }
      }
    }

    this.addSelectionListener = function(callback, userContext) {
      onSelectionListeners.addListener(callback, userContext);
    }

    this.addFocusListener = function(callback, userContext) {
      onFocusListeners.addListener(callback, userContext);
    }

    function setButtonColor() {
      if( enabled ) {
        var chosenColor = (focused === true)? textFocusedColor : textUnfocusedColor;
        labelElement.textColor = chosenColor;
      } else {
        labelElement.textColor = imports.Color.GRAY;
      }
    }

  }

  module.exports = {TextButton:TextButton2};

});
