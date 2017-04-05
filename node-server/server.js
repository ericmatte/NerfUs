var express = require('express'); 
var mysql = require('mysql');
var app = express();
var port = 8888; //process.env.PORT
var wsPort = 8000;

/** MySQL connection */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbAdmin',
    password: 'Glad0Scake',
    database: 'nerfus'
});
connection.connect();

/** Serving server files and app properties */
app.set('port', port);
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use("/static", express.static(__dirname + '/public'));

module.exports = {
    app: app,
    connection: connection,
    wsPort: wsPort
};

require('./routes');
require('./websockets');

/** Starting server */
app.listen(app.get('port'), function(){
    console.log('Node server running @ http://localhost:' + app.get('port') + '/')
});
