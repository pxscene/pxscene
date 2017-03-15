px.import({net: 'net'
}).then( function importsAreReady(imports)
{
  var net  = imports.net;
  var client = new net.Socket();
  console.log("Validation !!! " + net.isIP("10.0.0.0") + " " + net.isIPv4("10.0.0.0") + " " + net.isIPv6("1200:0000:AB00:1234:0000:2552:7777:1313"));
  client.connect(52275, '127.0.0.1', function() {
  	console.log('Connected');
  	client.write('Hello, server');
  });
  var i = 0;
  client.on('data', function(data) {
  	console.log('Received: ' + data);
  	i++;
  	if(i==2)
  		client.destroy(); 
  });
  client.on('close', function() {
  	console.log('Connection closed');
  });


  //createconnection test
  const client2 = net.createConnection({port: 52275,host:"12.0.0.7",timeout:3000}, () => {
    console.log('connected to server!');
    client2.write('world!\r\n');
  });
  client2.on('data', (data) => {
    console.log(data.toString());
    client2.end();
  });
  client2.on('end', () => {
    console.log('disconnected from server');
  });
  client2.on('timeout', () => {
    console.log('timedout from server');
  });
}).catch( function importFailed(err){
  console.error("Import failed for test_net.js: " + err)
});
