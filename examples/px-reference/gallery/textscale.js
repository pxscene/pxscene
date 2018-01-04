"use strict";

px.import("px:scene.1.js").then(function ready($) {

    var a = 0.75;
    var small = 24;
    var large = 240;
    var red = 0xff0000ff;
    var white = 0xffffffff;
    var cyan = 0x00ffffff;
    var yellow = 0xffff00ff;
    var black = 0x000000ff;
    var str = "Iñtërnâtiônàližætiøn";

    // small pixelSize scale up and down
    $.create({ t: "text", text: str, parent: $.root, pixelSize: small, a: 1.0, textColor: red }).animateTo({ sx: 20, sy: 20 }, 5, $.animation.TWEEN_LINEAR, $.animation.OPTION_OSCILLATE, $.animation.COUNT_FOREVER);
    $.create({ t: "text", text: str, parent: $.root, pixelSize: small, a: a, textColor: white }).animateTo({ sx: 3.0, sy: 20 }, 5, $.animation.TWEEN_LINEAR, $.animation.OPTION_OSCILLATE, $.animation.COUNT_FOREVER);
    $.create({ t: "text", text: str, parent: $.root, pixelSize: small, a: a, textColor: yellow }).animateTo({ sx: 20, sy: 3.0 }, 5, $.animation.TWEEN_LINEAR, $.animation.OPTION_OSCILLATE, $.animation.COUNT_FOREVER);
    // large pixelSize scale down and up
    $.create({ t: "text", text: str, parent: $.root, pixelSize: large, a: a, textColor: cyan }).animateTo({ sx: 0.1, sy: 0.1 }, 5, $.animation.TWEEN_LINEAR, $.animation.OPTION_OSCILLATE, $.animation.COUNT_FOREVER);
});