// components_animate.js
//
// This example demonstrates animating a polaroid image so that it fly's in
// to random location on the screen
//
// Example -
//
// uiAnimate.animate(p1,uiAnimateEffects().randomFlyIn(root.w,root.h));
//
// The components library determines the START and TARGET position
//
// Jason Coelho

var remote    = "https://diatrophy.github.io/pxComponents/";
var localhost = "http://localhost:8090/";

px.configImport({"components:": remote});

px.import({
    scene           : "px:scene.1.js",
    uiMath              : 'components:math.js',
    uiImageRenderer     : 'components:image/imageRenderer.js',
    uiImageEffects      : 'components:image/imageEffects.js',
    uiAnimateEffects    : 'components:animate/animateEffects.js',
    uiImage             : 'components:image/image.js',
    uiAnimate           : 'components:animate/animate.js'}).then( function importsAreReady(imports) {

    var scene     = imports.scene,
        uiImage             = imports.uiImage,
        uiImageRenderer     = imports.uiImageRenderer(scene),
        uiImageEffects      = imports.uiImageEffects,
        uiAnimate           = imports.uiAnimate(scene),
        uiAnimateEffects    = imports.uiAnimateEffects,
        randomInt           = imports.uiMath().randomInt,
        root      = scene.root;

    var basePackageUri = px.getPackageBaseFilePath();

    // TODO - ideally some of these images may be generic enough that they can eventually live in the framework rather
    // than in the examples
    var bgUrl = basePackageUri+"/images/cork.png",
        bgDropShadowUrl = basePackageUri+"/images/radial_gradient.png",
        shadowUrl = basePackageUri+"/images/BlurRect.png";

    // first create the background cork board image
    uiImageRenderer.render(uiImage({url:bgUrl,parent:root,stretchX:2,stretchY:2,w:scene.w,h:scene.h})
                      .addEffects(uiImageEffects().topShadow(bgDropShadowUrl)),
                      function(bgImage){

        var photoUrl = basePackageUri+"/images/photos/"+ "IMG_4765.jpg";

        // then create the image definition ( here the x/y co-ordinate reflect the final location)
        var p1 = uiImage({url:photoUrl,parent:root,x:550,y:50,sx:0.10,sy:0.10})
                            .addEffects(uiImageEffects()
                              .polaroid(650)
                              .topShadow(bgDropShadowUrl)
                              .dropShadow(shadowUrl,10)
                            );

        // then tell uiAnimate how to animate it
        uiAnimate.animate(p1,uiAnimateEffects().randomFlyIn(root.w,root.h));
    })

}).catch( function(err){
    console.error("Error: " + err);
});
