px.import("px:scene.1.js").then( function ready(scene) {

  scene.defineStyle({t:"text"}, {textColor: 0xffff00ff, pixelSize: 32})
  scene.defineStyle({t:"text", class:"News"}, {textColor: 0x00ff00ff, pixelSize: 64})
  scene.defineStyle({t:"text", class:"News", id:"description"}, {textColor: 0x0000ffff, pixelSize: 48})

  // Create text style to match (t, id, and class) params
  scene.create({
    id:"description",         // example id for styling match
    t: "text",                // Element type will be text
    parent: scene.root,      // Parent element
    class:"News",             // example class for styling match
    text: "Hello, World!",    // the text
    x: 100, y: 100,           // position
    pixelSize:64              // font height
  });

  // Create text style to match (t and class) params
  scene.create({
    t: "text",                // Element type will be text
    class:"News",             // example class for styling match
    parent: scene.root,       // Parent element
    text: "Hello, World!",    // the text
    x: 100, y: 200            // position
  });


}).catch(function importFailed(err){
  console.error("Import failed for helloworld_style.js: " + err);
});
