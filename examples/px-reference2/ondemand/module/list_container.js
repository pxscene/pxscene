// Contains a list of items in a vertical layout with up/down navigation
// http://design.staging.xfinity.com/#/tv/lists

px.import({KeyCodes:"../enums/keycodes.js"}).then( function ready(imports) {
    var KeyCode = imports.KeyCodes.KeyCode;

    var ListContainer = function(scene, model) {

        var focusIndex = model.initialIndex;
        var bg = model.rect;
        var items = model.items;

        this.removeComponents = function() {
            for(var k = 0; k < items.length; ++k) {
                var item = items[k];
                item.removeComponents();
                items[k] = null;
            }

            console.log("Remove all bkg components");
            bg.removeAll();
        }

        function next() {
            console.log("ListContainer#next   focusIndex=" + focusIndex + ", length=" + items.length + ", stickyIndex=" + model.stickyIndex);
            if (focusIndex < items.length - 1) {
                animateFrom(focusIndex);
                animateTo(++focusIndex);

                if (focusIndex > model.stickyIndex) {

                    console.log("   ListContainer scroll bg to " + (-1 * (focusIndex - model.stickyIndex) * model.rowHeight));

                    bg.animateTo({
                        y: model.yOffset + -1 * (focusIndex - model.stickyIndex) * model.rowHeight
                    }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
                }
            }
        }

        function previous(index) {
            console.log("ListContainer#next   focusIndex=" + focusIndex + ", length=" + items.length + ", stickyIndex=" + model.stickyIndex);
            if (focusIndex > 0) {
                animateFrom(focusIndex);
                animateTo(--focusIndex);

                if (focusIndex >= model.stickyIndex) {

                    console.log("   ListContainer scroll bg to " + (-1 * (focusIndex - model.stickyIndex) * model.rowHeight));

                    bg.animateTo({
                        y: model.yOffset + -1 * (focusIndex - model.stickyIndex) * model.rowHeight
                    }, model.animationSpeed, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
                }

                return 1;
            } else {
                console.log("ListContainer#previous() --- no need to animate");
                return -1;
            }
        }

        function animateFrom(index) {
            items[index].blur();
        }

        function animateTo(index) {
            items[index].focus();
        }

        this.handleKeyDown = function(keyEvent) {
            console.log("ListContainer#handleKeyDown() - start");
            var rtnValue = -1;
            console.log("ListView:handleKeyDown(" + keyEvent + "): KeyCode.LEFT=" + KeyCode.LEFT);
            switch(keyEvent) {
                case KeyCode.LEFT:
                    console.log("   ListContainer LEFT");
                    items[focusIndex].handleKeyDown(keyEvent);
                    break;
                case KeyCode.RIGHT:
                    console.log("   ListContainer RIGHT");
                    items[focusIndex].handleKeyDown(keyEvent);
                    break;
                case KeyCode.UP:
                    console.log("   ListContainer UP");
                    console.log("ListContainer onKeyDown calling previous()");
                    rtnValue = previous();
                    break;
                case KeyCode.DOWN:
                    console.log("   ListContainer DOWN");
                    console.log("ListContainer onKeyDown calling next()");
                    next();
                    rtnValue = 1;
                    break;
            }

            return rtnValue;
        }

        bg.on('onKeyDown', function(e) {
            console.log("ListContainer#onKeyDown: code=" + e.keyCode + ", flags=" + e.flags);
            if (e.keyCode === 40) {
                console.log("ListContainer onKeyDown calling next()");
                next();
            } else if (e.keyCode === 38) {
                console.log("ListContainer onKeyDown calling previous()");
                previous();
            }
        });

        /*
        // public methods
        return {
            focus: function() {
                console.log("ListContainer#focus()");
                //scene.setFocus(bg);
    ///            bg.focus = true;
                animateTo(focusIndex);
            },
            blur: function() {
                console.log("ListContainer#blur()");
                //scene.setFocus(bg);
                ///            bg.focus = true;
                ///animateTo(focusIndex);
            }

        }
        */

        this.focus = function() {
            console.log("ListContainer#focus()");
            //scene.setFocus(bg);
            ///            bg.focus = true;
            animateTo(focusIndex);
        },
          this.blur = function() {
              console.log("ListContainer#blur()");
              //scene.setFocus(bg);
              ///            bg.focus = true;
              animateFrom(focusIndex);
          }
    }

    module.exports = ListContainer;
});