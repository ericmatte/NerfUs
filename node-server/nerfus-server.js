var http = require('http');
var app = require('./app');

http.createServer(app.handleRequest).listen(9090, '127.0.0.1');
console.log('Server running at 127.0.0.1:9090/');
