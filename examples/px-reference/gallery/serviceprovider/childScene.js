px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;

  console.log("###########  serviceprovider/childScene.js");

  
  scene.addServiceProvider(function(serviceName, serviceCtx){
    console.log("looking for service for " +serviceCtx.url);
    if (serviceName == "org.blah.localService")
      return {name:"localService"};  // return a javascript object that represents the service
    else if (serviceName == "org.blah.interceptedService") {
      var p = scene.getService("org.blah.parentService")
      return {name: "interceptedService", parent: p};
    }
    else
      return "allow"; // allow request to bubble to parent
  });
  


  var localService = scene.getService("org.blah.localService");

  console.log(localService?"got service: "+localService.name:"failed to get localService");

  var parentService = scene.getService("org.blah.parentService");

  console.log(parentService?"got service: "+parentService.name:"failed to get parentService");

  var interceptedService = scene.getService("org.blah.interceptedService");

  console.log(interceptedService?"got service: "+interceptedService.name+";"+interceptedService.parent.name:"failed to get interceptedService");


  scene.create({t:"rect",w:100,h:100,parent:scene.root}).on("onMouseDown", function(e){
    console.log("click");
    var n = scene.getService(".navigate");
    if (n) {
      console.log("before navigation request");
      n.setUrl("http://www.pxscene.org/examples/px-reference/gallery/gallery.js");
    }
    else console.log(".navigate service not available");
  });

});
