var files =   //  https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/
[
   "410.svg", "AJ_Digital_Camera.svg", "DroidSans-Bold.svg", "DroidSans.svg", "DroidSansMono.svg",
   "DroidSerif-Bold.svg", "DroidSerif-BoldItalic.svg", "DroidSerif-Italic.svg", "DroidSerif-Regular.svg", 
   "Steps.svg", "USStates.svg", "aa.svg", "accessible.svg", "acid.svg", "adobe.svg", "alphachannel.svg", 
   "android.svg", "anim1.svg", "anim2.svg", "anim3.svg", "atom.svg", "basura.svg", "beacon.svg", 
   "betterplace.svg", "blocks_game.svg", "bloglines.svg", "bozo.svg", "bzr.svg", "bzrfeed.svg", 
   "ca.svg", "car.svg", "cartman.svg", "caution.svg", "cc.svg", "ch.svg", "check.svg", "circles1.svg", 
   "clippath.svg", "compass.svg", "compuserver_msn_Ford_Focus.svg", "copyleft.svg", "copyright.svg", 
   "couch.svg", "couchdb.svg", "cygwin.svg", "debian.svg", "decimal.svg", "dh.svg", "digg.svg", 
   "displayWebStats.svg", "dojo.svg", "dst.svg", "duck.svg", "duke.svg", "dukechain.svg", 
   "easypeasy.svg", "eee.svg", "eff.svg", "erlang.svg", "evol.svg", "facebook.svg", "faux-art.svg", 
   "fb.svg", "feed.svg", "feedsync.svg", "fsm.svg", "gallardo.svg", "gaussian1.svg", "gaussian2.svg", 
   "gaussian3.svg", "gcheck.svg", "genshi.svg", "git.svg", "gnome2.svg", "google.svg", "gpg.svg", 
   "gump-bench.svg", "heart.svg", "heliocentric.svg", "helloworld.svg", "hg0.svg", "http.svg", "ibm.svg", 
   "ie-lock.svg", "ielock.svg", "ietf.svg", "image.svg", "instiki.svg", "integral.svg", "intertwingly.svg", 
   "irony.svg", "italian-flag.svg", "iw.svg", "jabber.svg", "jquery.svg", "json.svg", "jsonatom.svg", 
   "juanmontoya_lingerie.svg", "legal.svg", "lineargradient1.svg", "lineargradient2.svg", "lineargradient3.svg", 
   "lineargradient4.svg", "m.svg", "mac.svg", "mail.svg", "mars.svg", "masking-path-04-b.svg", "mememe.svg", 
   "microformat.svg", "mono.svg", "moonlight.svg", "mouseEvents.svg", "mozilla.svg", "msft.svg", "msie.svg", 
   "mt.svg", "mudflap.svg", "myspace.svg", "mysvg.svg", "no.svg", "ny1.svg", "obama.svg", "odf.svg", 
   "open-clipart.svg", "openid.svg", "opensearch.svg", "openweb.svg", "opera.svg", "osa.svg", "oscon.svg", 
   "osi.svg", "padlock.svg", "patch.svg", "paths-data-08-t.svg", "paths-data-09-t.svg", "pdftk.svg", 
   "pencil.svg", "penrose-staircase.svg", "penrose-tiling.svg", "photos.svg", "php.svg", "poi.svg", 
  "preserveAspectRatio.svg", "pservers-grad-03-b-anim.svg", "pservers-grad-03-b.svg", "pull.svg", "python.svg", 
  "rack.svg", "radialgradient1.svg", "radialgradient2.svg", "rails.svg", "raleigh.svg", "rdf.svg", 
  "rectangles.svg", "rest.svg", "rfeed.svg", "rg1024_Presentation_with_girl.svg", "rg1024_Ufo_in_metalic_style.svg", 
  "rg1024_eggs.svg", "rg1024_green_grapes.svg", "rg1024_metal_effect.svg", "ruby.svg", "rubyforge.svg", 
  "scimitar-anim.svg", "scimitar.svg", "scion.svg", "semweb.svg", "shapes-polygon-01-t.svg", 
  "shapes-polyline-01-t.svg", "smile.svg", "snake.svg", "star.svg", "svg.svg", "svg2009.svg", 
  "svg_header-clean.svg", "sync.svg", "tiger.svg", "tommek_Car.svg", "twitter.svg", "ubuntu.svg", 
  "unicode-han.svg", "unicode.svg", "usaf.svg", "utensils.svg", "venus.svg", "video1.svg", "videos.svg", 
  "vmware.svg", "vnu.svg", "vote.svg", "w3c.svg", "whatwg.svg", "why.svg", "wii.svg", "wikimedia.svg", 
  "wireless.svg", "wp.svg", "wso2.svg", "x11.svg", "yadis.svg", "yahoo.svg", "yinyang.svg", "zillow.svg"
];

function randomIn(min, max)
{
   return  Math.floor(Math.random() * (max - min + 1)) + min;
}


px.import({ scene:      'px:scene.1.js',
             http:      'http',
             keys:      'px:tools.keys.js',
}).then( function importsAreReady(imports)
{
  var scene = imports.scene;
  var keys  = imports.keys;
  var root  = imports.scene.root;
  var http  = imports.http;

  var base  = px.getPackageBaseFilePath();

  var bg = scene.create({t:"rect", parent: root, x:  0, y: 0, w: 100, h: 100, fillColor: "#CCC", a: 1.0, id: "Background"});

  var title = scene.create({t:"textBox", text: "", parent: bg, pixelSize: 15, w: 800, h: 80, x: 0, y: 0,
                alignHorizontal: scene.alignHorizontal.LEFT, interactive: false,
                alignVertical:     scene.alignVertical.CENTER, textColor: 0x000000AF, a: 1.0});

  var svgRes   = null;
  var svgImage = scene.create({t:"image", parent:root});

  var startAtFile = randomIn(0, files.length) - 1;
  var file = "";

  var logo   = null;
  var index  = startAtFile;
  var prefix = 'http://dev.w3.org/SVG/tools/svgweb/samples/svg-files/';

  var paused = false;

  var max_w = 720;
  var max_h = 720;
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //    drawLogo
  //
  function drawLogo()
  {
        if(index >= files.length)
        {
            console.log("Looping\nLooping\nLooping\nLooping\n ");
            index = 0;
        }

        file = files[index++];

        console.log("Loading [ "+file+" ]  ("+(index - 1)+" of "+files.length+") ...");

        var url = prefix + file;

        // *****************************************************************************
        //
        //             SVG using a "imageResource" with DIMENSIONS !!
        //
        svgRes = null;

        svgRes   = scene.create({ t: "imageResource", w: max_w, h: max_h, url: url });
        //
        // *****************************************************************************

        svgRes.ready.then(function(o)
        {
            svgImage.resource = svgRes;
 
            svgImage.cx = svgRes.w / 2;
            svgImage.cy = svgRes.h / 2;

            console.log("SVG >> WxH " + svgRes.w + " x " + svgRes.h);
 
            svgImage.sx = 1.0;
            svgImage.sy = 1.0;

            svgImage.x = (bg.w - svgRes.w) /2;
            svgImage.y = (bg.h - svgRes.h) /2;

            title.text = "("+(index - 1)+" of "+files.length+")" + "  WxH: " + svgRes.w + " x " + svgRes.h + "    " + file ;

            setTimeout(drawLogo, 2200);  // NEXT !!!!
        },
        function(o) 
        {
          console.log("ERROR - moving on ...");
          setTimeout(drawLogo, 2500);  // NEXT !!!!
        });

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateSize(w,h)
  {
     bg.w = w;
     bg.h = h;

     title.x = 10;
     title.y = bg.h - title.h;

     max_w = (w < h) ? w : h; // MIN
     max_h = max_w;
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

          drawLogo();  // <<<<<< RUN !!!

          bg.focus = true;
      });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).catch( function importFailed(err){
  console.error("SVG >> Import failed for LogosSVG.js: " + err);
});
