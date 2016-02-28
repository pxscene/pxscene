/**
 * Created by tjcarroll2
 * on 2/27/16.
 */
px.import({scene:"px:scene.1.js", fontStore:"../utils/fontstore.js",
          Color:"../enums/colors.js"}).then( function ready(imports) {
  var fontStore = imports.fontStore;
  var Color = imports.Color;

  fontStore.addFont("ErrorFont", "http://54.146.54.142/tom/xre2/apps/receiver/fonts/XFINITYSansTT-New-Bold.ttf", 20, Color.RED);
  fontStore.addFont("NavBarTextFont", "http://54.146.54.142/tom/xre2/apps/receiver/fonts/XFINITYSansTT-New-Bold.ttf", 24, 0x235760ff);

  imports.scene.defineStyle({class:"Header"}, {
    textColor: fontStore.getFontProperties("NavBarTextFont").color,
    focusedColor:Color.YELLOW,
    pixelSize:24,   // fontStore.getFontProperties("NavBarTextFont").size,
    fillColor:0xc0c0c0ff, //0xfffffffff, //0x2c2c2ccc,
    font: fontStore.getFontResourceByName("NavBarTextFont")
  });

  imports.scene.defineStyle({class:"HeaderNavBar"}, {
    textColor: Color.WHITE, //fontStore.getFontProperties("NavBarTextFont").color,
    focusedColor:Color.GREEN,
    pixelSize:24,   // fontStore.getFontProperties("NavBarTextFont").size,
    fillColor:0x0c0c0cf0,  //0x2c2c2ccc,
    font: fontStore.getFontResourceByName("NavBarTextFont")
  });

  imports.scene.defineStyle({class:"NavBar"}, {
    textColor: fontStore.getFontProperties("NavBarTextFont").color,
    focusedColor:Color.YELLOW,
    pixelSize:24,   // fontStore.getFontProperties("NavBarTextFont").size,
    fillColor:0x3b92a1ff,  //0x2c2c2ccc,
    font: fontStore.getFontResourceByName("NavBarTextFont")
  });

  imports.scene.defineStyle({class:"Content"}, {
    textColor: fontStore.getFontProperties("NavBarTextFont").color,
    focusedColor:Color.YELLOW,
    pixelSize:24,   // fontStore.getFontProperties("NavBarTextFont").size,
    fillColor:0x2c2c2ccc, //0xfffffffff, //0x2c2c2ccc,
    font: fontStore.getFontResourceByName("NavBarTextFont")
  });

  module.exports = {
    setNavbarStyle:{},
    navbar:imports.NavigationBar
  }
});
