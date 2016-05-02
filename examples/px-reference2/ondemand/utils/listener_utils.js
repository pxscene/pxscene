/**
 * Created by tjcarroll2
 * on 2/23/16.
 */

function ListenerGroup() {
  var listeners = [];

  this.addListener = function(callback, userContext) {
    if( callback === undefined || callback === 'null ') {
      return;
    }

    listeners.push([callback, userContext]);
  };

  this.callListeners = function(sourceContext) {
    for(var k=0; k < listeners.length; ++k) {
      if( listeners[k][0] !== undefined && listeners[k][0] !== null  ) {
        listeners[k][0](sourceContext, listeners[k][1]);
      }
    }
  };
}

module.exports = {ListenerGroup:ListenerGroup};