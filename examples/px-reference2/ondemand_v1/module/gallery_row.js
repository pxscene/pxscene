
// Contains a row of uniformly sized tiles in a horizontal layout with left/right navigation
var GalleryRow = function(scene, model, source) {
    var FOCUS_BAR_HEIGHT = 3;
    var dwellTimerId;

    var focusIndex = model.initialIndex;

    var bg = model.rect;

    var title = scene.create({
		t:'text',
        parent: bg,
        x: 0,
        y: 0,
        textColor: model.titleColor,
        text: model.title,
        pixelSize: model.titleHeight
    });

    var numTiles = source.numTiles();

    var row = scene.create({
		    t:'rect',
        parent: bg,
        x: 0,
        y: 2 * model.titleHeight
    });

    var topFocusBar = scene.create({
        t:'rect',
        parent: row,
        x: 0,
        y: 0,
        w: 100,
        h: FOCUS_BAR_HEIGHT,
        fillColor:0xffffffff,
        lineColor:0xffffffff
    });
    topFocusBar.a = 0;

    var bottomFocusBar = scene.create({
        t:'rect',
        parent: row,
        x: 0,
        y: 120,
        w: 100,
        h: FOCUS_BAR_HEIGHT,
        fillColor:0xddddddff,
        lineColor:0xddddddff
    });
    bottomFocusBar.a = 0;

    var focusInfo;

    var tiles = [];
    
    var padding = model.padding ? model.padding : 16;

    for (var i = 0; i < numTiles; i++) {
        var tile = scene.create({
			      t:'rect',
            parent: row,
            x: i > 0 ? tiles[i - 1].x + tiles[i - 1].w + padding : padding,
            y: 0,
            w: source.dimensionsForTileAtIndex(i).w,
            h: source.dimensionsForTileAtIndex(i).h,
            fillColor: 0xffffff73
        });
        var image = source.imageForTileAtIndex(i, tile);

        tiles.push(tile);        
    }

    bg.on('onKeyDown', function(e) {
        console.log("onKeyDown: code=" + e.keyCode + ", flags=" + e.flags);
        if (e.keyCode === 39) {
            next();
        } else if (e.keyCode === 37) {
            previous();
        }
    });

    function next() {
        if (focusIndex < tiles.length - 1) {
            animateFrom(focusIndex);
            focusIndex = focusIndex + 1;
            animateTo(focusIndex);
            if (focusIndex > model.stickyIndex) {
                row.animateTo({
                    x: -1 * (focusIndex - model.stickyIndex) * tiles[focusIndex].w
                }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
            }
        }
    }

    function previous() {
        if (focusIndex > 0) {
            animateFrom(focusIndex);
            focusIndex = focusIndex - 1;
            animateTo(focusIndex);
            if (focusIndex >= model.stickyIndex) {
                row.animateTo({
                    x: -1 * (focusIndex - model.stickyIndex) * tiles[focusIndex].w
                }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
            }
        }
    }

    function animateFrom(i) {

        var index = i <= model.stickyIndex ? i : model.stickyIndex;

        topFocusBar.a = 0;
        bottomFocusBar.a = 0;

        tiles[i].children[0].children[0].a = 0.0;

        tiles[i].animateTo({
            sx: 1.0,
            sy: 1.0,
            cx: tiles[index].w / 2,
            cy: tiles[index].h / 2
        }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);

        topFocusBar.animateTo({
            sx: 1.0,
            sy: 1.0,
            cx: tiles[index].w / 2,
            cy: 3 / 2
        }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);

        if( focusInfo !== undefined ) {
            focusInfo.removeAll();
        }
    }

    function animateTo(i) {

        tiles[i].animateTo({
            sx: model.scaleFactor,
            sy: model.scaleFactor,
            cx: tiles[i].w / 2,
            cy: tiles[i].h / 2
        }, model.animationSpeed,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);

        tiles[i].moveToFront();

        var tileX = tiles[i].x - (tiles[i].w * (model.scaleFactor - 1)) /  2;
        var scaledTileHeight = tiles[i].h + (tiles[i].h * (model.scaleFactor - 1)) /  2;
        var deltaY = scaledTileHeight - tiles[i].h;

        topFocusBar.x = tileX;
        topFocusBar.y = tiles[i].y - (deltaY + FOCUS_BAR_HEIGHT); //tileY;
        topFocusBar.w = tiles[i].w + (tiles[i].w * (model.scaleFactor - 1));
        //topFocusBar.a = 1.0;

        topFocusBar.animateTo({a: 1.0}, model.animationSpeed+0.2,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);


            // show the info panel
        focusInfo = scene.create({
			      t:'rect',
            parent: row,
            x: tiles[i].x - (tiles[i].w * (model.scaleFactor - 1)) /  2,
            y: tiles[i].h + (tiles[i].h * (model.scaleFactor - 1)) /  2,
            w: tiles[i].w * 2,
            h: bg.h - (row.y + row.h),
            fillColor:0x00000000
        });
        source.infoForTileAtIndex(i, focusInfo);

        bottomFocusBar.x = tileX;
        bottomFocusBar.y = tiles[i].h + (tiles[i].h * (model.scaleFactor - 1)) /  2; //tiles[i].y - (deltaY) - 6 + scaledTileHeight; //tiles[i].h + (tiles[i].h * (model.scaleFactor - 1)) /  2; //scaledTileHeight+ 22;
        bottomFocusBar.w = tiles[i].w + (tiles[i].w * (model.scaleFactor - 1));
        bottomFocusBar.animateTo({a: 1.0}, model.animationSpeed+0.2,scene.animation.TWEEN_LINEAR, scene.animation.OPTION_OSCILLATE, 0);
        bottomFocusBar.moveToFront();

        tiles[i].children[0].children[0].a = 1.0;

    }

    //  public methods
    return {
        focus: function() {
            bg.focus = true;
            ///scene.setFocus(bg);
            animateTo(focusIndex);
        },

        blur: function() {
            animateFrom(focusIndex);
        }
    }
}

module.exports = GalleryRow;
