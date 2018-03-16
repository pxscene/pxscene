"use strict";
px.import({scene:"px:scene.1.js",
           assert:"../test-run/assert.js",
           manual:"../test-run/tools_manualTests.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;
var manual = imports.manual;

var manualTest = manual.getManualTestValue();

var basePackageUri = px.getPackageBaseFilePath();

var urls = [
  "http://www.pxscene.org/examples/px-reference/gallery/images/apng/cube.png",     // apng
  "http://www.pxscene.org/examples/px-reference/gallery/images/star.png",          // supports plain old pngs
  "http://www.pxscene.org/examples/px-reference/gallery/images/ajpeg.jpg",         // and single frame jpegs too!!
];



var beforeStart = function() {
  // Nothing to do here...
  console.log("test_pxImage9 beforeStart.....");
  var promise = new Promise(function(resolve,reject) {
    resolve(assert(true,"beforeStart succeeded"));
  });
  return promise;
}

var tests = {

  testLoad: function() {
    console.log("Running image9 testLoad");
    return new Promise(function(resolve, reject) {

      var promises = [];
      var results = [];
      
      for( var i = 0; i < urls.length; i++) {
        promises.push( scene.create({t:"image9",url:urls[i],parent:root}).ready);
      }

 
      Promise.all(promises).then(function(objs) {
        for(var i = 0; i < objs.length; i++) {
          results.push(assert(objs[i].url === urls[i], "image9 url is not correct when queried"));
        }
      }, function(obj) {//rejected
        results.push(assert(false, "image9 load failed : "+obj));
      }).catch(function(exception) {
          results.push(assert(false, "image9 load failed : "+exception));       
      }).then(function() {
        root.removeAll();
        resolve(results);
      });
    });
  },

  testReload: function() {
    console.log("Running image9 testReload");
    return new Promise(function(resolve, reject) {

      var results = [];
      
      var image9 = scene.create({t:"image9",url:urls[0],parent:root});

      image9.ready.then( function(obj) {
        results.push(assert(obj.url === urls[0], "image9 url is not correct when queried"));
        obj.url = urls[1];
        obj.ready.then(function(newObj) {
          results.push(assert(newObj.url === urls[1], "image9 url is not correct when queried"));
        })
      }, function(obj) {//rejected
        results.push(assert(false, "image9 url set failed : "+obj));
      }).catch(function(exception) {
          results.push(assert(false, "image url set failed : "+exception));       
      }).then(function() {
        root.removeAll();
        resolve(results);
      });

    });   
  },

  testInsetsInteger: function() {
    console.log("Running image9 testInsetsInteger");
    return new Promise(function(resolve, reject) {

      var promises = [];
      var results = [];
      
      for( var i = 0; i < urls.length; i++) {
        promises.push( scene.create({t:"image9",url:urls[i],parent:root,insetLeft:5,insetRight:5,insetTop:5,insetBottom:5}).ready);
      }


      Promise.all(promises).then(function(objs) {
        for(var i = 0; i < objs.length; i++) {
          results.push(assert(objs[i].insetLeft === 5, "image9 insetLeft is not 5: "+objs[i].insetLeft));
          results.push(assert(objs[i].insetRight === 5, "image9 insetRight is not 5: "+objs[i].insetRight));
          results.push(assert(objs[i].insetTop === 5, "image9 insetTop is not 5: "+objs[i].insetTop));
          results.push(assert(objs[i].insetBottom === 5, "image9 insetBottom is not 5: "+objs[i].insetBottom));
        }
      }, function rejection(obj) {
          results.push(assert(false, "image9 inset properties failed for positive value: "+exception));       
      }).then(function() {
        root.removeAll();
        resolve(results);
      });
    });
  },

  testInsetsNegative: function() {
    console.log("Running image9 testInsetsNegative");
    return new Promise(function(resolve, reject) {

      var promises = [];
      var results = [];
      
      for( var i = 0; i < urls.length; i++) {
        promises.push( scene.create({t:"image9",url:urls[i],parent:root,insetLeft:-5,insetRight:-5,insetTop:-5,insetBottom:-5}).ready);
      }


      Promise.all(promises).then(function(objs) {
        for(var i = 0; i < objs.length; i++) {
          results.push(assert(objs[i].insetLeft === -5, "image9 insetLeft is not -5: "+objs[i].insetLeft));
          results.push(assert(objs[i].insetRight === -5, "image9 insetRight is not -5: "+objs[i].insetRight));
          results.push(assert(objs[i].insetTop === -5, "image9 insetTop is not -5: "+objs[i].insetTop));
          results.push(assert(objs[i].insetBottom === -5, "image9 insetBottom is not -5: "+objs[i].insetBottom));
        }
      }, function rejection(obj) {
          results.push(assert(false, "image9 inset properties failed for negative value: "+exception));       
      }).then(function() {
        root.removeAll();
        resolve(results);
      });
    });
  },

  testInsetsZeroValue: function() {
    console.log("Running image9 testInsetsZeroValue");
    return new Promise(function(resolve, reject) {

      var promises = [];
      var results = [];
      
      var value = 0;
      for( var i = 0; i < urls.length; i++) {
        promises.push( scene.create({t:"image9",url:urls[i],parent:root,insetLeft:value,insetRight:value,insetTop:value,insetBottom:-value}).ready);
      }


      Promise.all(promises).then(function(objs) {
        for(var i = 0; i < objs.length; i++) {
          results.push(assert(objs[i].insetLeft === value, "image9 insetLeft is not "+value+": "+objs[i].insetLeft));
          results.push(assert(objs[i].insetRight === value, "image9 insetRight is not "+value+": "+objs[i].insetRight));
          results.push(assert(objs[i].insetTop === value, "image9 insetTop is not "+value+": "+objs[i].insetTop));
          results.push(assert(objs[i].insetBottom === value, "image9 insetBottom is not "+value+": "+objs[i].insetBottom));
        }
      }, function rejection(obj) {
          results.push(assert(false, "image9 inset properties failed for zero value: "+exception));       
      }).then(function() {
        root.removeAll();
        resolve(results);
      });
    });
  },

 testImage9Resource: function() {
   console.log("Running image9 testImage9Resource");
    return new Promise(function(resolve, reject) {

      var results = [];

      var imageResource = scene.create({t:"imageResource", url:urls[0]});
      var image = scene.create({t:"image9",resource:imageResource,parent:root});

      Promise.all([imageResource.ready,image.ready]).then(function(objs) {
        results.push(assert(objs[0].url == urls[0], "image url is not correct when created with resource"));
        results.push(assert(objs[1].url == urls[0], "imageResource url is not correct: "+objs[1].url ));

      }, function rejection() {
        results.push(assert(false, "imageResource for image9 failed : "+exception));      
      }).then(function() {
        root.removeAll();
        resolve(results);
      });

    });
  }
  ,
  // Trying to load an imageAResource should fail for pxImage
 testImageResourceFailure: function() {
   console.log("Running image9 testImageResourceFailure");
    return new Promise(function(resolve, reject) {

      var results = [];

      var imageAResource = scene.create({t:"imageAResource", url:urls[0]});
      var image = scene.create({t:"image9",resource:imageAResource,parent:root});

      Promise.all([imageAResource.ready,image.ready]).then(function(objs) {
        results.push(assert(objs[0].url == urls[0], "image url is not correct when created with resource"));
        results.push(assert(objs[1].url == urls[0], "imageAResource url is not correct"));

      }, function rejection(obj) {
        results.push(assert(true, "imageAResource for image9 correctly caused pxImage promise rejection : "));      
      }).then(function() {
        root.removeAll();
        resolve(results);
      });

    });
 } 


}
module.exports.tests = tests;
module.exports.beforeStart = beforeStart;

if(manualTest === true) {

  manual.runTestsManually(tests, beforeStart);

}

}).catch( function importFailed(err){
  console.error("Import for test_pxImage9.js failed: " + err)
});
