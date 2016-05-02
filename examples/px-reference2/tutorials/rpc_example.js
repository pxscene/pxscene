/**
 * Created by tjcarroll2
 * on 2/13/16.
 */

px.import({scene:"px:scene.1.js", fontStore:"utils/fontstore.js", Color:"enums/colors.js",
           customComponents:"widgets/customcomponents.js",stylesheets:"styles/stylesets.js"}).then( function ready(imports) {

  var scene = imports.scene;
  var fontStore = imports.fontStore;
  var Color = imports.Color;

  // Add custom component definitions so that they case be used with scene.create({t:<customType>
  scene.addComponentDefinitions(imports.customComponents);

  fontStore.onLoadFinished(function onReady() {
    // Successfully downloaded all fonts - now move on to create the scene
    init();
  },
  function onFontLoadingFailure() {
      console.error("rpc_example.js: One or more fonts failed to load");
  });

  function init() {
    var headerHeight = 125;
    var navbarWidth = 215;
    var statusBarHeight = 28;
    var statusText = null;

    // TUTORIAL POINT - RPC Initialization
    // set up the RPC app context and register the app with a fully qualified app name
    var rpcContext = scene.getRPCContext();
    rpcContext.registerApp("com.comcast.tutorial");
    rpcContext.registerFunction("changeStatusText", null);
    rpcContext.onRPCCall( function(method, args) {
      console.log("rpc_example: onRPCCall - method=" + method);
      if( method === "changeStatusText" ) {
        statusText.text = args[0];
      }
      return {result:"ok"};
    });

    var bg = scene.create({
      t: "rect",
      x: 0,
      y: 0,
      w: scene.root.w,
      h: scene.root.h,
      fillColor:imports.Color.WHITE,
      parent:scene.root
    });

      var header = scene.create({t:"pxScenePageHeader", h:headerHeight, parent:bg});

      var navbar = scene.create({t:"navbar", x:0, y:headerHeight, w:navbarWidth, direction:"vertical", enabled:false,
                                  class:"NavBar", parent:bg,
                                  buttons:[
                                    {label:"Overview", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"Overview"}},
                                    {label:"RPC Provider", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"Provider"}},
                                    {label:"Client RPC API", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"Client"}}
                                  ]
                                 });

    // create the content panel from a new app scene
    var content = scene.create({
      t: "scene", url: px.getPackageBaseFilePath() + "/" + "innerscenes/rpcProviderScene.js", parent:bg,
      x:navbarWidth, y:headerHeight,
      w:scene.root.w-navbarWidth, h: scene.root.h-headerHeight-statusBarHeight, clip: false
    });

    // draw a horizontal separator
    var line = imports.scene.create({t:"rect", x:0, y:headerHeight, w:scene.root.w, h:3, fillColor:0x808080ff, parent:bg});

    // draw a status background
    var status = imports.scene.create({t:"rect", x:0, y:scene.root.h-statusBarHeight, w:scene.root.w, h:statusBarHeight, fillColor:Color.BLACK, parent:bg});

    statusText = scene.create({
      t:"text",
      parent:status,
      text: "status",
      x: 20, y:0,
      textColor:Color.WHITE,
      pixelSize:18
    });


    // draw a horizontal separator
    line = imports.scene.create({t:"rect", x:0, y:scene.root.h-(statusBarHeight+1), w:scene.root.w, h:2, fillColor:0x808080ff, parent:bg});


    content.ready.then(function () {
      // when the content scene is ready then enable the navbar and header
      navbar.setEnabled(true);
      header.setEnabled(true);
      });


      function onNavButtonSelection(sourceContext, mySelectionContext) {
          // TUTORIAL SPOT
          rpcContext.execute("com.comcast.rpcProviderScene", "changeContent", [mySelectionContext], function (rtnValue) {
              console.log("TUTORIAL: got changeContent callback value: " + rtnValue);
              });
      }
  }

});
