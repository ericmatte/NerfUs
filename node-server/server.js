var express = require('express'); 
var mysql = require('mysql');
var app = express();
var port = process.env.PORT || 5000
var wsPort = port + 1;

// MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'dbAdmin',
    password: 'Glad0Scake',
    database: 'nerfus'
});
connection.connect();

/** Return the result from the query to the database */
function databaseQuery(query, params) {
    var query = connection.query(query, params, function(err, result) {
        return result;
    });
}

/** Return a server response containing the result */
function databaseQuery(res, query, params) {
    var query = connection.query(query, params, function(err, result) {
        if (err) { 
            console.error(err);
            return res.send(400, err);
        } else {
            return res.send(200, result);
        }
    });
}

// Serving server files and app properties
app.set('port', port);
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use("/static", express.static(__dirname + '/public'));

module.exports = {
    app: app,
    connection: connection,
    databaseQuery: databaseQuery,
    wsPort: wsPort
};
require('./routes');
require('./websockets');

// Starting server
//var http = require('http');
//http.createServer(app).listen(app.get('port'), function() {
app.listen(app.get('port'), function(){
    console.log('Node server running @ http://localhost:' + app.get('port'))
});
