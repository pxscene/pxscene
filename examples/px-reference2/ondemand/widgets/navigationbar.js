/**
 * Created by tjcarroll2
 * on 2/27/16.
 */

px.import({scene:"px:scene.1.js", paramutils:"../utils/paramutils.js", Color:"../enums/colors.js",
           ui_enum:"../enums/ui_enums.js", KeyCodes:"../enums/keycodes.js"}).then( function ready(imports) {

    var NavigationBar = function(params) {
      var KeyCode = imports.KeyCodes.KeyCode;
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

      function moveRight() {
        console.log("  navbar#moveRight() - start");
        console.log("  navbar#moveRight - focusedIndex=" + focusedIndex);
        console.log("  navbar#moveRight - buttonElements.length=" + buttonElements.length);
        if( focusedIndex < buttonElements.length-1 ) {
          console.log("   navbar moving right");
          //buttonElements[focusedIndex].setEnabled(true);
          //buttonElements[focusedIndex].setFocused(false, true);
          buttonElements[focusedIndex].unselect();
          ++focusedIndex;
          //buttonElements[focusedIndex].setEnabled(true);
          //buttonElements[focusedIndex].setFocused(true, true);
          buttonElements[focusedIndex].select();
        }
      }

      function moveLeft() {
        if( focusedIndex > 0 ) {
          console.log("   navbar moving left");
          //buttonElements[focusedIndex].setEnabled(true);
          //buttonElements[focusedIndex].setFocused(false, true);
          buttonElements[focusedIndex].unselect();
          --focusedIndex;
          //buttonElements[focusedIndex].setEnabled(true);
          //buttonElements[focusedIndex].setFocused(true, true);
          buttonElements[focusedIndex].select();
        }
      }

      this.handleKeyDown = function(keyEvent) {
        var rtnValue = -1;
        console.log("navbar:handleKeyDown(" + keyEvent + "): KeyCode.LEFT=" + KeyCode.LEFT);
        switch(keyEvent) {
          case KeyCode.LEFT:
            console.log("   navbar LEFT");
            moveLeft();
            rtnValue = 1;
            break;
          case KeyCode.RIGHT:
            console.log("   navbar RIGHT");
            console.log("     call moveRight");
            moveRight();
            rtnValue = 1;
            break;
          case KeyCode.UP:
            console.log("   navbar UP");
            break;
          case KeyCode.DOWN:
            console.log("   navbar DOWN");
            break;
        }

        return rtnValue;
      }

      rectBg.on("onMouseEnter", function() {
        console.log("Entered content text");
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
        var yOffset = 5;
        var totalButtonWidth = 0;
        var button_spacing = 32;

        imports.scene.create({t: 'rect', x: 0, y: 0, w: 1200, h: 1, fillColor: 0xffffffff, parent: rectBg});
        imports.scene.create({t: 'rect', x: 0, y: 36, w: 1200, h: 1, fillColor: 0xffffffff, parent: rectBg});


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

          currentX += button.getWidth() + button_spacing;
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
        console.log("\n\nNavigatorBar#onButtonFocus - focusType=" + sourceContext.focusType + ", isFocused=" + sourceContext.isFocused + ", index=" + userContext + ")");
        if( sourceContext.focusType === imports.ui_enum.FocusType.SELECTION) {
          if( sourceContext.event === "onMouseDown" ) {
            console.log("     ----- unfocus old item: old=" + focusedIndex);
            buttonElements[focusedIndex].setFocused(false, false);
          }
          focusedIndex = userContext;
          buttonElements[focusedIndex].setFocused(sourceContext.isFocused, true);
          //buttonElements[focusedIndex].setFocused(false);
        } else if(sourceContext.focusType === imports.ui_enum.FocusType.UNSELECTED) {
          focusedIndex = userContext;
          buttonElements[focusedIndex].setFocused(sourceContext.isFocused, true);
        } else {
          console.log("   HOVER focus");
        }
        console.log("   out of NavigatorBar#onButtonFocus");
      }

      this.focus = function() {
        buttonElements[focusedIndex].setEnabled(true);
        buttonElements[focusedIndex].setFocused(true, true);
      }

      this.blur = function() {
        console.log("NavigationBar#blur()");
        //buttonElements[focusedIndex].setEnabled(false);
        //buttonElements[focusedIndex].setFocused(false, true);
        buttonElements[focusedIndex].setEnabled(false);
      }

      this.visible = function(isVisible) {
        console.log("navbar#isVisible(" + isVisible + ")");
        if( isVisible ) {
          rectBg.a = 1;
        } else {
          rectBg.a = 0;
        }
      }

    };

  module.exports = NavigationBar;

});