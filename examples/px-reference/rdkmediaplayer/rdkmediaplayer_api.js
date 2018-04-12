px.import('px:scene.1.js').then( function ready(scene) 
{
    var waylandObj = null;
    var player = null;
    var autoTune = true;
    var audioLanguages = null;
    var currentSpeed = 1.0;
    var eventHandlers = {};

    var emitEvent = function(name, value) 
    {
        if(eventHandlers.name !== undefined) 
        {
            for(var func of eventHandlers.name)
                func(value);
        }
    }

    module.exports.on = function(name,callback) 
    {
        if(eventHandlers.name === undefined)
            eventHandlers.name = [];

        eventHandlers.name.push(callback);
    }

    //this isn't needed if this file is loaded as an api
    module.exports.wantsClearscreen = function()
    {
        return false;
    };

    function log(msg)
    {
        console.log("rdkmediaplayer.js: " + msg);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYER STUFF
    function onEvent(e)
    {
        log("Event " + e.name);
    }

    function onMediaOpened(e)
    {
        log("Event " + e.name 
                + "\n   type:" + e.mediaType
                + "\n   width:" + e.width
                + "\n   height:" + e.height
                + "\n   speed:" + e.availableSpeeds
                + "\n   sap:" + e.availableAudioLanguages
                + "\n   cc:" + e.availableClosedCaptionsLanguages 
                //+ "\n   customProperties:" + e.customProperties
                //+ "\n   mediaSegments:" + e.mediaSegments
        );

        audioLanguages = e.availableAudioLanguages.split(",");
    }

    function onProgress(e)
    {
        log("Tune Complete");
    }

    function onStatus(e)
    {
        log("Event " + e.name 
                + "\n   position:" + e.position 
                + "\n   duration:" + e.duration
                + "\n   width:" + e.width 
                + "\n   height:" + e.height 
                + "\n   isLive:" + e.isLive 
                + "\n   isBuffering:" + e.isBuffering 
                + "\n   connectionURL:" + e.connectionURL 
                + "\n   bufferPercentage:" + e.bufferPercentage
                + "\n   dynamicProps:" + e.dynamicProps
                + "\n   netStreamInfo:" + e.netStreamInfo);
    }

    function onWarningOrError(e)
    {
        log("Event " + e.name + "\n   code:" + e.code + "\n   desc:" + e.description);
    }

    function onSpeedChange(e)
    {
        log("Event " + e.name + "\n   speed:" + e.speed);
    }

    function registerPlayerEvents()
    {
        player.on("onMediaOpened",onMediaOpened);
        player.on("onProgress",onProgress);
        player.on("onStatus",onStatus);
        player.on("onWarning",onWarningOrError);
        player.on("onError",onWarningOrError);
        player.on("onSpeedChange",onSpeedChange);
        player.on("onClosed",onEvent);
        player.on("onPlayerInitialized",onEvent);
        player.on("onBuffering",onEvent);
        player.on("onPlaying",onEvent);
        player.on("onPaused",onEvent);
        player.on("onComplete",onEvent);
        player.on("onIndividualizing",onEvent);
        player.on("onAcquiringLicense",onEvent);
        player.on("onDRMMetadata",onEvent);
        player.on("onSegmentStarted",onEvent);
        player.on("onSegmentCompleted",onEvent);
        player.on("onSegmentWatched",onEvent);
        player.on("onBufferWarning",onEvent);
        player.on("onPlaybackSpeedsChanged",onEvent);
        player.on("onAdditionalAuthRequired",onEvent);
    }

    function unRegisterPlayerEvents()
    {
        player.delListener("onMediaOpened",onMediaOpened);
        player.delListener("onClosed",onClosed);
        player.delListener("onPlayerInitialized",onPlayerInitialized);
        player.delListener("onBuffering",onBuffering);
        player.delListener("onPlaying",onPlaying);
        player.delListener("onPaused",onPaused);
        player.delListener("onComplete",onComplete);
        player.delListener("onIndividualizing",onIndividualizing);
        player.delListener("onAcquiringLicense",onAcquiringLicense);
        player.delListener("onProgress",onProgress);
        player.delListener("onWarning",onWarning);
        player.delListener("onError",onError);
        player.delListener("onSpeedChange",onSpeedChange);
        player.delListener("onDRMMetadata",onDRMMetadata);
        player.delListener("onSegmentStarted",onSegmentStarted);
        player.delListener("onSegmentCompleted",onSegmentCompleted);
        player.delListener("onSegmentWatched",onSegmentWatched);
        player.delListener("onBufferWarning",onBufferWarning);
        player.delListener("onPlaybackSpeedsChanged",onPlaybackSpeedsChanged);
        player.delListener("onAdditionalAuthRequired",onAdditionalAuthRequired);
    }

    function hackToMakeEventsFlow1()
    {
        setInterval(hackToMakeEventsFlow2, 250);
    }

    function hackToMakeEventsFlow2()
    {
        player.volume;
    }

    function load(url)
    {
        log("load w:" + scene.w + " h:" + scene.h + "url:'" + url + "'");
        player.url = url;
        player.setVideoRectangle(scene.x,scene.y,scene.w,scene.h);
    }

    function pause()
    {
        currentSpeed = 0.0;
        player.pause();
    }

    function play()
    {
        currentSpeed = 1.0;
        player.play();
    }

    function fastForward()
    {
        if(currentSpeed < 0)
            currentSpeed = 4;
        else if(currentSpeed == 0)
        {
            currentSpeed = 1;
            player.play();
            return;
        }
        else if(currentSpeed == 1)
            currentSpeed = 4;
        else if(currentSpeed == 4)
            currentSpeed = 16;
        else if(currentSpeed == 16)
            currentSpeed = 32;
        else if(currentSpeed == 32)
            currentSpeed = 64;
        else
            return;
        
        player.speed = currentSpeed;
    }

    function rewind()
    {
        if(currentSpeed > -4)
            currentSpeed = -4;
        else if(currentSpeed == -4)
            currentSpeed = -16;
        else if(currentSpeed == -16)
            currentSpeed = -32;
        else if(currentSpeed == -32)
            currentSpeed = -64;
        else
            return;
        
        player.speed = currentSpeed;
    }

    function restart()
    {
        player.position = 0;
    }

    function seekToLive()
    {
        player.seekToLive();
    }

    function setPosition(value)
    {
        player.position = value;
    }

    function getPosition()
    {
        return player.position;
    }
    
    function getCurrentSpeed()
    {
        return currentSpeed;
    }

    function toggleLanguage()
    {
        if(audioLanguages == null || audioLanguages.length < 2)
            return;
        
        if(player.audioLanguage == audioLanguages[0])
            player.audioLanguage = audioLanguages[1];
        else
            player.audioLanguage = audioLanguages[0];
    }

    function toggleCC()
    {
        if(player.closedCaptionsEnabled == "true")
            player.closedCaptionsEnabled = "false";
        else
            player.closedCaptionsEnabled = "true";
    }

    function handleWaylandRemoteSuccess(wayland)
    {
        log("Handle wayland success");
        waylandObj = wayland;
        waylandObj.moveToBack();
        player = wayland.api;
        registerPlayerEvents();

        setTimeout(hackToMakeEventsFlow1, 1000);

        emitEvent("onPlayerReady", true);
    }

    function handleWaylandRemoteError(error)
    {
        log("Handle wayland error");
        //delete process.env.PLAYERSINKBIN_USE_WESTEROSSINK;
        
        emitEvent("onPlayerReady", false);
    }

    function createWaylandObject()
    {
        waylandObj = scene.create( {t:"wayland", x:scene.x, y:scene.y, w:scene.w, h:scene.h, parent:scene.root,cmd:"rdkmediaplayer"} );
        waylandObj.remoteReady.then(handleWaylandRemoteSuccess, handleWaylandRemoteError);
        waylandObj.focus = true;
        waylandObj.moveToBack();
    }

    module.exports.load = load;
    module.exports.pause = pause;
    module.exports.play = play;
    module.exports.fastForward = fastForward;
    module.exports.rewind = rewind;
    module.exports.restart = restart;
    module.exports.seekToLive = seekToLive;
    module.exports.setPosition = setPosition;
    module.exports.getPosition = getPosition;
    module.exports.getCurrentSpeed = getCurrentSpeed;
    module.exports.toggleLanguage = toggleLanguage;
    module.exports.toggleCC = toggleCC;

    createWaylandObject();

}).catch( function importFailed(err) 
{
    console.error("Import failed for rdkmediaplayer.js: " + err)
});