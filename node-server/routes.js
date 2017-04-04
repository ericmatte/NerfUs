var server = require('./server');
var app = server.app;

/** Make a server response with the result of the database query */
function databaseQuery(query, params, res) {
    var query = server.connection.query(query, params, function(err, result) {
        if (err) { 
            console.error(err);
            return res.status(400).send(err);
        } else {
            return res.status(200).send(result);
        }
    });
}

// Application entry point
app.get('/',function(req,res){
    res.sendFile('index.html', {'root': __dirname + '/public/templates'});
});

app.post('/get-guns', function(req, res, next){
    return databaseQuery('SELECT * FROM nerfus.gun', [], res);
});

app.post('/get-games', function(req, res, next){
    return databaseQuery('SELECT * FROM nerfus.game', [], res);
});