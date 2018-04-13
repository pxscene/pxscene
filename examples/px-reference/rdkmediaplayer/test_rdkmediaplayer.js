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

//create rdk mediaplayer scene
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

    // Register listener for rdk media player ready
    player.on("onPlayerReady", onPlayerReady);
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
    console.error("Import for test_rdkmediaplayer.js failed: " + err)
});
