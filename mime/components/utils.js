/**
 * simple event Emitter class
 */
function _eventEmitter() {
    this.handlers = {}
    this.on = function(eventName, eventHandler) {
      if (!this.handlers[eventName])
        this.handlers[eventName] = []
      this.handlers[eventName].push(eventHandler)
    }
    this.emit = function(eventName) {
      console.log('firing event: ', eventName)
      var handlerz = this.handlers[eventName]
      if (handlerz) {
        for (var h of handlerz) {
          h()
        }
      }
    }
}


/**
 * merge object 
 * @param {*} obj the dest object
 * @param arguments the source objects
 */
function merge(obj) {
    var i = 1
      , target
      , key;

    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }
    return obj;
}

module.exports = {
    merge,
    _eventEmitter
};