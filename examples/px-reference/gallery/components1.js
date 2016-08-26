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

var remote = "https://diatrophy.github.io/pxComponents/";
var localhost = "http://localhost:8090/";

px.configImport({ "components:": remote });

px.import({
  scene: "px:scene.1.js",
  uiMath: 'components:math.js',
  uiImageRenderer: 'components:image/imageRenderer.js',
  uiImageEffects: 'components:image/imageEffects.js',
  uiImage: 'components:image/image.js'
}).then(function importsAreReady(imports) {

  var scene = imports.scene,
    uiImage = imports.uiImage,
    uiImageRenderer = imports.uiImageRenderer(scene),
    uiImageEffects = imports.uiImageEffects,
    randomInt = imports.uiMath().randomInt,
    root = scene.root;

  var basePackageUri = px.getPackageBaseFilePath();

  // TODO - ideally some of these images may be generic enough that they can eventually live in the framework rather
  // than in the examples
  var bgUrl = basePackageUri + "/images/cork.png",
    bgDropShadowUrl = basePackageUri + "/images/radial_gradient.png",
    shadowUrl = basePackageUri + "/images/BlurRect.png";

  // first create the background cork board image
  var bgImage = uiImageRenderer.render(
    uiImage({ url: bgUrl, parent: root, stretchX: 2, stretchY: 2, w: scene.w, h: scene.h })
      .addEffects(uiImageEffects().topShadow(bgDropShadowUrl)), function (bgImage) {

        var photoUrl = basePackageUri + "/images/photos/" + "IMG_4765.jpg",
          polaroidWidth = 300

        // image rendered with polaroid, drop shadow and top shadow
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 50, y: 50 })
          .addEffects(uiImageEffects()
            .polaroid(polaroidWidth)
            .topShadow(bgDropShadowUrl)
            .dropShadow(shadowUrl)
          ));

        // image rendered with polaroid and shadow
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 450, y: 50 })
          .addEffects(uiImageEffects()
            .polaroid(polaroidWidth)
            .dropShadow(shadowUrl)
          ));

        // image rendered with polaroid effect
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 850, y: 50 })
          .addEffects(uiImageEffects()
            .polaroid(polaroidWidth)
          ));

        // image rendered with no effects
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 50, y: 480, w: 300, h: 300, stretchX: 1, stretchY: 1 })
          .addEffects(uiImageEffects()
          ));

        // image rendered with top shadow
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 450, y: 480, w: 300, h: 300, stretchX: 1, stretchY: 1 })
          .addEffects(uiImageEffects()
            .topShadow(bgDropShadowUrl)
          ));

        // image rendered with drop shadow
        uiImageRenderer.render(uiImage({ url: photoUrl, parent: root, x: 850, y: 480, w: 300, h: 300, stretchX: 1, stretchY: 1 })
          .addEffects(uiImageEffects()
            .dropShadow(shadowUrl)
          ));
      });

}).catch(function (err) {
  console.error(err.stack);
});
