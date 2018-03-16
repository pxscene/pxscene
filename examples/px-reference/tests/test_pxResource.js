"use strict";
px.import({scene:"px:scene.1.js",assert:"../test-run/assert.js"}).then( function ready(imports) {

var scene = imports.scene;
var root = imports.scene.root;
var assert = imports.assert.assert;

root.w = 800;
root.h = 300;

var basePackageUri = px.getPackageBaseFilePath();


module.exports.beforeStart = function() {
  console.log("test_pxResource beforeStart()!");
  var promise = new Promise(function(resolve,reject) {
    resolve("beforeStart");
  });
  return promise;
}

var tests = {
  test1: function() {
  return new Promise(function(resolve, reject) {
  var imageRes = scene.create({t:"imageResource",parent:root, url:"http://pxscene.org/images/dolphin.jpg"});
  imageRes.ready.then(function()  {
    console.log("test1: imageRes ready");
      var results = [];
      // check value 
      var loadStatus = imageRes.loadStatus;
      results.push(assert(loadStatus["statusCode"]==0,"status code is not proper"));
      results.push(assert(loadStatus["sourceType"]=="http","load type is not proper"));
      results.push(assert(imageRes.w != 0 ,"image width is 0"));
      results.push(assert(imageRes.h != 0,"image height is 0"));
      resolve(results);
    });
  });
  },

  test2: function() {
    return new Promise(function(resolve, reject) {
    var imageA = scene.create({t:"imageA",parent:root, url:"http://pxscene.org/images/dolphin.jpg"});
    imageA.ready.then(function()  {
      console.log("test2: imageA ready");
      var results = [];
      var res = imageA.resource;
      var loadStatus = res.loadStatus;
      // check value 
      results.push(assert(imageA.url=="http://pxscene.org/images/dolphin.jpg","url is not proper"));
      results.push(assert(loadStatus["statusCode"]==0,"status code is not proper"));
      results.push(assert(loadStatus["sourceType"]=="http","load type is not proper"));
      resolve(results);
    });
  });
  },

  test3: function() {
    return new Promise(function(resolve, reject) {
    var imageA = scene.create({t:"imageA",parent:root, url:"http://pxscene.org/images/dolphin.jpg"});
    imageA.ready.then(function()  {
      console.log("test3: imageA ready");
      var results = [];
      var res = imageA.resource;
      var loadStatus = res.loadStatus;
      // check value 
      results.push(assert(imageA.url=="http://pxscene.org/images/dolphin.jpg","url is not proper"));
      resolve(results);
    });
  });
  }
}
module.exports.tests = tests;


}).catch( function importFailed(err){
  console.log("err: "+err);
  console.error("Import for test_pxResource.js failed: " + err)
});
