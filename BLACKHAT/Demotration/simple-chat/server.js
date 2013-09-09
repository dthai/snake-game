var ws = require('websocket.io')
  	, http = require('http')
  	, fs = require('fs')
    , path  = require('path')
    , mime  = require('mime'); 

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
    response.end(fileContents);
}

function serveStatic(response, absPath) {
  fs.exists(absPath, function(exists) { 
    if (exists) {
      fs.readFile(absPath, function(err, data) { 
        if (err) {
          send404(response);
        } else {
          sendFile(response, absPath, data); 
        }
      });
    } else {
      send404(response); 
    }
  });

}

httpServer = http.createServer(function(request, response) {
  var filePath = false;
  console.log(request.url);

  if (request.url == '/') {
    filePath = 'public/index.html'; 
  } else {
    filePath = 'public' + request.url; 
  }
  var absPath = './' + filePath;
  serveStatic(response, absPath); 
});

httpServer.listen(3000, function() {
  console.log('Server is listening on port 3000');

});

server = ws.attach(httpServer);

//Start chat server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);