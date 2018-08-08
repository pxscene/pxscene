
var files =   //  https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/
[
  "hackernews.svg", "flickr.svg", "facebook.svg", "tumblr.svg", "twitter.svg", "whatsapp.svg", 
  "dropbox.svg", "telegram.svg", "linkedin.svg", "stackoverflow.svg", "instagram.svg", 
  "wordpress.svg", "skype.svg", "reddit.svg", "pinterest.svg", "paypal.svg", "github.svg", 
  "wikipedia.svg", "vimeo.svg", "slideshare.svg", "soundcloud.svg", "spotify.svg", "snapchat.svg",
  "amazon.svg", "steam.svg", "google.svg", "google_plus.svg", "wechat.svg", "youtube.svg", "pdf.svg", 
  "vk.svg", "rss.svg", "mail.svg", "email.svg", "mastodon.svg", "wire.svg", "tox.svg", "gitlab.svg", 
  "phone.svg", "lock.svg", "html5.svg", "meetup.svg", "line.svg", "lastpass.svg", "windows.svg", 
  "digidentity.svg", "ubuntu.svg", "bitbucket.svg", "apple.svg", "npm.svg", "docker.svg", "symantec.svg", 
  "yubico.svg", "keybase.svg", "ebay.svg", "evernote.svg", "kickstarter.svg", "yahoo.svg", "bitcoin.svg", 
  "bluetooth.svg", "ibm.svg", "yammer.svg", "android.svg", "authy.svg", "blogger.svg", "cloudflare.svg", 
  "codepen.svg", "digitalocean.svg", "discord.svg", "medium.svg", "airbnb.svg", "wifi.svg", "delicious.svg", 
  "disqus.svg", "ghost.svg", "opensource.svg", "patreon.svg", "trello.svg", "intel.svg", "badoo.svg", 
  "samsunginternet.svg", "laravel.svg", "google_play.svg", "gmail.svg", "twilio.svg", "plex.svg", 
  "slack.svg", "xing.svg", "pinboard.svg", "internet_archive.svg", "baidu.svg", "twitch.svg", "ok.svg", 
  "pocket.svg", "stumbleupon.svg", "viber.svg", "buffer.svg", "apple_music.svg", "upwork.svg", 
  "calendar.svg", "workato.svg", "sketch.svg", "vlc.svg", "google_maps.svg", "access.svg", "ethereum.svg", 
  "opencast.svg", "stackexchange.svg", "qq.svg", "vegetarian.svg", "gogcom.svg"
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


  var base    = px.getPackageBaseFilePath();
  var fontRes = scene.create({ t: "fontResource", url: "FreeSans.ttf" });

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
  var prefix = 'https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/';
  
  var paused = false;

  // var max_w = 720;
  // var max_h = 720;
  
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

        var url = "" + prefix + file;
     //   var url = "https://raw.githubusercontent.com/edent/SuperTinyIcons/master/images/svg/access.svg"; //prefix + file;

        // *****************************************************************************
        //
        //             SVG using a "imageResource" with DIMENSIONS !!
        //
        svgRes = null;

        svgRes   = scene.create({ t: "imageResource", /*w: max_w, h: max_h*/ sx: 0.75, sy: 0.75,  url: url });
        svgImage.resource = svgRes;
        //
        // *****************************************************************************

        svgRes.ready.then(function(o)
        {
            svgImage.cx = svgImage.resource.w / 2;
            svgImage.cy = svgImage.resource.h / 2;

            console.log("SVG >> WxH " + svgImage.resource.w + " x " + svgImage.resource.h);

            // svgImage.sx = 1.0;
            // svgImage.sy = 1.0;

            svgImage.x = (bg.w - svgImage.resource.w) /2;
            svgImage.y = (bg.h - svgImage.resource.h) /2;

            title.text = "("+(index - 1)+" of "+files.length+")" + "  WxH: " + svgImage.resource.w + " x " + svgImage.resource.h + "    " + file ;

            setTimeout(drawLogo, 2200);  // NEXT !!!!
        },
        function(o) 
        {
          console.log("ERROR - moving on ... [" + url + "]");
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
