px.import("px:scene.1.js").then(function(scene) {

  var i
  var resolved = false

  module.exports._ready = new Promise(function(resolve, reject){
    var url = px.appQueryParams.url;
    
    i = scene.create({t:'image',url:url,parent:scene.root,stretchX:scene.stretch.STRETCH,stretchY:scene.stretch.STRETCH,a:0})
    i.ready.then(function(o){
      module.exports._preferredW=o.resource.w
      module.exports._preferredH=o.resource.h

      resolved = true
      updateSize(scene.w,scene.h)
      i.animate({a:1},0.3,scene.animation.TWEEN_STOP,scene.animation.OPTION_LOOP,1)

      resolve(o)
    })
  })

  function updateSize(w,h) {
    if (resolved) {
      var sx = i.resource.w>0?w/i.resource.w:1
      var sy = i.resource.h>0?h/i.resource.h:1

      i.sx = i.sy = (sx<sy)?sx:sy
    }
  }

  scene.on("onResize", function(e) { updateSize(e.w,e.h) })

  updateSize(scene.w,scene.h)

})