var AnimationItem = function () {
    this._cbs = [];
    this.name = '';
    this.path = '';
    this.isLoaded = false;
    this.currentFrame = 0;
    this.currentRawFrame = 0;
    this.totalFrames = 0;
    this.frameRate = 0;
    this.frameMult = 0;
    this.playSpeed = 1;
    this.playDirection = 1;
    this.pendingElements = 0;
    this.playCount = 0;
    this.prerenderFramesFlag = true;
    this.animationData = {};
    this.layers = [];
    this.assets = [];
    this.isPaused = true;
    this.autoplay = false;
    this.loop = true;
    this.renderer = null;
    this.animationID = randomString(10);
    this.scaleMode = 'fit';
    this.assetsPath = '';
    this.timeCompleted = 0;
    this.segmentPos = 0;
    this.subframeEnabled = subframeEnabled;
    this.segments = [];
    this.pendingSegment = false;
    this._idle = true;
    this.projectInterface = ProjectInterface();
};

AnimationItem.prototype.setParams = function(params) {
    var self = this;
    if(params.context){
        this.context = params.context;
    }
    if(params.wrapper || params.container){
        this.wrapper = params.wrapper || params.container;
    }
    var animType = params.animType ? params.animType : params.renderer ? params.renderer : 'svg';
    switch(animType){
        case 'canvas':
            this.renderer = new CanvasRenderer(this, params.rendererSettings);
            break;
        case 'svg':
            this.renderer = new SVGRenderer(this, params.rendererSettings);
            break;
        case 'pxscene':
            this.renderer = new PxRenderer(this, params.rendererSettings);
            break;
        case 'hybrid':
        case 'html':
        default:
            this.renderer = new HybridRenderer(this, params.rendererSettings);
            break;
    }
    this.renderer.setProjectInterface(this.projectInterface);
    this.animType = animType;

    if(params.loop === '' || params.loop === null){
    }else if(params.loop === false){
        this.loop = false;
    }else if(params.loop === true){
        this.loop = true;
    }else{
        this.loop = parseInt(params.loop);
    }
    this.autoplay = 'autoplay' in params ? params.autoplay : true;
    this.name = params.name ? params.name :  '';
    this.prerenderFramesFlag = 'prerender' in params ? params.prerender : true;
    this.autoloadSegments = params.hasOwnProperty('autoloadSegments') ? params.autoloadSegments :  true;
    if(params.animationData){
        self.configAnimation(params.animationData);
    }else if(params.path){
        if(params.path.substr(-4) != 'json'){
            if (params.path.substr(-1, 1) != '/') {
                params.path += '/';
            }
            params.path += 'data.json';
        }

        if(px !== undefined)
        {
            var fileReady = px.getFile(params.path);  // LOAD the JSON
            fileReady.then(function(data)
            {
                var response = JSON.parse(data);      // PARSE the JSON
                self.configAnimation(response);
            });    
        }
        else
        {    
            var xhr = new XMLHttpRequest();
            if(params.path.lastIndexOf('\\') != -1){
                this.path = params.path.substr(0,params.path.lastIndexOf('\\')+1);
            }else{
                this.path = params.path.substr(0,params.path.lastIndexOf('/')+1);
            }
            this.assetsPath = params.assetsPath;
            this.fileName = params.path.substr(params.path.lastIndexOf('/')+1);
            this.fileName = this.fileName.substr(0,this.fileName.lastIndexOf('.json'));
            xhr.open('GET', params.path, true);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){
                        self.configAnimation(JSON.parse(xhr.responseText));
                    }else{
                        try{
                            var response = JSON.parse(xhr.responseText);
                            self.configAnimation(response);
                        }catch(err){
                        }
                    }
                }
            };
        }       
    }
};

AnimationItem.prototype.setData = function (wrapper, animationData) {
    var params = {
        wrapper: wrapper,
        animationData: animationData ? (typeof animationData  === "object") ? animationData : JSON.parse(animationData) : null
    };
    var wrapperAttributes = wrapper.attributes;

    params.path = wrapperAttributes.getNamedItem('data-animation-path') ? wrapperAttributes.getNamedItem('data-animation-path').value : wrapperAttributes.getNamedItem('data-bm-path') ? wrapperAttributes.getNamedItem('data-bm-path').value :  wrapperAttributes.getNamedItem('bm-path') ? wrapperAttributes.getNamedItem('bm-path').value : '';
    params.animType = wrapperAttributes.getNamedItem('data-anim-type') ? wrapperAttributes.getNamedItem('data-anim-type').value : wrapperAttributes.getNamedItem('data-bm-type') ? wrapperAttributes.getNamedItem('data-bm-type').value : wrapperAttributes.getNamedItem('bm-type') ? wrapperAttributes.getNamedItem('bm-type').value :  wrapperAttributes.getNamedItem('data-bm-renderer') ? wrapperAttributes.getNamedItem('data-bm-renderer').value : wrapperAttributes.getNamedItem('bm-renderer') ? wrapperAttributes.getNamedItem('bm-renderer').value : 'canvas';

    var loop = wrapperAttributes.getNamedItem('data-anim-loop') ? wrapperAttributes.getNamedItem('data-anim-loop').value :  wrapperAttributes.getNamedItem('data-bm-loop') ? wrapperAttributes.getNamedItem('data-bm-loop').value :  wrapperAttributes.getNamedItem('bm-loop') ? wrapperAttributes.getNamedItem('bm-loop').value : '';
    if(loop === ''){
    }else if(loop === 'false'){
        params.loop = false;
    }else if(loop === 'true'){
        params.loop = true;
    }else{
        params.loop = parseInt(loop);
    }
    var autoplay = wrapperAttributes.getNamedItem('data-anim-autoplay') ? wrapperAttributes.getNamedItem('data-anim-autoplay').value :  wrapperAttributes.getNamedItem('data-bm-autoplay') ? wrapperAttributes.getNamedItem('data-bm-autoplay').value :  wrapperAttributes.getNamedItem('bm-autoplay') ? wrapperAttributes.getNamedItem('bm-autoplay').value : true;
    params.autoplay = autoplay !== "false";

    params.name = wrapperAttributes.getNamedItem('data-name') ? wrapperAttributes.getNamedItem('data-name').value :  wrapperAttributes.getNamedItem('data-bm-name') ? wrapperAttributes.getNamedItem('data-bm-name').value : wrapperAttributes.getNamedItem('bm-name') ? wrapperAttributes.getNamedItem('bm-name').value :  '';
    var prerender = wrapperAttributes.getNamedItem('data-anim-prerender') ? wrapperAttributes.getNamedItem('data-anim-prerender').value :  wrapperAttributes.getNamedItem('data-bm-prerender') ? wrapperAttributes.getNamedItem('data-bm-prerender').value :  wrapperAttributes.getNamedItem('bm-prerender') ? wrapperAttributes.getNamedItem('bm-prerender').value : '';

    if(prerender === 'false'){
        params.prerender = false;
    }
    this.setParams(params);
};

AnimationItem.prototype.includeLayers = function(data) {
    if(data.op > this.animationData.op){
        this.animationData.op = data.op;
        this.totalFrames = Math.floor(data.op - this.animationData.ip);
        this.animationData.tf = this.totalFrames;
    }
    var layers = this.animationData.layers;
    var i, len = layers.length;
    var newLayers = data.layers;
    var j, jLen = newLayers.length;
    for(j=0;j<jLen;j+=1){
        i = 0;
        while(i<len){
            if(layers[i].id == newLayers[j].id){
                layers[i] = newLayers[j];
                break;
            }
            i += 1;
        }
    }
    if(data.chars || data.fonts){
        this.renderer.globalData.fontManager.addChars(data.chars);
        this.renderer.globalData.fontManager.addFonts(data.fonts, this.renderer.globalData.defs);
    }
    if(data.assets){
        len = data.assets.length;
        for(i = 0; i < len; i += 1){
            this.animationData.assets.push(data.assets[i]);
        }
    }
    //this.totalFrames = 50;
    //this.animationData.tf = 50;
    this.animationData.__complete = false;
    dataManager.completeData(this.animationData,this.renderer.globalData.fontManager);
    this.renderer.includeLayers(data.layers);
    if(expressionsPlugin){
        expressionsPlugin.initExpressions(this);
    }
    this.renderer.renderFrame(null);
    this.loadNextSegment();
};

AnimationItem.prototype.loadNextSegment = function() {
    var segments = this.animationData.segments;
    if(!segments || segments.length === 0 || !this.autoloadSegments){
        this.trigger('data_ready');
        this.timeCompleted = this.animationData.tf;
        return;
    }
    var segment = segments.shift();
    this.timeCompleted = segment.time * this.frameRate;

    if(px === undefined)
    {    
        var xhr = new XMLHttpRequest();
        var self = this;
        var segmentPath = this.path+this.fileName+'_' + this.segmentPos + '.json';
        this.segmentPos += 1;
        xhr.open('GET', segmentPath, true);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    self.includeLayers(JSON.parse(xhr.responseText));
                }else{
                    try{
                        var response = JSON.parse(xhr.responseText);
                        self.includeLayers(response);
                    }catch(err){
                    }
                }
            }
        };
    }
};

AnimationItem.prototype.loadSegments = function() {
    var segments = this.animationData.segments;
    if(!segments) {
        this.timeCompleted = this.animationData.tf;
    }
    this.loadNextSegment();
};

AnimationItem.prototype.configAnimation = function (animData) {
    if(this.renderer && this.renderer.destroyed){
        return;
    }
    //console.log(JSON.parse(JSON.stringify(animData)));
    //animData.w = Math.round(animData.w/blitter);
    //animData.h = Math.round(animData.h/blitter);
    this.animationData = animData;
    this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip);
    this.animationData.tf = this.totalFrames;
    this.renderer.configAnimation(animData);
    if(!animData.assets){
        animData.assets = [];
    }
    if(animData.comps) {
        animData.assets = animData.assets.concat(animData.comps);
        animData.comps = null;
    }
    this.renderer.searchExtraCompositions(animData.assets);

    this.layers = this.animationData.layers;
    this.assets = this.animationData.assets;
    this.frameRate = this.animationData.fr;
    this.firstFrame = Math.round(this.animationData.ip);
    this.frameMult = this.animationData.fr / 1000;
    this.trigger('config_ready');
    this.imagePreloader = new ImagePreloader();
    this.imagePreloader.setAssetsPath(this.assetsPath);
    this.imagePreloader.setPath(this.path);
    this.imagePreloader.loadAssets(animData.assets);
    this.loadSegments();
    this.updaFrameModifier();
    if(this.renderer.globalData.fontManager){
        this.waitForFontsLoaded();
    }else{
        dataManager.completeData(this.animationData,this.renderer.globalData.fontManager);
        this.checkLoaded();
    }
};

AnimationItem.prototype.waitForFontsLoaded = (function(){
    function checkFontsLoaded(){
        if(this.renderer.globalData.fontManager.loaded){
            dataManager.completeData(this.animationData,this.renderer.globalData.fontManager);
            //this.renderer.buildItems(this.animationData.layers);
            this.checkLoaded();
        }else{
            setTimeout(checkFontsLoaded.bind(this),20);
        }
    }

    return function(){
        checkFontsLoaded.bind(this)();
    }
}());

AnimationItem.prototype.addPendingElement = function () {
    this.pendingElements += 1;
}

AnimationItem.prototype.elementLoaded = function () {
    this.pendingElements--;
    this.checkLoaded();
};

AnimationItem.prototype.checkLoaded = function () {
    if (this.pendingElements === 0) {
        if(expressionsPlugin){
            expressionsPlugin.initExpressions(this);
        }
        this.renderer.initItems();
        setTimeout(function(){
            this.trigger('DOMLoaded');
        }.bind(this),0);
        this.isLoaded = true;
        this.gotoFrame();
        if(this.autoplay){
            this.play();
        }
    }
};

AnimationItem.prototype.resize = function () {
    this.renderer.updateContainerSize();
};

AnimationItem.prototype.setSubframe = function(flag){
    this.subframeEnabled = flag ? true : false;
}

AnimationItem.prototype.gotoFrame = function () {
    if(this.subframeEnabled){
        this.currentFrame = this.currentRawFrame;
    }else{
        this.currentFrame = Math.floor(this.currentRawFrame);
    }

    if(this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted){
        this.currentFrame = this.timeCompleted;
    }
    this.trigger('enterFrame');
    this.renderFrame();
};

AnimationItem.prototype.renderFrame = function () {
    if(this.isLoaded === false){
        return;
    }
    //console.log('this.currentFrame:',this.currentFrame + this.firstFrame);
    this.renderer.renderFrame(this.currentFrame + this.firstFrame);
};

AnimationItem.prototype.play = function (name) {
    if(name && this.name != name){
        return;
    }
    if(this.isPaused === true){
        this.isPaused = false;
        if(this._idle){
            this._idle = false;
            this.trigger('_active');
        }
    }
};

AnimationItem.prototype.pause = function (name) {
    if(name && this.name != name){
        return;
    }
    if(this.isPaused === false){
        this.isPaused = true;
        if(!this.pendingSegment){
            this._idle = true;
            this.trigger('_idle');
        }
    }
};

AnimationItem.prototype.togglePause = function (name) {
    if(name && this.name != name){
        return;
    }
    if(this.isPaused === true){
        this.play();
    }else{
        this.pause();
    }
};

AnimationItem.prototype.stop = function (name) {
    if(name && this.name != name){
        return;
    }
    this.pause();
    this.currentFrame = this.currentRawFrame = 0;
    this.playCount = 0;
    this.gotoFrame();
};

AnimationItem.prototype.goToAndStop = function (value, isFrame, name) {
    if(name && this.name != name){
        return;
    }
    if(isFrame){
        this.setCurrentRawFrameValue(value);
    }else{
        this.setCurrentRawFrameValue(value * this.frameModifier);
    }
    this.pause();
};

AnimationItem.prototype.goToAndPlay = function (value, isFrame, name) {
    this.goToAndStop(value, isFrame, name);
    this.play();
};

AnimationItem.prototype.advanceTime = function (value) {
    if(this.pendingSegment){
        this.pendingSegment = false;
        this.adjustSegment(this.segments.shift());
        if(this.isPaused){
            this.play();
        }
        return;
    }
    if (this.isPaused === true || this.isLoaded === false) {
        return;
    }
    this.setCurrentRawFrameValue(this.currentRawFrame + value * this.frameModifier);
};

AnimationItem.prototype.updateAnimation = function (perc) {
    this.setCurrentRawFrameValue(this.totalFrames * perc);
};

AnimationItem.prototype.moveFrame = function (value, name) {
    if(name && this.name != name){
        return;
    }
    this.setCurrentRawFrameValue(this.currentRawFrame+value);
};

AnimationItem.prototype.adjustSegment = function(arr){
    this.playCount = 0;
    if(arr[1] < arr[0]){
        if(this.frameModifier > 0){
            if(this.playSpeed < 0){
                this.setSpeed(-this.playSpeed);
            } else {
                this.setDirection(-1);
            }
        }
        this.totalFrames = arr[0] - arr[1];
        this.firstFrame = arr[1];
        this.setCurrentRawFrameValue(this.totalFrames - 0.01);
    } else if(arr[1] > arr[0]){
        if(this.frameModifier < 0){
            if(this.playSpeed < 0){
                this.setSpeed(-this.playSpeed);
            } else {
                this.setDirection(1);
            }
        }
        this.totalFrames = arr[1] - arr[0];
        this.firstFrame = arr[0];
        this.setCurrentRawFrameValue(0);
    }
    this.trigger('segmentStart');
};
AnimationItem.prototype.setSegment = function (init,end) {
    var pendingFrame = -1;
    if(this.isPaused) {
        if (this.currentRawFrame + this.firstFrame < init) {
            pendingFrame = init;
        } else if (this.currentRawFrame + this.firstFrame > end) {
            pendingFrame = end - init - 0.01;
        }
    }

    this.firstFrame = init;
    this.totalFrames = end - init;
    if(pendingFrame !== -1) {
        this.goToAndStop(pendingFrame,true);
    }
}

AnimationItem.prototype.playSegments = function (arr,forceFlag) {
    if(typeof arr[0] === 'object'){
        var i, len = arr.length;
        for(i=0;i<len;i+=1){
            this.segments.push(arr[i]);
        }
    }else{
        this.segments.push(arr);
    }
    if(forceFlag){
        this.adjustSegment(this.segments.shift());
    }
    if(this.isPaused){
        this.play();
    }
};

AnimationItem.prototype.resetSegments = function (forceFlag) {
    this.segments.length = 0;
    this.segments.push([this.animationData.ip*this.frameRate,Math.floor(this.animationData.op - this.animationData.ip+this.animationData.ip*this.frameRate)]);
    if(forceFlag){
        this.adjustSegment(this.segments.shift());
    }
};
AnimationItem.prototype.checkSegments = function(){
    if(this.segments.length){
        this.pendingSegment = true;
    }
}

AnimationItem.prototype.remove = function (name) {
    if(name && this.name != name){
        return;
    }
    this.renderer.destroy();
};

AnimationItem.prototype.destroy = function (name) {
    if((name && this.name != name) || (this.renderer && this.renderer.destroyed)){
        return;
    }
    this.renderer.destroy();
    this.trigger('destroy');
    this._cbs = null;
    this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null;
};

AnimationItem.prototype.setCurrentRawFrameValue = function(value){
    this.currentRawFrame = value;
    //console.log(this.totalFrames);
    if (this.currentRawFrame >= this.totalFrames) {
        this.checkSegments();
        if(this.loop === false){
            this.currentRawFrame = this.totalFrames - 0.01;
            this.gotoFrame();
            this.pause();
            this.trigger('complete');
            return;
        }else{
            this.trigger('loopComplete');
            this.playCount += 1;
            if((this.loop !== true && this.playCount == this.loop) || this.pendingSegment){
                this.currentRawFrame = this.totalFrames - 0.01;
                this.gotoFrame();
                this.pause();
                this.trigger('complete');
                return;
            } else {
                this.currentRawFrame = this.currentRawFrame % this.totalFrames;
            }
        }
    } else if (this.currentRawFrame < 0) {
        this.checkSegments();
        this.playCount -= 1;
        if(this.playCount < 0){
            this.playCount = 0;
        }
        if(this.loop === false  || this.pendingSegment){
            this.currentRawFrame = 0;
            this.gotoFrame();
            this.pause();
            this.trigger('complete');
            return;
        }else{
            this.trigger('loopComplete');
            this.currentRawFrame = (this.totalFrames + this.currentRawFrame) % this.totalFrames;
            this.gotoFrame();
            return;
        }
    }

    this.gotoFrame();
};

AnimationItem.prototype.setSpeed = function (val) {
    this.playSpeed = val;
    this.updaFrameModifier();
};

AnimationItem.prototype.setDirection = function (val) {
    this.playDirection = val < 0 ? -1 : 1;
    this.updaFrameModifier();
};

AnimationItem.prototype.updaFrameModifier = function () {
    this.frameModifier = this.frameMult * this.playSpeed * this.playDirection;
};

AnimationItem.prototype.getPath = function () {
    return this.path;
};

AnimationItem.prototype.getAssetsPath = function (assetData) {
    var path = '';
    if(this.assetsPath){
        var imagePath = assetData.p;
        if(imagePath.indexOf('images/') !== -1){
            imagePath = imagePath.split('/')[1];
        }
        path = this.assetsPath + imagePath;
    } else {
        path = this.path;
        path += assetData.u ? assetData.u : '';
        path += assetData.p;
    }
    return path;
};

AnimationItem.prototype.getAssetData = function (id) {
    var i = 0, len = this.assets.length;
    while (i < len) {
        if(id == this.assets[i].id){
            return this.assets[i];
        }
        i += 1;
    }
};

AnimationItem.prototype.hide = function () {
    this.renderer.hide();
};

AnimationItem.prototype.show = function () {
    this.renderer.show();
};

AnimationItem.prototype.getAssets = function () {
    return this.assets;
};

AnimationItem.prototype.trigger = function(name){
    if(this._cbs && this._cbs[name]){
        switch(name){
            case 'enterFrame':
                this.triggerEvent(name,new BMEnterFrameEvent(name,this.currentFrame,this.totalFrames,this.frameMult));
                break;
            case 'loopComplete':
                this.triggerEvent(name,new BMCompleteLoopEvent(name,this.loop,this.playCount,this.frameMult));
                break;
            case 'complete':
                this.triggerEvent(name,new BMCompleteEvent(name,this.frameMult));
                break;
            case 'segmentStart':
                this.triggerEvent(name,new BMSegmentStartEvent(name,this.firstFrame,this.totalFrames));
                break;
            case 'destroy':
                this.triggerEvent(name,new BMDestroyEvent(name,this));
                break;
            default:
                this.triggerEvent(name);
        }
    }
    if(name === 'enterFrame' && this.onEnterFrame){
        this.onEnterFrame.call(this,new BMEnterFrameEvent(name,this.currentFrame,this.totalFrames,this.frameMult));
    }
    if(name === 'loopComplete' && this.onLoopComplete){
        this.onLoopComplete.call(this,new BMCompleteLoopEvent(name,this.loop,this.playCount,this.frameMult));
    }
    if(name === 'complete' && this.onComplete){
        this.onComplete.call(this,new BMCompleteEvent(name,this.frameMult));
    }
    if(name === 'segmentStart' && this.onSegmentStart){
        this.onSegmentStart.call(this,new BMSegmentStartEvent(name,this.firstFrame,this.totalFrames));
    }
    if(name === 'destroy' && this.onDestroy){
        this.onDestroy.call(this,new BMDestroyEvent(name,this));
    }
};

AnimationItem.prototype.addEventListener = _addEventListener;
AnimationItem.prototype.removeEventListener = _removeEventListener;
AnimationItem.prototype.triggerEvent = _triggerEvent;
