px.import("px:scene.1.js").then( function ready($) {

    var t2 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:50,y:50,pixelSize:120,textColor:0xff0000ff})
    var t1 = $.create({t:"text",text:"Iñtërnâtiônàližætiøn",parent:$.root,x:50,y:50,pixelSize:12});

    t1.animateTo({sx:50,sy:50},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    t2.animateTo({sx:0.1,sy:0.1},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);

});
