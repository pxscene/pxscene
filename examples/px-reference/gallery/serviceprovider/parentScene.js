px.import("px:scene.1.js").then( function ready(scene) {
  var root = scene.root;

  console.log("###########  serviceprovider/childScene.js");

  
  scene.addServiceProvider(function(serviceName, serviceCtx){
    console.log("looking for service");
    if (serviceName == "org.blah.parentService")
      return {name:"parentService"};  // return a javascript object that represents the service
    else
      return "allow"; // allow request to bubble to parent
  });
  
  var basePackageUri = px.getPackageBaseFilePath();
  scene.create({t:"scene",w:800,h:600,parent:scene.root,url:basePackageUri+"/childScene.js"})


});