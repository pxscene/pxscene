// components1.js
//
// This example show cases effects that can be applied to pxScene images
//
// The first row has the polaroid effect applied, with 3 different sizes.
// The first image had both a drop shadow and a top shadow effect.
//
// The second row has only drop shadow and top shadow effects applied
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

    // TODO - ideally some of these images may be generic enough that they can eventually live in the framework rather
    // than in the examples
    var bgUrl = basePackageUri+"/images/cork.png",
        bgDropShadowUrl = basePackageUri+"/images/radial_gradient.png",
        shadowUrl = basePackageUri+"/images/BlurRect.png";

    // first create the background cork board image
    var bgImage = uiImageRenderer.render(
                    uiImage({url:bgUrl,parent:root,stretchX:2,stretchY:2,w:scene.w,h:scene.h})
                      .addEffects(uiImageEffects()
                        // .topShadow(bgDropShadowUrl)
                        ), function(bgImage){

        var photoUrl = basePackageUri+"/images/photos/"+ "IMG_4765.jpg";

        // image rendered with polaroid of 300px width, drop shadow 10px and top shadow
        var p1 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:50,y:50,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                      .polaroid(300)
                      .topShadow(bgDropShadowUrl)
                      .dropShadow(shadowUrl,10)
                    ));

        // image rendered with polaroid width 250px and shadow 10px
        var p2 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:450,y:50,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                      .polaroid(250)
                      .dropShadow(shadowUrl,10)
                    ));

        // image rendered with polaroid effect with width 400px
        var p3 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:850,y:50,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                      .polaroid(400)
                    ));

        // image rendered with no effects
        var p4 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:50,y:580,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                    ));

        // image rendered with top shadow
        var p5 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:450,y:580,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                      .topShadow(bgDropShadowUrl)
                    ));

        // image rendered with drop shadow of 10px
        var p6 = uiImageRenderer.render(uiImage({url:photoUrl,parent:root,x:850,y:580,sx:0.10,sy:0.10})
                    .addEffects(uiImageEffects()
                      .dropShadow(shadowUrl,10)
                    ));
    });

}).catch( function(err){
    console.error("Error: " + err);
});
