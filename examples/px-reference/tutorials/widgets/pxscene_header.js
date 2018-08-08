/**
 * Created by tjcarroll2
 * on 2/13/16.
 */

px.import({scene:"px:scene.1.js", fontStore:"../utils/fontstore.js", Color:"../enums/colors.js",
           }).then( function ready(imports) {

  function pxSceneHeader(params) {
    var scene = imports.scene;
    var fontStore = imports.fontStore;
    var Color = imports.Color;

    var bg = imports.scene.create({
      t: "rect",
      x: 0,
      y: 0,
      w: scene.root.w,
      h: params.h,
      class:"Header",
      parent:params.parent
    });

    var navbar = scene.create({t:"navbar", x:0, y:0, w:scene.root.w, h:30, direction:"horizontal", alignment:"center", enabled:false, class:"HeaderNavBar", parent:bg,
      buttons:[
        {label:"Click", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"<click>"}},
        {label:"Hit", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"<hit>"}},
        {label:"Press", onSelection:{callback:onNavButtonSelection.bind(this), userContext:"<press>"}}
      ]
    });

    picture = scene.create({t:"image",parent:bg, x:10, y:35,
      url:px.getPackageBaseFilePath() + "/images/pxscene_logo_50perc.png", parent:bg}
      );

    // draw a vertical separator
    imports.scene.create({t:"rect", x:214, y:32, w:2, h:params.h-30-2*2, fillColor:0x808080ff, parent:bg});

    // draw status text
    imports.scene.create({t:"text", parent:bg, x:230, y:50, textColor:0x040081ff, text:"Sample - RPC calls from scene to scene", pixelSize:36});

    this.setEnabled = function(enabled) {
      navbar.setEnabled(enabled);
    };

    function onNavButtonSelection(sourceContext, mySelectionContext) {
      // TUTORIAL POINT
      scene.getRPCContext().execute("com.comcast.rpcProviderScene", "changeContent", [mySelectionContext], function (rtnValue) {
        console.log("TUTORIAL: got changeContent callback value: " + rtnValue);
      });


      bg.on("onMouseEnter", function() {
        console.log("Entered header");
        imports.scene.getRPCContext().execute("com.comcast.tutorial", "changeStatusText", ["Entered pxscene_header"], null);
      });

      br.on("onMouseLeave", function() {
        console.log("Left header");
      });


    }
  }


  module.exports = pxSceneHeader;
});
