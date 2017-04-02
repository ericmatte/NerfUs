var server = require('./server');
var app = server.app;

// Application entry point
app.get('/',function(req,res){
    res.sendFile('index.html',{'root': __dirname + '/public/templates'});
})

app.post('/get-guns', function(req, res, next){
    // var cope = req.body.params;
    return server.databaseQuery(res, 'SELECT * FROM nerfus.gun');
});

app.post('/get-games', function(req, res, next){
    return server.databaseQuery(res, 'SELECT * FROM nerfus.game');
});