px.import("px:scene.1.js").then( function ready($) {

    let a = 0.75;
    let small = 24;
    let large = 240;
    let red = 0xff0000ff;
    let white = 0xffffffff;
    let cyan = 0x00ffffff;
    let yellow = 0xffff00ff;
    let black = 0x000000ff;
    let str = "Iñtërnâtiônàližætiøn";

    // small pixelSize scale up and down
    $.create({t:"text",text:str,parent:$.root,pixelSize:small,a:1.0,textColor:red})
        .animateTo({sx:20,sy:20},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    $.create({t:"text",text:str,parent:$.root,pixelSize:small,a:a,textColor:white})
        .animateTo({sx:3.0,sy:20},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    $.create({t:"text",text:str,parent:$.root,pixelSize:small,a:a,textColor:yellow})
        .animateTo({sx:20,sy:3.0},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
    // large pixelSize scale down and up
    $.create({t:"text",text:str,parent:$.root,pixelSize:large,a:a,textColor:cyan}) 
        .animateTo({sx:0.1,sy:0.1},5,$.animation.TWEEN_LINEAR,$.animation.OPTION_OSCILLATE,$.animation.COUNT_FOREVER);
});
