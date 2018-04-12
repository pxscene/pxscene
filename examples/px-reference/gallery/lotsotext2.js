px.import("px:scene.1").then(function(scene) {

  var root = scene.root;
  var margin = 75;

  var fonts = [
    scene.create({t:'fontResource',url:'http://www.pxscene.org/examples/px-reference/fonts/IndieFlower.ttf'}),
    scene.create({t:'fontResource',url:'http://www.pxscene.org/examples/px-reference/fonts/DejaVuSans.ttf'}),
    scene.create({t:'fontResource',url:'http://www.pxscene.org/examples/px-reference/fonts/DancingScript-Regular.ttf'})
  ]

  function randomFont() {
    var val = Math.random();
    if( val < 0.3) return 0;
    if(val >0.3 && val < 0.6) return 1;
    return 2;
  }
  function randomColor() {
    return (Math.random()*(1<<24)<<8)|0xff
  }

  for (var i = 0; i < 2500; i++) {
    scene.create({t:"text",text:"Spark Rocks!",parent:root,pixelSize:40,textColor:randomColor(),font:fonts[randomFont()]}).ready.then(function(o){
      o.x = (Math.random()*(scene.w-o.w-(margin*2)))+margin;
      o.y = (Math.random()*(scene.h-o.h-(margin*2)))+margin;
      o.a = (Math.random()*0.7)+0.3;
      o.cx = o.w/2;
      o.cy = o.h/2;
      o.r = Math.random()*360;
      var direction = Math.random()<0.5?-1:1;
      var speed = (Math.random()*5)+0.3;
      o.animateTo({r:o.r+(360*direction)},speed,scene.animation.LINEAR,scene.animation.OPTION_LOOP, scene.animation.COUNT_FOREVER);
    });
  }
  
});