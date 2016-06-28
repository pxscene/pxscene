var remote = "https://diatrophy.github.io/pxComponents/"

px.configImport({"pxFramework:": remote});

px.import({
    scene           : "px:scene.1.js",
    pxMath          : 'pxFramework:pxMath.js',
    pxImageRenderer : 'pxFramework:image/pxImageRenderer.js',
    pxImageEffects  : 'pxFramework:image/pxImageEffects.js',
    pxAnimateEffects    : 'pxFramework:animate/pxAnimateEffects.js',
    pxImage         : 'pxFramework:image/pxImage.js',
    pxAnimate       : 'pxFramework:animate/pxAnimate.js'}).then( function importsAreReady(imports) {

    var scene     = imports.scene,
        pxImage   = imports.pxImage,
        pxImageRenderer = imports.pxImageRenderer(scene),
        pxImageEffects = imports.pxImageEffects,
        pxAnimate = imports.pxAnimate(scene),
        pxAnimateEffects = imports.pxAnimateEffects,
        randomInt = imports.pxMath().randomInt,
        root      = scene.root;

    var basePackageUri = px.getPackageBaseFilePath();

    // TODO - ideally some of these images may be generic enough that they can eventually live in the framework rather
    // than in the examples
    var bgUrl = basePackageUri+"/images/cork.png",
        bgDropShadowUrl = basePackageUri+"/images/radial_gradient.png",
        shadowUrl = basePackageUri+"/images/BlurRect.png"

    // first create the background cork board image
    var bgImage = pxImageRenderer.render(
                    pxImage({url:bgUrl,parent:root,stretchX:2,stretchY:2,w:scene.w,h:scene.h})
                      .addEffects(pxImageEffects().topShadow(bgDropShadowUrl))
                      )

    var photoUrl = basePackageUri+"/images/photos/"+ "IMG_4765.jpg"

    // first create the image definition ( here the x/y co-ordinate reflect the final location)
    var p1 = pxImage({url:photoUrl,parent:root,x:50,y:50,sx:0.10,sy:0.10})
                        .addEffects(pxImageEffects()
                          .polaroid(shadowUrl)
                          .topShadow(bgDropShadowUrl)
                          .dropShadow(shadowUrl)
                        )

    // then tell pxAnimate how to animate it
    pxAnimate.animate(p1,pxAnimateEffects().randomFlyIn())

}).catch( function(err){
    console.error("Error: " + err)
});
