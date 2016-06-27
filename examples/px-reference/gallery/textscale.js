px.import("px:scene.1.js").then( function ready($) {

    var t2 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:120,textColor:0xff0000ff});
    var t3 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:12,textColor:0xffff00ff});
    var t4 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:12,textColor:0x00ffffff});
    var t1 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:0,y:0,pixelSize:12,a:0.75});

    t1.animateTo({sx:50,sy:50},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    t3.animateTo({sx:10.0,sy:50},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    t4.animateTo({sx:50,sy:10.0},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    t2.animateTo({sx:0.1,sy:0.1},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);

});
