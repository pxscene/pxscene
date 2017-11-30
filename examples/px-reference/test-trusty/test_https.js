px.import({https: 'https'
}).then( function importsAreReady(imports)
{
  var https = imports.https;
  var keepAliveAgent = new https.Agent({ keepAlive: true });
  var options = {
    host: 'localhost',
    path: '/test.html',
  };
  options.agent = keepAliveAgent;
  
  callback = function(response) {
    var str = '';
  
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    response.on('end', function () {
      console.log(str);
    });
  }
  https.request(options, callback).end();
  https.get("https://localhost/test.html",function(res) {
  console.log("Returned status code is " + res.statusCode + "content type: " + res.headers['content-type'],res.httpVersion);
});
}).catch( function importFailed(err){
  console.error("Import failed for test_https.js: " + err)
});
