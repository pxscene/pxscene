function HybridRenderer(animationItem){
    this.animationItem = animationItem;
    this.layers = null;
    this.renderedFrame = -1;
    this.globalData = {
        frameNum: -1
    };
    this.pendingElements = [];
    this.elements = [];
    this.threeDElements = [];
    this.destroyed = false;
    this.camera = null;
    this.supports3d = true;

}

extendPrototype(BaseRenderer,HybridRenderer);

HybridRenderer.prototype.buildItem = SVGRenderer.prototype.buildItem;

HybridRenderer.prototype.checkPendingElements  = function(){
    while(this.pendingElements.length){
        var element = this.pendingElements.pop();
        element.checkParenting();
    }
};

HybridRenderer.prototype.appendElementInPos = function(element, pos){
    var newElement = element.getBaseElement();
    if(!newElement){
        return;
    }
    var layer = this.layers[pos];
    if(!layer.ddd || !this.supports3d){
        var i = 0;
        var nextElement;
        while(i<pos){
            if(this.elements[i] && this.elements[i]!== true && this.elements[i].getBaseElement){
                nextElement = this.elements[i].getBaseElement();
            }
            i += 1;
        }
        if(nextElement){
            if(!layer.ddd || !this.supports3d){
                this.layerElement.insertBefore(newElement, nextElement);
            }
        } else {
            if(!layer.ddd || !this.supports3d){
                this.layerElement.appendChild(newElement);
            }
        }
    } else {
        this.addTo3dContainer(newElement,pos);
    }
};


HybridRenderer.prototype.createBase = function (data) {
    return new SVGBaseElement(data, this.layerElement,this.globalData,this);
};

HybridRenderer.prototype.createShape = function (data) {
    if(!this.supports3d){
        return new IShapeElement(data, this.layerElement,this.globalData,this);
    }
    return new HShapeElement(data, this.layerElement,this.globalData,this);
};

HybridRenderer.prototype.createText = function (data) {
    if(!this.supports3d){
        return new SVGTextElement(data, this.layerElement,this.globalData,this);
    }
    return new HTextElement(data, this.layerElement,this.globalData,this);
};

HybridRenderer.prototype.createCamera = function (data) {
    this.camera = new HCameraElement(data, this.layerElement,this.globalData,this);
    return this.camera;
};

HybridRenderer.prototype.createImage = function (data) {
    if(!this.supports3d){
        return new IImageElement(data, this.layerElement,this.globalData,this);
    }
    return new HImageElement(data, this.layerElement,this.globalData,this);
};

HybridRenderer.prototype.createComp = function (data) {
    if(!this.supports3d){
        return new ICompElement(data, this.layerElement,this.globalData,this);
    }
    return new HCompElement(data, this.layerElement,this.globalData,this);

};

HybridRenderer.prototype.createSolid = function (data) {
    if(!this.supports3d){
        return new ISolidElement(data, this.layerElement,this.globalData,this);
    }
    return new HSolidElement(data, this.layerElement,this.globalData,this);
};

HybridRenderer.prototype.getThreeDContainer = function(pos){
    var perspectiveElem = document.createElement('div');
    styleDiv(perspectiveElem);
    perspectiveElem.style.width = this.globalData.compSize.w+'px';
    perspectiveElem.style.height = this.globalData.compSize.h+'px';
    perspectiveElem.style.transformOrigin = perspectiveElem.style.mozTransformOrigin = perspectiveElem.style.webkitTransformOrigin = "50% 50%";
    var container = document.createElement('div');
    styleDiv(container);
    container.style.transform = container.style.webkitTransform = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
    perspectiveElem.appendChild(container);
    this.resizerElem.appendChild(perspectiveElem);
    var threeDContainerData = {
        container:container,
        perspectiveElem:perspectiveElem,
        startPos: pos,
        endPos: pos
    };
    this.threeDElements.push(threeDContainerData);
    return threeDContainerData;
};

HybridRenderer.prototype.build3dContainers = function(){
    var i, len = this.layers.length;
    var lastThreeDContainerData;
    for(i=0;i<len;i+=1){
        if(this.layers[i].ddd){
            if(!lastThreeDContainerData){
                lastThreeDContainerData = this.getThreeDContainer(i);
            }
            lastThreeDContainerData.endPos = Math.max(lastThreeDContainerData.endPos,i);
        } else {
            lastThreeDContainerData = null;
        }
    }
};

HybridRenderer.prototype.addTo3dContainer = function(elem,pos){
    var i = 0, len = this.threeDElements.length;
    while(i<len){
        if(pos <= this.threeDElements[i].endPos){
            var j = this.threeDElements[i].startPos;
            var nextElement;
            while(j<pos){
                if(this.elements[j] && this.elements[j].getBaseElement){
                    nextElement = this.elements[j].getBaseElement();
                }
                j += 1;
            }
            if(nextElement){
                this.threeDElements[i].container.insertBefore(elem, nextElement);
            } else {
                this.threeDElements[i].container.appendChild(elem);
            }
            break;
        }
        i += 1;
    }
};

HybridRenderer.prototype.configAnimation = function(animData){
    var resizerElem = document.createElement('div');
    var wrapper = this.animationItem.wrapper;
    resizerElem.style.width = animData.w+'px';
    resizerElem.style.height = animData.h+'px';
    this.resizerElem = resizerElem;
    styleDiv(resizerElem);
    resizerElem.style.transformStyle = resizerElem.style.webkitTransformStyle = resizerElem.style.mozTransformStyle = "flat";
    wrapper.appendChild(resizerElem);

    resizerElem.style.overflow = 'hidden';
    var svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('width','1');
    svg.setAttribute('height','1');
    styleDiv(svg);
    this.resizerElem.appendChild(svg);
    var defs = document.createElementNS(svgNS,'defs');
    svg.appendChild(defs);
    this.globalData.defs = defs;
    this.data = animData;
    //Mask animation
    this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem);
    this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem);
    this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem);
    this.globalData.frameId = 0;
    this.globalData.compSize = {
        w: animData.w,
        h: animData.h
    };
    this.globalData.frameRate = animData.fr;
    this.layers = animData.layers;
    this.globalData.fontManager = new FontManager();
    this.globalData.fontManager.addChars(animData.chars);
    this.globalData.fontManager.addFonts(animData.fonts,svg);
    this.layerElement = this.resizerElem;
    this.build3dContainers();
    this.updateContainerSize();
};

HybridRenderer.prototype.destroy = function () {
    this.animationItem.wrapper.innerHTML = '';
    this.animationItem.container = null;
    this.globalData.defs = null;
    var i, len = this.layers ? this.layers.length : 0;
    for (i = 0; i < len; i++) {
        this.elements[i].destroy();
    }
    this.elements.length = 0;
    this.destroyed = true;
    this.animationItem = null;
};

HybridRenderer.prototype.updateContainerSize = function () {
    var elementWidth = this.animationItem.wrapper.offsetWidth;
    var elementHeight = this.animationItem.wrapper.offsetHeight;
    var elementRel = elementWidth/elementHeight;
    var animationRel = this.globalData.compSize.w/this.globalData.compSize.h;
    var sx,sy,tx,ty;
    if(animationRel>elementRel){
        sx = elementWidth/(this.globalData.compSize.w);
        sy = elementWidth/(this.globalData.compSize.w);
        tx = 0;
        ty = ((elementHeight-this.globalData.compSize.h*(elementWidth/this.globalData.compSize.w))/2);
    }else{
        sx = elementHeight/(this.globalData.compSize.h);
        sy = elementHeight/(this.globalData.compSize.h);
        tx = (elementWidth-this.globalData.compSize.w*(elementHeight/this.globalData.compSize.h))/2;
        ty = 0;
    }
    this.resizerElem.style.transform = this.resizerElem.style.webkitTransform = 'matrix3d(' + sx + ',0,0,0,0,'+sy+',0,0,0,0,1,0,'+tx+','+ty+',0,1)';
};

HybridRenderer.prototype.renderFrame = SVGRenderer.prototype.renderFrame;

HybridRenderer.prototype.hide = function(){
    this.resizerElem.style.display = 'none';
};

HybridRenderer.prototype.show = function(){
    this.resizerElem.style.display = 'block';
};

HybridRenderer.prototype.initItems = function(){
    this.buildAllItems();
    if(this.camera){
        this.camera.setup();
    } else {
        var cWidth = this.globalData.compSize.w;
        var cHeight = this.globalData.compSize.h;
        var i, len = this.threeDElements.length;
        for(i=0;i<len;i+=1){
            this.threeDElements[i].perspectiveElem.style.perspective = this.threeDElements[i].perspectiveElem.style.webkitPerspective = Math.sqrt(Math.pow(cWidth,2) + Math.pow(cHeight,2)) + 'px';
        }
    }
};

HybridRenderer.prototype.searchExtraCompositions = function(assets){
    var i, len = assets.length;
    var floatingContainer = document.createElement('div');
    for(i=0;i<len;i+=1){
        if(assets[i].xt){
            var comp = this.createComp(assets[i],floatingContainer,this.globalData.comp,null);
            comp.initExpressions();
            this.globalData.projectInterface.registerComposition(comp);
        }
    }
};