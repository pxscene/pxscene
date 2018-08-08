/*
   pxCore Copyright 2005-2017 John Robinson

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

px.import({
  scene: 'px:scene.1.js'
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var root  = imports.scene.root;

  var base    = px.getPackageBaseFilePath();
  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });

  var bg = scene.create({t:"rect", parent: root, x: 0, y: 0, w: 100, h: 100, fillColor: "#999", id: "Background"});

  var title = scene.create({t:"textBox", text: "", parent: bg, pixelSize: 15, w: 800, h: 80, x: 0, y: 0,
                alignHorizontal: scene.alignHorizontal.LEFT, interactive: false,
                alignVertical:     scene.alignVertical.CENTER, textColor: 0x000000AF, a: 1.0});

  var svgPath = null;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //    drawLogo
  //
  function drawTest()
  {
      var icon_w = 100;
      var icon_h = 100;

      var myPath = null;

     // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      var rect =  "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>"
                + "  <defs>"
                + "    <linearGradient id='myLinearGradient1' x1='0%' y1='0%' x2='0%' y2='100%'"
                + "                    spreadMethod='pad' gradientTransform='rotate(-45)'>"
                + "      <stop offset='0%'   stop-color='#aaaaaa' stop-opacity='1'/>"
                + "      <stop offset='100%' stop-color='#666666' stop-opacity='1'/>"
                + "    </linearGradient>"
                + "  </defs>"
                + "  <rect x='10' y='10' width='175' height='200'"
                + "     style='fill:url(#myLinearGradient1); stroke: #000000; stroke-width: 0;' />"
                + "</svg>"
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      var rrect =  "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>"
                 + "  <defs>"
                 + "    <linearGradient id='myLinearGradient1' x1='0%' y1='0%' x2='0%' y2='100%'"
                 + "                    spreadMethod='pad' gradientTransform='rotate(-45)'>"
                 + "      <stop offset='0%'   stop-color='#aaaaaa' stop-opacity='1'/>"
                 + "      <stop offset='100%' stop-color='#666666' stop-opacity='1'/>"
                 + "    </linearGradient>"
                 + "  </defs>"
                 + "  <rect x='10' y='10' width='100' height='100' rx='18' ry='18'"
                // + "     style='fill:url(#myLinearGradient1); stroke: #000000; stroke-width: 0;' />"
                 + "     style='fill:#888; stroke: #000000; stroke-width: 0;' />"
                 + "</svg>"

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      var circle1 =  "<svg width='100' height='100' viewBox='0 0 100 100'>"
                   + "  <circle cx='50' cy='50' r='40' fill='red' stroke='black' stroke-width= '3' />"
                   + "</svg>"
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      var circle2 =  "<svg width='300' height='300'>"
      + "  <defs>"
      + "    <linearGradient id='myLinearGradient1' x1='0%' y1='0%' x2='0%' y2='100%'"
      + "                    spreadMethod='pad' gradientTransform='rotate(-45)'>"
      + "      <stop offset='0%'   stop-color='#aaaaaa' stop-opacity='1'/>"
      + "      <stop offset='100%' stop-color='#666666' stop-opacity='1'/>"
      + "    </linearGradient>"
      + "  </defs>"
      + "   <circle cx='150' cy='150' r='100' "
    //  + "     style='fill:url(#myLinearGradient1); stroke: #000000; stroke-width: 0;' />"
  //  + "     style='fill:#888; stroke: #800; stroke-width: 6;' />"
    + "     style='fill:#888' />"
    + "</svg>"

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    var circle3 =  "<svg width='250' height='250'>"
    + "  <defs>"
    + "    <linearGradient id='myLinearGradient1' x1='0%' y1='0%' x2='0%' y2='100%'"
    + "                    spreadMethod='pad' gradientTransform='rotate(-45)'>"
    + "      <stop offset='0%'   stop-color='#aaaaaa' stop-opacity='1'/>"
    + "      <stop offset='100%' stop-color='#666666' stop-opacity='1'/>"
    + "    </linearGradient>"
    + "  </defs>"
    + "   <circle cx='125' cy='125' r='95' "
    + "     style='fill:url(#myLinearGradient1);'  />"
//    + "     style='fill:url(#myLinearGradient1); stroke: #000000; stroke-width: 0;' />"
    //  + "     style='fill:#888; stroke: #800; stroke-width: 6;' />"
  // + "     style='fill:#999' />"
  + "</svg>"

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  var circle4 =  "<svg width='350' height='350'>"
               + "    <circle cx='175' cy='175' r='105' style='fill:#777' />"
               + "</svg>";

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

      myPath = circle3;

      svgPath = scene.create( { t: "path", d: myPath, parent: root } );

      svgPath.ready.then( function(o)
      {
        svgPath.x = (bg.w - svgPath.w) /2;
        svgPath.y = (bg.h - svgPath.h) /2;

        svgPath.x = 10;
        svgPath.y = 10;

        title.text = "Draw Test";

        svgPath.painting = false;
      });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w,h)
  {
     bg.w = w;
     bg.h = h;

     title.x = 10;
     title.y = bg.h - title.h;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  scene.on("onResize", function(e) { updateSize(e.w, e.h); });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  Promise.all([ bg.ready, title.ready ])
      .catch( (err) =>
      {
          console.log("SVG >> Loading Assets ... err = " + err);
      })
      .then( (success, failure) =>
      {
          updateSize(scene.w, scene.h);

          drawTest();  // <<<<<< RUN !!!

          bg.focus = true;
      });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch( function importFailed(err){
  console.error("SVG >> Import failed: " + err);
});
