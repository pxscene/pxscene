/*

tested with PX051AEI_VBN_master_20180401231659sdy_DSY_NG
by moving this and rdkmediaplayer_api.js to /home/root
then running these commands -

export WAYLAND_APPS_CONFIG=/home/root/waylandregistryreceiver.conf
export XDG_RUNTIME_DIR=/tmp
killall -9 runAppManager.sh
./pxscene test_rdkmediaplayer.js

other m3u8 links to try are -
http://69.252.103.215/scratch/test.m3u8
https://xtvapi.cloudtv.comcast.net/recording/V6184936945826443811L200584520123010018/stream.m3u8
http://ccr.linear-nat-pil-red.xcr.comcast.net/DSCHD_HD_NAT_16122_0_5965163366898931163-eac3.m3u8
http://ccr.linear-nat-pil-red.xcr.comcast.net/BBCAM_HD_NAT_18399_0_8519783297380464163.m3u8
http://ccr.cdvr-vin2.xcr.comcast.net/V6184936945826443811L200644901013040017.m3u8
http://ccr.linear-nat-pil-red.xcr.comcast.net/BBCAM_HD_NAT_18399_0_8519783297380464163.m3u8
http://edge.ip-eas-dns.xcr.comcast.net/ZCZC-PEP-NPT-000000-0030-2701820-/en-US.m3u8

*/


//"use strict";
px.import(
{
    scene:"px:scene.1.js",
    keys: "px:tools.keys.js"
}).then( function ready(imports) {

var scene = imports.scene;
var keys = imports.keys;
var root = scene.root;
var handleRemote = true;
var player = null;

// Create a child scene that displays text on the screen
var rdkmediaplayer = scene.create({t:'scene', x:0, y:0, w:1280, h:720, parent:root, url:"rdkmediaplayer_api.js"});

var onPlayerReady = function(success)
{
    console.log("onPlayerReady ....... " + success);
    
    if(success)
        player.load("http://69.252.103.215/scratch/test.m3u8");
}

module.exports.wantsClearscreen = function()
{
    return false;
};

// When child scene is ready, get api and register for event
rdkmediaplayer.ready.then(function(child)  
{
    console.log("rdkmediaplayer is ready ....... " + child);
    console.log("child is api ....... " + child.api);
    console.log("rdkmediaplayer is api ....... " + rdkmediaplayer.api);
    
    player = child.api;

    // Register listener for text value change in child
    player.on("onPlayerReady", onPlayerReady);
    
    test();
});

if(handleRemote)
{
    scene.root.on("onKeyDown", function (e) 
    {
        if(handleRemote && player)
        {
            if(e.keyCode == keys.F)
            {
                //fast forward
                player.fastForward();
            }
            else if(e.keyCode == keys.W)
            {
                //rewind
                player.rewind();
            }
            else if(e.keyCode == keys.P)
            {
                if(player.getCurrentSpeed() == 1)
                    player.pause();
                else
                    player.play();
            }
            else if(e.keyCode == keys.PAGEUP)
            {
                //seek forward
                player.setPosition(player.getPosition() + 60000.0);
            }
            else if(e.code == keys.PAGEDOWN)
            {
                //seek backwards
                player.setPosition(player.getPosition() - 60000.0);
            }
        }
    });
}

}).catch( function importFailed(err)
{
    console.log("err: " + err);
    console.error("Import for test_apiEvent.js failed: " + err)
});
