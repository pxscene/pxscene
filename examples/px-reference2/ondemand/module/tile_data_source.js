var TileDataSource = function(scene, color, model) {
    function showObject(obj) {
        console.log("      showObject:")
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                console.log("          obj." + prop + " = " + obj[prop]);
            }
        }
    }

    return {
        numTiles: function() {
            return model.length;
        },
        dimensionsForTileAtIndex: function(index) {
            return {
                w: model[index].width,
                h: model[index].height
            };
        },
        imageForTileAtIndex0: function(index, tile) {
            var w = model[index].width;
            var h = model[index].height;
            var url = model[index].imageUrl;
            return scene.create({
				        t:'image',
                parent: tile,
                x: (tile.w - model[index].width) / 2,
                y: (tile.h - model[index].height) / 2,
                url: url,
                yStretch: 1,
                xStretch: 1,cx:w/2,cy:h/2
            });
        },
        imageForTileAtIndex: function(index, tile) {
            var maskUrl = "http://www.pxscene.org/examples/px-reference/gallery/images/postermask2.png";
            var w = model[index].width;
            var h = model[index].height;
            var url = model[index].imageUrl;
            // tile background - failed image load
            ///var t = scene.create({t:"rect",y:top,parent:tile,w:w,h:h,cx:w/2,cy:h/2,ry:1,rz:0,fillColor:0x00000070});
            // tile image
            ///var ti = scene.create({t:"image",url:url,parent:tile, x:(tile.w - model[index].width) / 2,y: (tile.h - model[index].height) / 2,w:w,h:h,cx:w/2,cy:h/2});
            var ti = scene.create({t:"image",url:url,parent:tile, x:(tile.w - model[index].width) / 2,y: (tile.h - model[index].height) / 2,w:w,h:h,cx:w/2,cy:h/2,yStretch:1,xStretch:1});
            // reflection
            var tr = scene.create({t:"image",parent:ti,w:w,h:h,cx:w/2,cy:h, rx:1,rz:0,r:180});
            tr.a = 0;
            var tr2 = scene.create({t:"image",url:url,parent:tr,x:0,y:140,w:w,h:h,sx:1.0,sy:0.4, a:0.2, id:"image"});
            // reflection masking... big perf hit so flipped off for now
            //var trm = scene.create({t:"image",url:maskUrl,parent:tr,y:200,w:w,h:40,draw:false,mask:true});
            return ti;
        },
        infoForTileAtIndex: function(index, rect) {
            if (model[index].title) {
                scene.create({
					t:'text',
                    parent: rect,
                    y: 0,
                    textColor: color.ALMOST_WHITE,
                    text: model[index].title,
                    pixelSize: 22
                });
                scene.create({
					t:'text',
                    parent: rect,
                    textColor: color.ALMOST_WHITE,
                    y: 28,
                    text: 'Free (2015)',
                    pixelSize: 18
                });                
            }
        }
    }
}

module.exports = TileDataSource;
