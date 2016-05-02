// scene is provided to the module when it is created
px.import("px:scene.1.js").then( function ready(scene) {

  scene.create({
    t: "text",                // Element type will be text
    parent: scene.root,       // Parent element
    text: "Hello, World!",    // the text
    x: 100, y: 100,           // position
    textColor:0xff0000ff,     // RGBA - red text
    pixelSize:64              // font height
  });

}).catch(function importFailed(err){
    console.error("Import failed for helloworld.js: " + err);
});
