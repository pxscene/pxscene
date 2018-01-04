px.configImport({ "fishtank:": /*px.getPackageBaseFilePath() + */"fishtank/" });

px.import({ scene: 'px:scene.1.js',
   keys: 'px:tools.keys.js'
}).then(function importsAreReady(imports) {

   var url = "";
   var helpShown = false;

   var scene = imports.scene;
   var keys = imports.keys;
   var root = imports.scene.root;

   var myStretch = scene.stretch.STRETCH;

   var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });
   var basePackageUri = px.getPackageBaseFilePath();
   var bgURL = basePackageUri + "/images/background-flip2.jpg";
   var fishstripURL = basePackageUri + "/images/fishstrip.png";
   var bg = scene.create({ t: "image", parent: root, url: bgURL, stretchX: myStretch, stretchY: myStretch });
   var fishstrip = scene.create({ t: "image", parent: root, url: fishstripURL, stretchX: scene.stretch.NONE, stretchY: scene.stretch.NONE, draw: false });
   var numFish = 20;
   var fishW = 307;
   var fishH = 313;
   var fish = [];

   function createFish() {
      var newfish = scene.create({ t: "scene", parent: bg, clip: true, draw: true });
      var fishimg = scene.create({ t: "image", parent: newfish, url: fishstripURL, stretchX: scene.stretch.NONE, stretchY: scene.stretch.NONE, draw: true });
      newfish.species = Math.floor(Math.random() * 3);
      newfish.cell = 0;
      for (;;) {
         var angle = Math.PI * 2 * Math.random();
         newfish.xAngle = Math.cos(angle);
         newfish.yAngle = Math.sin(angle);
         if (Math.abs(newfish.xAngle) > 0.2 && Math.abs(newfish.yAngle) > 0.2) {
            break;
         }
      }
      newfish.flip = newfish.xAngle < 0 ? -1 : 1;
      newfish.velocity = 1 + Math.random() * 30;
      var scale = 0.1 + Math.random() * 0.5;
      newfish.scale = scale;
      newfish.zadj = 0.99 + Math.random() * 0.02;
      newfish.x = 100 + Math.floor(Math.random() * bg.w - 200);
      newfish.y = 100 + Math.floor(Math.random() * bg.h - 200);
      newfish.w = fishW;
      newfish.h = fishH;
      newfish.img = fishimg;
      newfish.img.x = -fishW * newfish.cell;
      newfish.img.y = -fishH * newfish.species;
      newfish.sx = newfish.scale * newfish.flip;
      newfish.sy = newfish.scale;
      fish.push(newfish);
   }
   function swim(f) {
      f.cell = (f.cell + 1) % 16;
      f.img.x = -fishW * f.cell;
      f.x += f.xAngle * f.velocity;
      f.y += f.yAngle * f.velocity;
      if (f.flip == 1 && f.x + f.w * f.scale > bg.w) {
         f.xAngle = -f.xAngle;
         f.x = bg.w;
      }
      if (f.flip == -1 && f.x - f.w * f.scale < 0) {
         f.xAngle = -f.xAngle;
         f.x = 0;
      }
      if (f.y < 0 || f.y + f.h * f.scale > bg.h) {
         f.yAngle = -f.yAngle;
         if (f.y < 0) f.y = 0;
         if (f.y + f.h * f.scale > bg.h) f.y = bg.h - f.h * f.scale;
      }
      f.flip = f.xAngle < 0 ? -1 : 1;
      f.scale *= f.zadj;
      if (f.scale > 1 || f.scale < 0.1) {
         f.zadj = 0.99 + 1.01 - f.zadj;
      }
      f.sx = f.scale * f.flip;
      f.sy = f.scale;
      setTimeout(function () {
         swim(f);
      }, 33);
   }

   //##################################################################################################################################

   function updateSize(w, h) {
      // console.log("Resizing...");
      bg.w = w;
      bg.h = h;
   }

   scene.root.on("onPreKeyDown", function (e) {});

   function showHelp(delay_ms) {}

   scene.root.on("onKeyDown", function (e) {
      var code = e.keyCode;var flags = e.flags;
      // console.log("onKeyDown fishtank.js  >> code: " + code + " key:" + keys.name(code) + " flags: " + flags);

      if (keys.is_CTRL_ALT(flags)) // CTRL-ALT keys !!
         {
            if (code == keys.R) //  CTRL-ALT-R
               {} else if (code == keys.A) //  CTRL-ALT-A
               {} else if (code == keys.H) //  CTRL-ALT-H
               {} else if (e.keyCode == keys.K) //  CTRL-ALT-K
               {}
         } else if (code == keys.ENTER) {} else {}
   });

   Promise.all([bg, fishstrip]).catch(function (err) {
      console.log(">>> Loading Assets ... err = " + err);
   }).then(function (success, failure) {
    updateSize(scene.w, scene.h);
      for (i = 0; i < numFish; ++i) {
         createFish();
         swim(fish[i]);
      }
   });
}).catch(function importFailed(err) {
   console.error("Import failed for fishtank.js: " + err);
});