var server = require('./server');
var ws = require('./websockets');
var app = server.app;

/** Make a server response with the result of the database query
 * Eg.: query='SELECT * FROM table WHERE table.id=?' params=[21]
 * @param {String} query The query to send to the server
 * @param {List} params The list of parameters for the query
 * @param {Response} res The http response object
 * @return {String} An http response from the database result and the res object
 */
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

/** Application entry point */
app.get('/',function(req,res){
    res.sendFile('base.html', {'root': __dirname + '/public'});
});

/** Get the complete list of guns */
app.post('/get-guns', function(req, res, next){
    return databaseQuery('SELECT * FROM nerfus.gun', [], res);
});

/** Get the complete list of games */
app.post('/get-games', function(req, res, next){
    return databaseQuery('SELECT * FROM nerfus.game', [], res);
});