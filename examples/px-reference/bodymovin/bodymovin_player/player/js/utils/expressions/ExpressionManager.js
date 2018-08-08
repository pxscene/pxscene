var ExpressionManager = (function(){
    var ob = {};
    var Math = BMMath;
    var window = null;
    var document = null;

    function duplicatePropertyValue(value, mult){
        mult = mult || 1;

        if(typeof value === 'number'  || value instanceof Number){
            return value*mult;
        }else if(value.i){
            return JSON.parse(JSON.stringify(value));
        }else{
            var arr = Array.apply(null,{length:value.length});
            var i, len = value.length;
            for(i=0;i<len;i+=1){
                arr[i]=value[i]*mult;
            }
            return arr;
        }
    }

    function shapesEqual(shape1, shape2) {
        if(shape1._length !== shape2._length || shape1.c !== shape2.c){
            return false;
        }
        var i, len = shape1._length;
        for(i = 0; i < len; i += 1) {
            if(shape1.v[i][0] !== shape2.v[i][0] || shape1.v[i][1] !== shape2.v[i][1]
                || shape1.o[i][0] !== shape2.o[i][0] || shape1.o[i][1] !== shape2.o[i][1]
                || shape1.i[i][0] !== shape2.i[i][0] || shape1.i[i][1] !== shape2.i[i][1]){
                return false;
            }
        }
        return true;
    }

    function $bm_neg(a){
        var tOfA = typeof a;
        if(tOfA === 'number' || tOfA === 'boolean'  || a instanceof Number ){
            return -a;
        }
        if(a.constructor === Array){
            var i, lenA = a.length;
            var retArr = [];
            for(i=0;i<lenA;i+=1){
                retArr[i] = -a[i];
            }
            return retArr;
        }
    }

    function sum(a,b) {
        var tOfA = typeof a;
        var tOfB = typeof b;
        if(tOfA === 'string' || tOfB === 'string'){
            return a + b;
        }
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number) && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string'  || b instanceof Number)) {
            return a + b;
        }
        if(a.constructor === Array && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )){
            a[0] = a[0] + b;
            return a;
        }
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && b.constructor === Array){
            b[0] = a + b[0];
            return b;
        }
        if(a.constructor === Array && b.constructor === Array){
            
            var i = 0, lenA = a.length, lenB = b.length;
            var retArr = [];
            while(i<lenA || i < lenB){
                if((typeof a[i] === 'number' || a[i] instanceof Number) && (typeof b[i] === 'number' || b[i] instanceof Number)){
                    retArr[i] = a[i] + b[i];
                }else{
                    retArr[i] = b[i] == undefined ? a[i] : a[i] || b[i];
                }
                i += 1;
            }
            return retArr;
        }
        return 0;
    }
    var add = sum;

    function sub(a,b) {
        var tOfA = typeof a;
        var tOfB = typeof b;
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )) {
            return a - b;
        }
        if( a.constructor === Array && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )){
            a[0] = a[0] - b;
            return a;
        }
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) &&  b.constructor === Array){
            b[0] = a - b[0];
            return b;
        }
        if(a.constructor === Array && b.constructor === Array){
            var i = 0, lenA = a.length, lenB = b.length;
            var retArr = [];
            while(i<lenA || i < lenB){
                if((typeof a[i] === 'number' || a[i] instanceof Number) && typeof (typeof b[i] === 'number' || b[i] instanceof Number)){
                    retArr[i] = a[i] - b[i];
                }else{
                    retArr[i] = b[i] == undefined ? a[i] : a[i] || b[i];
                }
                i += 1;
            }
            return retArr;
        }
        return 0;
    }

    function mul(a,b) {
        var tOfA = typeof a;
        var tOfB = typeof b;
        var arr;
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )) {
            return a * b;
        }

        var i, len;
        if(a.constructor === Array && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )){
            len = a.length;
            arr = Array.apply(null,{length:len});
            for(i=0;i<len;i+=1){
                arr[i] = a[i] * b;
            }
            return arr;
        }
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && b.constructor === Array){
            len = b.length;
            arr = Array.apply(null,{length:len});
            for(i=0;i<len;i+=1){
                arr[i] = a * b[i];
            }
            return arr;
        }
        return 0;
    }

    function div(a,b) {
        var tOfA = typeof a;
        var tOfB = typeof b;
        var arr;
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number )) {
            return a / b;
        }
        var i, len;
        if(a.constructor === Array && (tOfB === 'number' || tOfB === 'boolean' || tOfB === 'string' || b instanceof Number  )){
            len = a.length;
            arr = Array.apply(null,{length:len});
            for(i=0;i<len;i+=1){
                arr[i] = a[i] / b;
            }
            return arr;
        }
        if((tOfA === 'number' || tOfA === 'boolean' || tOfA === 'string' || a instanceof Number ) && b.constructor === Array){
            len = b.length;
            arr = Array.apply(null,{length:len});
            for(i=0;i<len;i+=1){
                arr[i] = a / b[i];
            }
            return arr;
        }
        return 0;
    }

    function clamp(num, min, max) {
        if(min > max){
            var mm = max;
            max = min;
            min = mm;
        }
        return Math.min(Math.max(num, min), max);
    }

    function radiansToDegrees(val) {
        return val/degToRads;
    }
    var radians_to_degrees = radiansToDegrees;

    function degreesToRadians(val) {
        return val*degToRads;
    }
    var degrees_to_radians = radiansToDegrees;

    var helperLengthArray = [0,0,0,0,0,0];

    function length(arr1,arr2){
        if(typeof arr1 === "number"){
            arr2 = arr2 || 0;
            return Math.abs(arr1 - arr2);
        }
        if(!arr2){
            arr2 = helperLengthArray;
        }
        var i,len = Math.min(arr1.length,arr2.length);
        var addedLength = 0;
        for(i=0;i<len;i+=1){
            addedLength += Math.pow(arr2[i]-arr1[i],2);
        }
        return Math.sqrt(addedLength);
    }

    function normalize(vec){
        return div(vec, length(vec));
    }

    function rgbToHsl(val){
        var r = val[0]; var g = val[1]; var b = val[2];
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l,val[3]];
    }
    function hslToRgb(val){
        var h = val[0];
        var s = val[1];
        var l = val[2];

        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [r, g , b, val[3]];
    }

    function linear(t, tMin, tMax, value1, value2){
        if(value1 === undefined || value2 === undefined){
            return linear(t,0,1,tMin,tMax);
        }
        if(t <= tMin) {
            return value1;
        }else if(t >= tMax){
            return value2;
        }
        var perc = tMax === tMin ? 0 : (t-tMin)/(tMax-tMin);
        if(!value1.length){
            return value1 + (value2-value1)*perc;
        }
        var i, len = value1.length;
        var arr = Array.apply( null, { length: len } );
        for(i=0;i<len;i+=1){
            arr[i] = value1[i] + (value2[i]-value1[i])*perc;
        }
        return arr;
    }
    function random(min,max){
        if(max === undefined){
            if(min === undefined){
                min = 0;
                max = 1;
            } else {
                max = min;
                min = undefined;
            }
        }
        if(max.length){
            var i, len = max.length;
            if(!min){
                min = Array.apply(null,{length:len});
            }
            var arr = Array.apply(null,{length:len});
            var rnd = BMMath.random();
            for(i=0;i<len;i+=1){
                arr[i] = min[i] + rnd*(max[i]-min[i])
            }
            return arr;
        }
        if(min === undefined){
            min = 0;
        }
        var rndm = BMMath.random();
        return min + rndm*(max-min);
    }

    function initiateExpression(elem,data,property){
        var val = data.x;
        var needsVelocity = /velocity(?![\w\d])/.test(val);
        var _needsRandom = val.indexOf('random') !== -1;
        var elemType = elem.data.ty;
        var transform,content,effect;
        var thisComp = elem.comp;
        var thisProperty = property;
        elem.comp.frameDuration = 1/elem.comp.globalData.frameRate;
        var inPoint = elem.data.ip/elem.comp.globalData.frameRate;
        var outPoint = elem.data.op/elem.comp.globalData.frameRate;
        var width = elem.data.sw ? elem.data.sw : 0;
        var height = elem.data.sh ? elem.data.sh : 0;
        var toWorld,fromWorld,anchorPoint,thisLayer,thisComp;
        var fn = new Function();
        //var fnStr = 'var fn = function(){'+val+';this.v = $bm_rt;}';
        //eval(fnStr);

        var fn = eval('[function(){' + val+';this.v = $bm_rt;}' + ']')[0];
        var bindedFn = fn.bind(this);
        var numKeys = property.kf ? data.k.length : 0;

        var wiggle = function wiggle(freq,amp){
            var i,j, len = this.pv.length ? this.pv.length : 1;
            var addedAmps = Array.apply(null,{len:len});
            for(j=0;j<len;j+=1){
                addedAmps[j] = 0;
            }
            freq = 5;
            var iterations = Math.floor(time*freq);
            i = 0;
            j = 0;
            while(i<iterations){
                //var rnd = BMMath.random();
                for(j=0;j<len;j+=1){
                    addedAmps[j] += -amp + amp*2*BMMath.random();
                    //addedAmps[j] += -amp + amp*2*rnd;
                }
                i += 1;
            }
            //var rnd2 = BMMath.random();
            var periods = time*freq;
            var perc = periods - Math.floor(periods);
            var arr = Array.apply({length:len});
            if(len>1){
                for(j=0;j<len;j+=1){
                    arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*BMMath.random())*perc;
                    //arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
                    //arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
                }
                return arr;
            } else {
                return this.pv + addedAmps[0] + (-amp + amp*2*BMMath.random())*perc;
            }
        }.bind(this);

        var loopIn = function loopIn(type,duration, durationFlag) {
            if(!this.k){
                return this.pv;
            }
            var currentFrame = time*elem.comp.globalData.frameRate;
            var keyframes = this.keyframes;
            var firstKeyFrame = keyframes[0].t;
            if(currentFrame>=firstKeyFrame){
                return this.pv;
            }else{
                var cycleDuration, lastKeyFrame;
                if(!durationFlag){
                    if(!duration || duration > keyframes.length - 1){
                        duration = keyframes.length - 1;
                    }
                    lastKeyFrame = keyframes[duration].t;
                    cycleDuration = lastKeyFrame - firstKeyFrame;
                } else {
                    if(!duration){
                        cycleDuration = Math.max(0,this.elem.data.op - firstKeyFrame);
                    } else {
                        cycleDuration = Math.abs(elem.comp.globalData.frameRate*duration);
                    }
                    lastKeyFrame = firstKeyFrame + cycleDuration;
                }
                var i, len, ret;
                if(type === 'pingpong') {
                    var iterations = Math.floor((firstKeyFrame - currentFrame)/cycleDuration);
                    if(iterations % 2 === 0){
                        return this.getValueAtTime(((firstKeyFrame - currentFrame)%cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
                    }
                } else if(type === 'offset'){
                    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
                    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
                    var current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame)%cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
                    var repeats = Math.floor((firstKeyFrame - currentFrame)/cycleDuration)+1;
                    if(this.pv.length){
                        ret = new Array(initV.length);
                        len = ret.length;
                        for(i=0;i<len;i+=1){
                            ret[i] = current[i]-(endV[i]-initV[i])*repeats;
                        }
                        return ret;
                    }
                    return current-(endV-initV)*repeats;
                } else if(type === 'continue'){
                    var firstValue = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
                    var nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / this.comp.globalData.frameRate, 0);
                    if(this.pv.length){
                        ret = new Array(firstValue.length);
                        len = ret.length;
                        for(i=0;i<len;i+=1){
                            ret[i] = firstValue[i] + (firstValue[i]-nextFirstValue[i])*(firstKeyFrame - currentFrame)/0.001;
                        }
                        return ret;
                    }
                    return firstValue + (firstValue-nextFirstValue)*(firstKeyFrame - currentFrame)/0.001;
                }
                return this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
            }
        }.bind(this);

        var loopInDuration = function loopInDuration(type,duration){
            return loopIn(type,duration,true);
        }.bind(this);

        var loopOut = function loopOut(type,duration,durationFlag){
            if(!this.k || !this.keyframes){
                return this.pv;
            }
            var currentFrame = time*elem.comp.globalData.frameRate;
            var keyframes = this.keyframes;
            var lastKeyFrame = keyframes[keyframes.length - 1].t;
            if(currentFrame<=lastKeyFrame){
                return this.pv;
            }else{
                var cycleDuration, firstKeyFrame;
                if(!durationFlag){
                    if(!duration || duration > keyframes.length - 1){
                        duration = keyframes.length - 1;
                    }
                    firstKeyFrame = keyframes[keyframes.length - 1 - duration].t;
                    cycleDuration = lastKeyFrame - firstKeyFrame;
                } else {
                    if(!duration){
                        cycleDuration = Math.max(0,lastKeyFrame - this.elem.data.ip);
                    } else {
                        cycleDuration = Math.abs(lastKeyFrame - elem.comp.globalData.frameRate*duration);
                    }
                    firstKeyFrame = lastKeyFrame - cycleDuration;
                }
                var i, len, ret;
                if(type === 'pingpong') {
                    var iterations = Math.floor((currentFrame - firstKeyFrame)/cycleDuration);
                    if(iterations % 2 !== 0){
                        return this.getValueAtTime((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
                    }
                } else if(type === 'offset'){
                    var initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0);
                    var endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
                    var current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
                    var repeats = Math.floor((currentFrame - firstKeyFrame)/cycleDuration);
                    if(this.pv.length){
                        ret = new Array(initV.length);
                        len = ret.length;
                        for(i=0;i<len;i+=1){
                            ret[i] = (endV[i]-initV[i])*repeats + current[i];
                        }
                        return ret;
                    }
                    return (endV-initV)*repeats + current;
                } else if(type === 'continue'){
                    var lastValue = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0);
                    var nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / this.comp.globalData.frameRate, 0);
                    if(this.pv.length){
                        ret = new Array(lastValue.length);
                        len = ret.length;
                        for(i=0;i<len;i+=1){
                            ret[i] = lastValue[i] + (lastValue[i]-nextLastValue[i])*((currentFrame - lastKeyFrame)/ this.comp.globalData.frameRate)/0.0005;
                        }
                        return ret;
                    }
                    return lastValue + (lastValue-nextLastValue)*(((currentFrame - lastKeyFrame))/0.001);
                }
                return this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration +  firstKeyFrame) / this.comp.globalData.frameRate, 0);
            }
        }.bind(this);
        var loop_out = loopOut;

        var loopOutDuration = function loopOutDuration(type,duration){
            return loopOut(type,duration,true);
        }.bind(this);

        var valueAtTime = function valueAtTime(t) {
            return this.getValueAtTime(t, 0);
        }.bind(this);

        var velocityAtTime = function velocityAtTime(t) {
            return this.getVelocityAtTime(t);
        }.bind(this);

        var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface);

        function lookAt(elem1,elem2){
            var fVec = [elem2[0]-elem1[0],elem2[1]-elem1[1],elem2[2]-elem1[2]];
            var pitch = Math.atan2(fVec[0],Math.sqrt(fVec[1]*fVec[1]+fVec[2]*fVec[2]))/degToRads;
            var yaw = -Math.atan2(fVec[1],fVec[2])/degToRads;
            return [yaw,pitch,0];
        };

        function easeOut(t, val1, val2){
            return -(val2-val1) * t*(t-2) + val1;
        };

        function nearestKey(time){
            var i, len = data.k.length,index,keyTime;
            if(!data.k.length || typeof(data.k[0]) === 'number'){
                index = 0;
                keyTime = 0;
            } else {
                index = -1;
                time *= elem.comp.globalData.frameRate;
                if (time < data.k[0].t) {
                    index = 1;
                    keyTime = data.k[0].t;
                } else {
                    for(i=0;i<len-1;i+=1){
                        if(time === data.k[i].t){
                            index = i + 1;
                            keyTime = data.k[i].t;
                            break;
                        }else if(time>data.k[i].t && time<data.k[i+1].t){
                            if(time-data.k[i].t > data.k[i+1].t - time){
                                index = i + 2;
                                keyTime = data.k[i+1].t;
                            } else {
                                index = i + 1;
                                keyTime = data.k[i].t;
                            }
                            break;
                        }
                    }
                    if(index === -1){
                        index = i + 1;
                        keyTime = data.k[i].t;
                    }
                }
                
            }
            var ob = {};
            ob.index = index;
            ob.time = keyTime/elem.comp.globalData.frameRate;
            return ob;
        };

        function key(ind){
            if(!data.k.length || typeof(data.k[0]) === 'number'){
                return {time:0};
            }
            ind -= 1;
            var ob = {
                time: data.k[ind].t/elem.comp.globalData.frameRate
            };
            var arr;
            if(ind === data.k.length - 1 && !data.k[ind].h){
                arr = data.k[ind-1].e;
            }else{
                arr = data.k[ind].s;
            }
            var i, len = arr.length;
            for(i=0;i<len;i+=1){
                ob[i] = arr[i];
            }
            return ob;
        };

        function framesToTime(frames,fps){
            if(!fps){
                fps = elem.comp.globalData.frameRate;
            }
            return frames/fps;
        };

        function timeToFrames(t,fps){
            if(!t){
                t = time;
            }
            if(!fps){
                fps = elem.comp.globalData.frameRate;
            }
            return t*fps;
        };

        function seedRandom(seed){
            BMMath.seedrandom(randSeed + seed);
        };

        var time,velocity, value,textIndex,textTotal,selectorValue;
        var index = elem.data.ind;
        var hasParent = !!(elem.hierarchy && elem.hierarchy.length);
        var parent;
        var randSeed = Math.floor(Math.random()*1000000);
        function execute(){
            if(_needsRandom){
                seedRandom(randSeed);
            }
            if(this.frameExpressionId === elem.globalData.frameId && this.type !== 'textSelector'){
                return;
            }
            if(this.lock){
                this.v = duplicatePropertyValue(this.pv,this.mult);
                return true;
            }
            if(this.type === 'textSelector'){
                textIndex = this.textIndex;
                textTotal = this.textTotal;
                selectorValue = this.selectorValue;
            }
            if(!thisLayer){
                thisLayer = elem.layerInterface;
                thisComp = elem.comp.compInterface;
                toWorld = thisLayer.toWorld.bind(thisLayer);
                fromWorld = thisLayer.fromWorld.bind(thisLayer);
            }
            if(!transform){
                transform = elem.layerInterface("ADBE Transform Group");
                anchorPoint = transform.anchorPoint;
            }
            
            if(elemType === 4 && !content){
                content = thisLayer("ADBE Root Vectors Group");
            }
            if(!effect){
                effect = thisLayer(4);
            }
            hasParent = !!(elem.hierarchy && elem.hierarchy.length);
            if(hasParent && !parent){
                parent = elem.hierarchy[0].layerInterface;
            }
            this.lock = true;
            if(this.getPreValue){
                this.getPreValue();
            }
            value = this.pv;
            time = this.comp.renderedFrame/this.comp.globalData.frameRate;
            if(needsVelocity){
                velocity = velocityAtTime(time);
            }
            bindedFn();
            this.frameExpressionId = elem.globalData.frameId;
            var i,len;
            if(this.mult){
                if(typeof this.v === 'number' || this.v instanceof Number || typeof this.v === 'string'){
                    this.v *= this.mult;
                }else if(this.v.length === 1){
                    this.v = this.v[0] * this.mult;
                }else{
                    len = this.v.length;
                    if(value === this.v){
                        this.v = len === 2 ? [value[0],value[1]] : [value[0],value[1],value[2]];
                    }
                    for(i = 0; i < len; i += 1){
                        this.v[i] *= this.mult;
                    }
                }
            }

            if(this.v.length === 1){
                this.v = this.v[0];
            }
            if(typeof this.v === 'number' || this.v instanceof Number || typeof this.v === 'string'){
                if(this.lastValue !== this.v){
                    this.lastValue = this.v;
                    this.mdf = true;
                }
            }else if(this.v._length){
                if(!shapesEqual(this.v,this.localShapeCollection.shapes[0])){
                    this.mdf = true;
                    this.localShapeCollection.releaseShapes();
                    this.localShapeCollection.addShape(shape_pool.clone(this.v));
                }
            }else{
                len = this.v.length;
                for(i = 0; i < len; i += 1){
                    if(this.v[i] !== this.lastValue[i]){
                        this.lastValue[i] = this.v[i];
                        this.mdf = true;
                    }
                }
            }
            this.lock = false;
        }
        return execute;
    };

    ob.initiateExpression = initiateExpression;
    return ob;
}());