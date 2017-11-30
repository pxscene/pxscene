px.import({http: 'http'
}).then( function importsAreReady(imports)
{
  var http = imports.http;

  var keepAliveAgent = new http.Agent({ keepAlive: true });
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

  http.request(options, callback).end();

  console.log(http.METHODS);

  http.get("http://localhost/test.html",function(res) {

  console.log("Returned status code is " + res.statusCode + "content type: " + res.headers['content-type'],res.httpVersion);
});
  var client = http.createClient(80, 'localhost');
  var headers = {
      'Host': 'localhost'
  };

  var request = client.request('POST', '/', headers);
  request.on('response', function(response) {
    response.on('data', function(chunk) {
       console.log("response from client request " + response);
    });
    response.on('end', function() {
    });
  });
}).catch( function importFailed(err){
  console.error("Import failed for test_http.js: " + err)
});
