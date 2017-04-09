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
    server.connection.query(query, params, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(400).send(err);
        } else {
            return res.status(200).send(result);
        }
    });
}

/** Application entry point */
app.get('/', function (req, res) {
    res.sendFile('base.html', { 'root': __dirname + '/public' });
});

/** Get the complete list of guns */
app.post('/get-guns', function (req, res, next) {
    return databaseQuery('SELECT * FROM gun', [], res);
});

/** Get the complete list of games */
app.post('/get-games', function (req, res, next) {
    return databaseQuery('SELECT * FROM game', [], res);
});

/** Get the leaderboard of player score */
app.post('/get-leaderboard', function (req, res, next) {
    return databaseQuery('SELECT player, max(score) AS score FROM nerfus.match GROUP BY match.player ORDER BY score DESC LIMIT 10', [], res);
});

/** Get the leaderboard of player score */
app.post('/save-player-score', function (req, res, next) {
    var q = 'INSERT INTO nerfus.match (gun_id, game_id, player, score, length, average_reflex_time, enemy_killed, innocent_harmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var b = req.body;
    var p = [b.gun.gun_id, b.game.game_id, b.playerName, b.report.score, b.report.gameLength, b.report.averageReflexTime, b.report.enemies, b.report.allies];

    server.connection.query(q, p, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(400).send(err);
        } else {
            return res.status(200).send('saved');
        }
    });
});