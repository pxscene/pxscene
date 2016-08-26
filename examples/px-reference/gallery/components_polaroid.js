// components_polaroid.js
//
// This example demonstrates a polaroid effect applied to two images
// The image on the left is scaled across its height and centered, while
// the image on the right is scaled across its width and centered. Both
// images are then cropped so that they fit into the polaroid effect.
//
// In the following case the WIDTH of the polaroid is a parameter
// because polaroid picture have a predifined top/side/bottom border ratio
//
// Example -
//
// .addEffects(uiImageEffects()
//                      .polaroid(450)
// 
// This demo also show-cases applying a shadow to a polaroid image, and 
// the ability to rotate images
//
// Jason Coelho

var remote    = "https://diatrophy.github.io/pxComponents/";
var localhost = "http://localhost:8090/";

px.configImport({"components:":remote});

px.import({
    scene           : "px:scene.1.js",
    uiMath          : 'components:math.js',
    uiImageRenderer : 'components:image/imageRenderer.js',
    uiImageEffects  : 'components:image/imageEffects.js',
    uiImage         : 'components:image/image.js'}).then( function importsAreReady(imports) {

    var scene           = imports.scene,
        uiImage         = imports.uiImage,
        uiImageRenderer = imports.uiImageRenderer(scene),
        uiImageEffects  = imports.uiImageEffects,
        randomInt       = imports.uiMath().randomInt,
        root      = scene.root;

    var basePackageUri = px.getPackageBaseFilePath();

    var bgUrl = basePackageUri+"/images/cork.png",
        bgDropShadowUrl = basePackageUri+"/images/radial_gradient.png",
        shadowUrl = basePackageUri+"/images/BlurRect.png";

    // first create the background cork board image
    var bgImage = uiImageRenderer.render(
                    uiImage({url:bgUrl,parent:root,stretchX:2,stretchY:2,w:scene.w,h:scene.h})
                      .addEffects(uiImageEffects()
                        ), function(bgImage){

        var photoUrl = basePackageUri+"/images/photos/"+ "IMG_4765.jpg";
        var photoUrl3 = "http://farm9.staticflickr.com/8812/28156824236_311618606c_b.jpg";

        var scale = 0.75
        // image rendered with polaroid, drop shadow and top shadow
        var p1 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:70,y:150,r:-15,sx:scale,sy:scale})
                    .addEffects(uiImageEffects()
                      .polaroid(650)
                      .dropShadow(shadowUrl,10)
                    ));

        var p2 = uiImageRenderer.render(uiImage({url:photoUrl3,parent:root,x:950,y:150, r:0, sx:scale,sy:scale})
                    .addEffects(uiImageEffects()
                      .polaroid(550)
                      .dropShadow(shadowUrl,10)
                    ));
    });

}).catch( function(err){
    console.error("Error: " + err);
});
