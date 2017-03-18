px.import("px:scene.1.js").then( function ready($) {

    var t1 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:24,a:0.75,sx:1,sy:1});  // white
    t1.animateTo({sx:20,sy:20},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    var t2 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:120,textColor:0xff0000ff}); // red
    t2.animateTo({sx:0.1,sy:0.1},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    var t3 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:24,textColor:0xffff00ff});  // yellow
    t3.animateTo({sx:20.0,sy:50},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    var t4 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:24,textColor:0x00ffffff});  // cyan
    t4.animateTo({sx:50,sy:20.0},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);

});
