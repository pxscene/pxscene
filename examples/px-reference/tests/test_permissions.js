/**
 * Test for pxscene security model for URL
 *
 * Verifies that HTTP requests succeed when not blocked by scene permissions
 */

'use strict';

px.import({
  scene: 'px:scene.1.js',
  http: 'http',
  https: 'https'
})
.then(function(imports) {

  var http_module = imports.http;
  var https_module = imports.https;

  module.exports.make_request = function (url, timeout) {
    return new Promise(function(resolve, reject) {
      let moduleFn = url.indexOf("https") === 0 ? https_module.request : http_module.request;
      let req = moduleFn(url, resolve);
      if (req) {
        req.setTimeout(timeout, function () {
          reject("request timeout");
        });
        req.on("error", reject);
        req.end();
      } else {
        reject("request is null");
      }
    });
  }

  var child_scene = null;
  var child_scene_permissions = px.appQueryParams.role === "untrust" ?
    { "url" : { "allow" : [ "*" ], "block" : [ "https://*.github.com" ] } } :
    (px.appQueryParams.role === "limited_trust" ?
      { "url" : { "allow" : [ "*", "*://developer.github.com" ], "block" : [ "https://*.github.com" ] } } :
      { "url" : { "allow" : [ "*" ] } });

  if (px.appQueryParams.role) {
    module.exports.beforeStart = function () {
      return new Promise(function (resolve, reject) {
        let scene = imports.scene;
        let new_scene = scene.create({
          t: 'scene',
          parent: scene.root,
          url: px.getPackageBaseFilePath() + "/test_permissions.js",
          permissions: child_scene_permissions,
          w: scene.w,
          h: scene.h
        });
        new_scene.ready.then(function () {
          console.log("child scene ready: " + px.appQueryParams.role);
          child_scene = new_scene;
          resolve();
        });
      });
    };
  }

  function make_test(url, allow) {
    return function () {
      return child_scene.api.make_request(url, 5000).then(function () {
        return allow ? "SUCCESS" : "FAILURE";
      }, function (why) {
        if (why === "request is null") {
          return allow ? "FAILURE" : "SUCCESS";
        }
        console.error("Request to '"+url+"' failed unexpectedly: "+why);
        return "SUCCESS";
      });
    };
  }

  module.exports.tests = {
    test:  make_test('https://developer.github.com/', px.appQueryParams.role !== 'untrust')
  };
});
