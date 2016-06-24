px.configImport({"pxFramework:":"https://diatrophy.github.io/pxComponents/"});

px.import({
    scene           : "px:scene.1.js",
    pxMath          : 'pxFramework:pxMath.js',
    pxImageRenderer : 'pxFramework:image/pxImageRenderer.js',
    pxImageEffects  : 'pxFramework:image/pxImageEffects.js',
    pxImage         : 'pxFramework:image/pxImage.js'}).then( function importsAreReady(imports) {

    var scene     = imports.scene,
        pxImage   = imports.pxImage,
        pxImageRenderer = imports.pxImageRenderer(scene),
        pxImageEffects = imports.pxImageEffects,
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
    var photo = pxImage({url:photoUrl,parent:root,x:50,y:50,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  .polaroid(shadowUrl)
                  .topShadow(bgDropShadowUrl)
                  .dropShadow(shadowUrl)
                )
    var p1 = pxImageRenderer.render(photo)

    var photo2 = pxImage({url:photoUrl,parent:root,x:450,y:50,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  .polaroid(shadowUrl)
                  // .topShadow(bgDropShadowUrl)
                  .dropShadow(shadowUrl)
                )
    var p2 = pxImageRenderer.render(photo2)

    var photo3 = pxImage({url:photoUrl,parent:root,x:850,y:50,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  .polaroid(shadowUrl)
                  // .topShadow(bgDropShadowUrl)
                  // .dropShadow(shadowUrl)
                )
    var p3 = pxImageRenderer.render(photo3)

    var photo4 = pxImage({url:photoUrl,parent:root,x:50,y:380,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  // .polaroid(shadowUrl)
                  // .topShadow(bgDropShadowUrl)
                  // .dropShadow(shadowUrl)
                )
    var p4 = pxImageRenderer.render(photo4)

    var photo5 = pxImage({url:photoUrl,parent:root,x:450,y:380,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  // .polaroid(shadowUrl)
                  .topShadow(bgDropShadowUrl)
                  // .dropShadow(shadowUrl)
                )
    var p5 = pxImageRenderer.render(photo5)

    var photo6 = pxImage({url:photoUrl,parent:root,x:850,y:380,sx:0.10,sy:0.10})
                .addEffects(pxImageEffects()
                  // .polaroid(shadowUrl)
                  // .topShadow(bgDropShadowUrl)
                  .dropShadow(shadowUrl)
                )
    var p6 = pxImageRenderer.render(photo6)



}).catch( function(err){
    console.error("Error: " + err)
});
