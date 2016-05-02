/**
 * Created by tjcarroll2
 * on 2/22/16.
 */
px.import({scene:"px:scene.1.js"}).then( function ready(imports) {

  function FontStore(scene) {
    var theScene = scene;
    var fontResources = {};
    var fonts = {};

    var createFontResource = function (fontFile) {
      if (!fontResources.hasOwnProperty(fontFile)) {
        fontResources[fontFile] = theScene.create({t: "fontResource", url: fontFile});
      }

      return fontResources[fontFile];

    };

    this.getFontResource = function (fontFile) {
      return createFontResource(fontFile);
    };

    this.addFont = function (name, fontFile, fontSize, fontColor) {
      var fontResource = createFontResource(fontFile);
      fonts[name] = {font: fontResource, size: fontSize};
      if (fontColor !== undefined) {
        fonts[name].color = fontColor;
      }
    };

    this.getFontResourceByName = function (name) {
      if (!fonts.hasOwnProperty(name)) {
        return null;
      }

      return fonts[name].font;
    }

    this.getFontProperties = function (name) {
      if (!fonts.hasOwnProperty(name)) {
        return {font: null, size: 16, fontColor: 0xccccccff};
      }

      return fonts[name];
    }

    this.onLoadFinished = function (onReady, onFail) {
      var promises = [];
      var k = 0;
      for (var fontResourceKey in fontResources) {
        promises[k++] = fontResources[fontResourceKey].ready;
      }

      Promise.all(promises).then(onReady, onFail);
    };

  }

  module.exports = new FontStore(imports.scene);

});