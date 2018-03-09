px.import({ws: 'ws'
}).then( function importsAreReady(imports)
{
  var ws = imports.ws;
  var wsurl  = "wss://px-wss.sys.comcast.net:8443/websocket";
  var mySocket = new ws(wsurl,"",undefined);
  function open()
  {
    var newJson =  {};
    mySocket.send(JSON.stringify(newJson));
    console.log("websocket open ***********************");  
  }

  function message(msg)
  {
    console.log("websocket msg ***********************" + msg);  
  }

  function close()
  {
    console.log("websocket close ***********************");  
  }

  function error(msg)
  {
    console.log("websocket error ***********************");  
  }
  mySocket.on('open', open);
  mySocket.on('message', message);
  mySocket.on('close', close);
  mySocket.on('error', error); 
}).catch( function importFailed(err){
  console.error("Import failed for test_ws.js: " + err)
});
