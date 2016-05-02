//"use strict";
var xyz = 100;

// TUTORIAL POINT
function domRPCMethod1(args) {
  console.log("TUTORIAL: domRPCMethod1 called");
}

px.import({scene:"px:scene.1.js", fontStore:"../utils/fontstore.js", Color:"../enums/colors.js",
  ui_enum:"../enums/ui_enums.js",
  customComponents:"../widgets/customcomponents.js",stylesheets:"../styles/stylesets.js"}).then( function ready(imports) {

  var overview = "The main purpose of this example is to demonstrate RPC calls from one scene to another.\n\n"
    + "This screen is composed of two scenes, the main scene is created when rpctest is loaded and the second one named rpcProviderScene which is created by rpctest."
    + "\n\nWhen you press one of the navigator buttons a RPC call will be made from the main scene to the rpcProviderScene."
    + " For this test the red colored text will change to indicate which button was pressed."

  var provider = "The RPC provider scene registers itself with pxscene system through the scene's RPC Context object that is"
    + " obtained through scene.getRPCContext().  Using the context it must register its fully qualified app name and any"
    +" method it wants to handle.  The scene can then listen for any incoming method calls using rpcContext.onRPCCall.  An example is shown below.\n\n"
    + "var rpcContext = scene.getRPCContext();\n"
    + "rpcContext.registerApp(\"com.comcast.rpcProviderScene\");\n"
    + "rpcContext.registerFunction(\"changeContent\", null);\n"
    + "rpcContext.onRPCCall( function(method, args) {\n    // your rpc method call handler goes here\n}";

  var client = "The RPC client scene registers itself with pxscene system through the scene's RPC Context object that is"
    + " obtained through scene.getRPCContext().  Using the context it must register its fully qualified app name. "
    +"  The scene can then listen for any incoming method calls using rpcContext.onRPCCall.  An example is shown below.\n\n"
    + "var rpcContext = scene.getRPCContext();\n"
    + "rpcContext.registerApp(\"com.comcast.rpcProviderScene\");\n"
    + "rpcContext.execute(\"com.comcast.rpcProviderScene\", \"changeContent\", [mySelectionContext],\n"
    + "        function (rtnValue) {\n          // your rpc method call return handler goes here\n        });";

  var contentText = {Overview:overview, Client:client, Provider:provider};

  var scene = imports.scene;
  var root = scene.root;
  var textElement;

  // TUTORIAL POINT
  var rpcContext = scene.getRPCContext();
  rpcContext.registerApp("com.comcast.rpcProviderScene");
  rpcContext.registerFunction("changeContent", null);
  rpcContext.onRPCCall( function(method, args) {
    console.log("TUTORIAL: onRPCCall(" + method + ", " + args + ")");
    if( method === "changeContent" ) {
       if( contentText.hasOwnProperty(args[0]) ) {
         console.log("   Change content");
         text2.text = contentText[args[0]];
       }
    }
    textElement.text = "\"" + args[0] + "\" was just received from a navbar";
    return {result:"ok"};
  });


  var bg = scene.create({
    t: "rect",
    x: 0,
    y: 0,
    w: scene.root.w,
    h: scene.root.h,
    class:"Content",
    parent:root
  });

  var text2 = scene.create({t: "textBox", clip: true, x: 30, y: 30, parent:bg});
  text2.h = scene.root.h-150;
  text2.w = scene.root.w-30;
  text2.textColor = imports.Color.WHITE;;
  text2.pixelSize = 21;
  text2.leading = 0;
  //text2.font = imports.fontStore.getFontProperties("ErrorFont").font;
  text2.alignHorizontal = imports.ui_enum.HorizontalAlignment.LEFT;
  text2.alignVertical = imports.ui_enum.HorizontalAlignment.TOP;
  text2.xStartPos = 0;
  text2.xStopPos = 0;
  text2.wordWrap = true;
  text2.ellipsis = true;
  text2.truncation = 1;
  text2.text = contentText["Overview"];

  text2.on("onMouseEnter", function() {
    console.log("Entered content text");
    imports.scene.getRPCContext().execute("com.comcast.tutorial", "changeStatusText", ["Entered content text area in rpcProviderScene"], null);
  });


  textElement = scene.create({
    t: "text",
    parent: bg,
    text: "Please click any navigation button",
    x: 80, y:scene.root.h - 120,
    textColor:0xc00000ff,
    pixelSize:48
  });


}).catch( function importFailed(err){
  console.error("Import failed for rpcProviderScene.js: " + err)
});

module.exports = xyz;




