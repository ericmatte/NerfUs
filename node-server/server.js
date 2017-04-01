var express = require('express'); 
var mysql = require('mysql');
var app = express();
var port = 8080;

var connection = mysql.createConnection({
     host: 'localhost',
     user: 'dbAdmin',
     password: 'Glad0Scake',
     database: 'nerfus'
});
connection.connect();

app.post('/api/book', function(req, res, next){
   var cope = req.body.params;
   var query = connection.query('insert into cope set ?', cope, function(err, result) {
     if (err) {
       console.error(err);
       return res.send(err);
     } else {
       return res.send('Ok');
     }
   });
});

app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use("/static", express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/public/templates'});
})

app.listen(port,function(){
    console.log('Node server running @ http://localhost:' + port)
});

// var http = require('http');
// var app = require('./app');

// http.createServer(app.handleRequest).listen(9090, '127.0.0.1');
// console.log('Server running at 127.0.0.1:9090/');
