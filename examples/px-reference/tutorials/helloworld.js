// scene is provided to the module when it is created
scene.create({
  t:"text",                // Element type will be text
  parent: scene.root,      // Parent element
  text:"Hello, World!",    // the text
  x:100, y:100,            // position
  textColor:0xff0000ff,    // RGBA - red text
  pixelSize:64});          // font height
