/**
 * Created by tjcarroll2
 * on 2/27/16.
 */

px.import({scene:"px:scene.1.js", paramutils:"../utils/paramutils.js", Color:"../enums/colors.js",
           ui_enum:"../enums/ui_enums.js"}).then( function ready(imports) {

    var NavigationBar = function(params) {
      var direction = imports.paramutils.getParam(params,"direction","vertical");
      var alignment = imports.paramutils.getParam(params,"alignment","left");
      var buttons = imports.paramutils.getParam(params,"buttons",[]);
      var enabled = imports.paramutils.getParam(params,"enabled",true);
      var focusedColor = imports.paramutils.getParam(params,"focusedColor",imports.Color.YELLOW);
      var navbarWidth = imports.paramutils.getParam(params,"w",(direction==="vertical")?150:params.parent.w);
      var navbarHeight = imports.paramutils.getParam(params,"h",(direction==="vertical")?params.parent.h:30);
      var buttonElements = [];
      var focusedIndex = 0;
      var navbarName = "MyNavBar";

      var rectBg = imports.scene.create({t:"rect", x:params.x, y:params.y,
                            w:navbarWidth, h:navbarHeight,
                            class:params.class, parent:params.parent});

      if( direction === "vertical" ) {
        setupVertical();
      } else {
        setupHorizontal();
      }

      rectBg.on("onMouseEnter", function() {
        console.log("Entered content text");
        imports.scene.getRPCContext().execute("com.comcast.tutorial", "changeStatusText", ["Entered " + direction + " navigationbar"], null);
      });


      this.setEnabled = function(enabled) {
        for(var k=0; k < buttons.length; ++k) {
          buttonElements[k].setEnabled(enabled);
        }
      };

      function setupVertical() {
        var currentY = 30;
        var yOffset = 0;
        for(var k=0; k < buttons.length; ++k) {
          var button = imports.scene.create({t:"textButton", x:10, y:currentY+yOffset, label:buttons[k].label,
            //onSelection:buttons[k].onSelection,
            enabled:enabled, isFocused:k===focusedIndex, focusedColor:focusedColor,
            onFocus:{callback:onButtonFocus.bind(this),userContext:k},
            class:params.class, parent:rectBg});
          if( buttons[k].onSelection !== undefined && buttons[k].onSelection !== null ) {
            button.addSelectionListener(buttons[k].onSelection.callback, buttons[k].onSelection.userContext);
          }
          buttonElements.push(button);
          currentY += button.getHeight() + 15;
        }
      }

      function setupHorizontal() {
        var startX = 0;
        var currentX = startX;
        var currentY = 0;
        var yOffset = 0;
        var totalButtonWidth = 0;

        for(var k=0; k < buttons.length; ++k) {

          var button = imports.scene.create({t:"textButton", x:currentX, y:currentY+yOffset, label:buttons[k].label,
            //onSelection:buttons[k].onSelection,
            enabled:enabled, isFocused:k===focusedIndex, focusedColor:focusedColor,
            onFocus:{callback:onButtonFocus.bind(this),userContext:k},
            class:params.class, parent:rectBg});

          if( buttons[k].onSelection !== undefined && buttons[k].onSelection !== null ) {
            button.addSelectionListener(buttons[k].onSelection.callback, buttons[k].onSelection.userContext);
          }
          buttonElements.push(button);

          currentX += button.getWidth() + 15;
        }

        totalButtonWidth = (currentX - startX) - 15;
        xOffset = (1280-totalButtonWidth)/2;

        if( alignment === "center" ) {
          for(var k=0; k < buttons.length; ++k) {
            buttonElements[k].adjustX(xOffset);
          }

        }
      }

      function onButtonFocus(sourceContext, userContext) {
        if( sourceContext.focusType === imports.ui_enum.FocusType.SELECTION) {
          buttonElements[focusedIndex].setFocused(false, false);
          buttonElements[focusedIndex].setFocused(false);
          focusedIndex = userContext;
        } else {
          console.log("   HOVER focus");
        }
      }

    };

  module.exports = NavigationBar;

});