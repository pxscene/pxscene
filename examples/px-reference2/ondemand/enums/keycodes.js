/**
 * Created by Comcast
 * on 7/6/15.
 */
var CTRL_CODE = 0x100;
var ALT_CODE = 0x200;

var KeyCode = {UNKNOWN:0, ENTER:13, PAGE_UP:33, PAGE_DOWN:34, LEFT:37, RIGHT:39, DOWN:40, UP: 38,
    PREV:'L'.charCodeAt(0)+CTRL_CODE,
    GUIDE:'G'.charCodeAt(0)+CTRL_CODE

};

var keyCodeMap = {};

function buildKeyCodeToEnumHashMap() {
  for(var key in KeyCode) {
    keyCodeMap['#'+KeyCode[key]] = key;
  }
}

buildKeyCodeToEnumHashMap();
//log.message(2, keyCodeMap);

function getKeyCode(keyEnum) {
  for(var key in KeyCode) {
   px.log.message(1, "keyEnum: " + key + ", value=" + KeyCode[key]);
  }

  if( !KeyCode.hasOwnProperty(keyEnum) ) {
    console.error("Unknown keyEnum: " + keyEnum);
    return 0;
  }

  return KeyCode[keyEnum];
}

function getKeyEnum(keyCode) {
  var key = '#'+keyCode;

  if( !keyCodeMap.hasOwnProperty(key) ) {
    console.error("Unknown keyCode: " + code);
    return keyCodeMap['#0'];
  }

  return keyCodeMap[key];

}


function getVirtualKeyCode(keyCode, flags) {
  var vkCode = keyCode;
  if (typeof flags !== 'undefined ') {
    if (flags & 0x10) {
      vkCode += CTRL_CODE;
    }
    if (flags & 0x20) {
      vkCode += ALT_CODE;
    }
  }

  return vkCode;
}

module.exports = {KeyCode:KeyCode, getKeyEnum:getKeyEnum, getKeyCode:getKeyCode, getVirtualKeyCode:getVirtualKeyCode};
