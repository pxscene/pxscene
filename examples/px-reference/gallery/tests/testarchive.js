px.import("px:scene.1.js").then(function(scene) {

  scene.create({t:"text",text:"Archive Test.  See Console Output.",
                parent:scene.root});

  function testLoadArchive(u,f) {
    scene.loadArchive(u)
      .ready.then(function(a) {
        console.log("---------------------------");
        console.log("");
        console.log("loadArchive succeeded for (",u,").");
        console.log("files: ", a.fileNames);
        console.log("file data: >>>>>>");
        console.log(a.getFileAsString(f));
        console.log("<<<<<<");
        console.log("loadStatus:", a.loadStatus);
      }, function(a){
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX");
        console.log("");
        console.log("loadArchive failed for (",u,").");
      });
  }


  var baseUrl = "http://www.pxscene.org/examples/px-reference/gallery/tests/"

  testLoadArchive("fail","");

  // files
  //testLoadArchive("start.sh","");
  //testLoadArchive("gallery.zip","hello.js");

  // remote urls
  //testLoadArchive(baseUrl+"fail","");
  testLoadArchive(baseUrl+"fonts.js","");
  testLoadArchive(baseUrl+"gallery.zip","hello.js");

  // Takes a few seconds to time out
  //testLoadArchive("http://abc.abc.abc","");

});
