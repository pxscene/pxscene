/**
 * Created by tjcarroll2
 * on 2/27/16.
 */
px.import({buttons:"button2.js", NavigationBar:"navigationbar.js",
           pxSceneHeader:"pxscene_header.js"}).then( function ready(imports) {
  module.exports = {
    pxScenePageHeader:imports.pxSceneHeader,
    textButton:imports.buttons.TextButton,
    navbar:imports.NavigationBar
  }
});
