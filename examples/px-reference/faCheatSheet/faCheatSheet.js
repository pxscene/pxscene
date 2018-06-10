/*
   testAwesome - written by Hugh Fitzpatrick,  Copyright 2005-2017 John Robinson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/


console.log(" PATH: " + px.getPackageBaseFilePath() );

px.configImport({"faDict:" : px.getPackageBaseFilePath() + "/"});

px.import({  scene: 'px:scene.1.js',
              keys: 'px:tools.keys.js',
            faDict: 'faDict:fa-dictionary.js'
}).then( function importsAreReady(imports)
{
  module.exports.wantsClearscreen = function() 
  {
    return false; // skip clearscreen by framework... using opaque bg.
  };

  var scene   = imports.scene;
  var keys    = imports.keys;
  var root    = scene.root;

  var fa_dict = imports.faDict;
  var fa_keys = fa_dict.Keys();

  console.log("\n\nSHELL: getContextID: " + root.getScene );

 // var furl = "http://fontawesome.io/fonts/fontawesome-webfont.ttf";
  var furl = px.getPackageBaseFilePath() + "/fontawesome-webfont.ttf";

  var iconRes = scene.create({ t: "fontResource", url: furl }); 
  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });

  var bg = scene.create({ t: "rect", parent: root, fillColor: 0x000000FF, x: 0, y: 0, w:  800, h: 600 }); 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var title     = scene.create({ t: "text", parent: root,  text: "Font Awesome - CHEAT SHEET", x: 20, y:  0, textColor:0xEEEEEEff, pixelSize: 32});
  var caption   = scene.create({ t: "text", parent: root,  text: "777 glyphs",   x: 20, y: 40, textColor:0x888888ff, pixelSize: 16});
  var copy_help = scene.create({ t: "text", parent: root,  text: "CTRL-C / CMD-C to Copy Glyph code", x: 20, y: 60, textColor:0x888888ff, pixelSize: 14});
  var version   = scene.create({ t: "text", parent: title, text: "v 1.03", a: 0, x: 20, y: 60, textColor:0x888888ff, pixelSize: 12});

  caption.text  = "Glyph Count = " + fa_keys.length;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  var boxStructs = {};
  var boxObjects = [];
  var boxTargets;

  var shiftDown = false;
  var hoverBox;
  var fa_name;

  var highlight_color = 0xFFFF00ff;  // HIGHLIGHT

  var doMouseEnter = function(e)
  {
      hoverBox = e.target;

      hoverBox.moveToFront();

      var glyph = hoverBox.children[0];
      fa_name = glyph.id;

      p_glyph.text   = glyph.text;  // GLYPH
      p_name.text    = fa_name;     // NAME
      p_unicode.text = hoverBox.id; // VALUE

      glyph.textColor = highlight_color;

      hoverBox.cx = hoverBox.cy = (side / 2);
      hoverBox.animateTo({sx: 1.5, sy: 1.5}, 0.5, scene.animation.TWEEN_STOP).catch(() => {}); // SCALE UP
    };

  var doMouseLeave = function(e)
  {
      var glyph = e.target.children[0];
      var   box = boxStructs[glyph.id];

      if(box.selected === false)
      {
        glyph.textColor = 0xFFFFFFff; // restore
      }

      hoverBox.animateTo({sx: 1.0, sy: 1.0}, 0.25, scene.animation.TWEEN_STOP).catch(() => {}); // SCALE DN
  };

  var doMouseUp = function(e)
  {
      var glyph = e.target.children[0];
      var   box = boxStructs[glyph.id];

      var now     = Date.now();
      var diff_ms = now - box.lastClick;

      box.lastClick = now;

      if(diff_ms < 1500)
      {
        animateCopy();

        scene.clipboardSet('PX_CLIP_STRING', p_name.text + " " + p_unicode.text);
      }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var side  = 28;
  var pts   = 18;
  var inset = 5;

  var container = scene.create({ t: "object", parent: root, x: inset, y: 95, w: 1220, h: 800 });

  var xx = container.w / 2;
  var yy = container.h / 2;

  var glyphsReady = fa_keys.map(key => 
  {
      var val     = fa_dict[key];
      var metrics = iconRes.measureText(pts, val);
      var px      = (side - metrics.w)/2;

      // codePoint to HEX string
      var hexcode = (function()
      {
        var code = "" + val;
        var c = code.charCodeAt(0).toString(16).toUpperCase();
        return Array(4 - c.length + 1).join('0') + c;
      })();

      var boxed = scene.create({ t: "object", parent: container, x:  xx, y: yy, w: side, h: side, id: ("0x" + hexcode) });
      var glyph = scene.create({ t: "text",   parent: boxed,     x:  px, y:  0, font: iconRes, 
                                    text: val, id: key, textColor: 0xFFFFFFff, pixelSize: pts, interactive: false });
      // RESPONDERS
      boxed.on("onMouseEnter", doMouseEnter);
      boxed.on("onMouseLeave", doMouseLeave);
      boxed.on("onMouseUp",    doMouseUp);

      var box_data = {ui: glyph, key: key, value: ("0x" + hexcode), selected: false, lastClick: Date.now() };

      boxStructs[key] = box_data; // DATA

      return boxed.ready.catch(e => { return null; });
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Initial layout...
  Promise.all(glyphsReady).then(values =>
  {
    boxObjects = values;
    boxTargets = boxObjects.map(box => { return {x: -1, y: -1}; });

    layout();
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var layout = () => 
  {
    var px = 0; var py = 0; var rowHeight = 0;

    for (var i in boxObjects)
    {
      var o = boxObjects[i];
      var t = boxTargets[i];

      if (!o) continue;
      if (px + o.w > container.w)
      {
        px  = 0;
        py += side;
      }
      // TODO should we have an option to not cancel
      // animations if targets haven't changed
      if (t.x != px || t.y != py)
      {
        o.animateTo({x: px, y: py}, 1, scene.animation.TWEEN_STOP).catch(() => {});
        boxTargets[i].x = px;
        boxTargets[i].y = py;
      }
      px += o.w;
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var preview  = scene.create({ t: "object",  parent: root,                            x: container.w - 320, y: 10, w: 320, h: 60 });
  var p_frame1 = scene.create({ t: "rect",    parent: preview,  fillColor: 0xFFFFFFff, x:   0, y: 0, w:  60, h: 60 }); 
  var p_frame2 = scene.create({ t: "rect",    parent: preview,  fillColor: 0x888888ff, x:  60, y: 0, w: 260, h: 60, lineColor: 0xFFFFFFff, lineWidth: 10 }); 
  var p_glyph  = scene.create({ t: "textBox", parent: p_frame1, textColor: 0x000000ff, x:   7, y: 2, w:  60, h: 60, font: iconRes, text: "\uf170", pixelSize: pts * 2,
                  alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER });
                
  var p_name   = scene.create({ t: "textBox", parent: p_frame2, font: fontRes, text: "key", x: 3, y: -2,     w: 260, h: 50 , textColor:0x000000ff, pixelSize: 14,
                  alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER});

  var p_unicode = scene.create({ t: "textBox", parent: p_frame2, font: fontRes, text: "0x0000", x: 3, y: 15, w: 260, h: 50 , textColor:0x000000ff, pixelSize: 12,
                  alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER});

  var copiedText = scene.create({ t: "text",  parent: container, text: "Copied !", a:0,  x: 2000, y: 0, textColor:0xFFFF00ff, pixelSize: 32, sx: 0.5, sy: 0.5});
  var copied_w2 = 0;
  var copied_h2 = 0;

  function animateCopy()
  {
      var tt = 0.95;

      copiedText.x = hoverBox.x - (copied_w2) + 15;
      copiedText.y = hoverBox.y - (copied_h2/2);

      copiedText.sx = copiedText.sy = 0.5;
      copiedText.a  = 1.0;

      copiedText.moveToFront();

      copiedText.animateTo({ sx: 3.0, sy: 3.0, a: 0.0 }, tt, scene.animation.EASE_OUT_QUAD, scene.animation.OPTION_FASTFORWARD, 1)
        .then(
            function(o) {
              copiedText.x = 2000;
              copiedText.a = 0;
            }, // success
            function(o) {
            } // fail
      );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var assets = [container, iconRes, fontRes, preview, p_frame1, p_glyph];

  Promise.all(assets)
      .catch((err) => {
          console.log(">>> Loading Assets ... err = " + err);
      })
      .then((success, failure) => {

         var metrics = fontRes.measureText(copiedText.pixelSize, copiedText.text);

         copied_w2 = metrics.w / 2;
         copied_h2 = metrics.h / 2;

         copiedText.cx = copied_w2;
         copiedText.cy = copied_h2;

         updateSize( scene.getWidth(), scene.getHeight() );

         container.focus = true;
      });

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      container.on("onKeyUp", function (e) {

          if(keys.is_SHIFT(e.flags))
          {
            shiftDown = false;
          }
      });

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      container.on("onKeyDown", function (e) {
          var code  = e.keyCode;
          var flags = e.flags;

          if(keys.is_SHIFT(e.flags))
          {
            shiftDown = true;
          }

          switch (code) {
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              case keys.C:   // << CTRL + C
                  if (keys.is_CTRL(e.flags) || keys.is_CMD(e.flags) )  // ctrl Pressed also
                  {
                      animateCopy();

                      scene.clipboardSet('PX_CLIP_STRING', p_name.text + " " + p_unicode.text);
                  }
                  break;              
             // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              case keys.SPACE:   // << CTRL + C
                 // if (keys.is_SHIFT(e.flags) )  // shift Pressed also
                  {
                      console.log("onKeyDown ....   SPACE    fa_name:" + fa_name );

                      boxStructs[fa_name].ui.textColor = 0xFF0000ff;
                  }
                  break;
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          }//SWITCH
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w, h)
  {
    bg.w = w; 
    bg.h = h;

    container.w = w - (inset * 2);
    container.h = h - (inset * 2)  - 200; // title

    preview.x = w - preview.w - inset;

    var measure1 = fontRes.measureText(copy_help.pixelSize, copy_help.text);

    copy_help.x = w - measure1.w - 25;
    copy_help.y = h - measure1.h - 10;

    var metrics1 = fontRes.getFontMetrics(title.pixelSize);
    var measure2 = fontRes.measureText(title.pixelSize, title.text);

    version.x = measure2.w + 10;
    version.y = metrics1.baseline - 12;
    version.a = 1.0;
  }

  scene.on("onResize", function(e) {  updateSize(e.w,e.h); layout(); });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch(function importFailed(err){
   console.error("Import failed for testAwesome.js: " + err);
});