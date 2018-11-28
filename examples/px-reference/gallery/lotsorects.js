px.import("px:scene.1").then(function(scene) {

  var root = scene.root;
  var margin = 75;

  function randomColor() {
    return (Math.random()*(1<<24)<<8)|0xff
  }

  for (var i = 0; i < 2500; i++) {
    scene.create({t:"rect",parent:root,fillColor:randomColor(),a:0}).ready.then(function(o){
      o.w = (Math.random()*200)+100;
      o.h = (Math.random()*200)+100;
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