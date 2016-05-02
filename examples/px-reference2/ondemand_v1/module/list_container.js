// Contains a list of items in a vertical layout with up/down navigation
// http://design.staging.xfinity.com/#/tv/lists

var ListContainer = function(scene, model) {

    var focusIndex = model.initialIndex;
    var bg = model.rect;
    var items = model.items;

    function next() {
        console.log("ListContainer#next   focusIndex=" + focusIndex + ", length=" + items.length);
        if (focusIndex < items.length - 1) {
            animateFrom(focusIndex);
            animateTo(++focusIndex);

            if (focusIndex > model.stickyIndex) {
                bg.animateTo({
                    y: -1 * (focusIndex - model.stickyIndex) * model.rowHeight
                }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
            }
        }
    }

    function previous(index) {
        console.log("ListContainer#next   focusIndex=" + focusIndex + ", length=" + items.length);
        if (focusIndex > 0) {
            animateFrom(focusIndex);
            animateTo(--focusIndex);
            
            if (focusIndex >= model.stickyIndex) {
                bg.animateTo({
                    y: -1 * (focusIndex - model.stickyIndex) * model.rowHeight
                }, model.animationSpeed, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
            }            
        }
    }

    function animateFrom(index) {
        items[index].blur();
    }

    function animateTo(index) {
        items[index].focus();
    }

    bg.on('onKeyDown', function(e) {
        console.log("ListContainer#onKeyDown: code=" + e.keyCode + ", flags=" + e.flags);
        if (e.keyCode === 40) {
            console.log("next()");
            next();
        } else if (e.keyCode === 38) {
            console.log("previous()");
            previous();
        }
    });

    // public methods
    return {
        focus: function() {
            //scene.setFocus(bg);
            bg.focus = true;
            animateTo(focusIndex);
        }
    }
}

module.exports = ListContainer;
