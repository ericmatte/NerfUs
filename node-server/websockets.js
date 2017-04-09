var server = require('./server');
const WebSocket = require('ws');

/** Starting WebSocket Server */
const wss = new WebSocket.Server({ port: server.wsPort });
console.log('Websocket listening @ ws://localhost:' + server.wsPort + '/')

/** Assemble an event and the data in a format ready for websocket transmission
 * @param {String} event The event to trigger
 * @param {JSON} data The associated data
 * @return {String} A formatted string
 */
function assembleSocket(event, data) {
    if (data === undefined) {
        return '{"event":"' + event + '"}';
    } else {
        return '{"event":"' + event + '","data":' + JSON.stringify(data) + '}';
    }

}

/** Transmit a socket to all connected clients
 * @param {String} socket The socket to send
 */
wss.broadcast = function broadcast(socket) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(socket);
        }
    });
};


/** Trigger: A new client connects to the websocket server
 * @param {WebSocket} ws The websocket associated with this connection
 */
wss.on('connection', function connection(ws) {
    console.log("New websocket connection");

    /** Trigger: Received a message from the current client
     * @param {String} message The message received
     */
    ws.on('message', function incoming(message) {
        console.log("Received " + message);
        try {
            var socket = JSON.parse(message);
            handleSocket(socket.event, socket.data, ws);
        }
        catch (err) {
            // Scream server example: "hi" -> "HI!!!" 
            ws.send(JSON.stringify(message).toUpperCase() + "!!!");
        }
    });
});

/** Handle all received messages that has at least event and optional data
 * Supported websocket form : {"event":"chat","data":"Message test"}
 * @param {String} event The event of the message
 * @param {JSON} data The associated data
 */
function handleSocket(event, data, ws) {
    switch (event.toLowerCase()) {
        case 'mbed':
            if (data.state == 'connected') {
                game.coordinator = ws;
                ws.on('close', function close() {
                    console.log('Coordinator disconnected.');
                    game.coordinator = undefined;
                    requestGameChange();
                });
            } else {
                game.coordinator = undefined;
            }
            requestGameChange();
            break;

        case 'reset_game':
            game.gun = undefined;
            game.game = undefined;
            game.gameOn = false;
            game.gameStarted = false;
            game.state = 'Start Screen';
            requestGameChange();
            break;

        case 'fetch_game':
            requestGameChange();
            break;

        case 'start':
            updateGameState();
            requestGameChange();
            break;

        case 'gun':
            var q = 'SELECT * FROM gun WHERE gun.rfid_code = ?';
            server.connection.query(q, data.rfid_code, function (err, gun) {
                game.gun = gun[0];
                requestGameChange();
            });
            break;

        case 'game':
            var q = 'SELECT * FROM game WHERE game.game_id = ?';
            server.connection.query(q, data.game_id, function (err, gameMode) {
                game.game = gameMode[0];
                requestGameChange();
            });
            break;

        case 'report':
            game.report = data;
            if (game.timer != undefined) {
                stopGame();
            }
            break;

        case 'navigate':
            navigate(data.direction);
            break;

        case 'chat':
        default:
            wss.broadcast(assembleSocket(event, data));
            break;
    }
}

/** Game variables
 * @param {Boolean} inGame When true, the app will follow the games variables
 * @param {Dict} gun The selected gun
 * @param {Dict} game The selected game
 * @param {Boolean} coordinator true if a coordinator is connected
 */
var game = {
    gun: undefined, game: undefined, gameOn: false, coordinator: undefined,
    state: 'Start Screen',
    // The list of path that the game must follow
    paths: {
        'Start Screen': '/',
        'Gun Selection': '/gun-selection',
        'Game Selection': '/game-selection',
        'Mission Summary': '/ready',
        'Game On': '/game-on',
        'Mission Report': '/mission-report'
    }
};

module.exports = {
    game: game
};

/** Handle app in mennu navigation
 * @param {JSON} data The associated data
 */
function navigate(direction) {
    switch (game.state) {
        case 'Gun Selection':
            server.connection.query('SELECT * FROM gun', function (err, guns) {
                if (!game.gun) {
                    game.gun = guns[0];
                } else {
                    var index = guns.map(function (e) { return e.gun_id; }).indexOf(game.gun.gun_id);
                    game.gun = guns[getNewIndex(direction, index, guns.length)];
                }
                requestGameChange();
            });
            break;
        case 'Game Selection':
            server.connection.query('SELECT * FROM game', function (err, games) {
                if (!game.game) {
                    game.game = games[0];
                } else {
                    var index = games.map(function (e) { return e.game_id; }).indexOf(game.game.game_id);
                    game.game = games[getNewIndex(direction, index, games.length)];
                }
                requestGameChange();
            });
            break;
    }
}

/** Allow index incrementation/decrementation for a list
 * @param {Number} direction 'next' (+1) or 'previous' (-1)
 * @param {Number} index The current index in the list
 * @param {Number} arrayLength The list length
 * @return {Array} The new index
 */
function getNewIndex(direction, index, arrayLength) {
    index += ((direction == 'next') ? 1 : -1);
    index = (index < 0) ? 0 : (index >= arrayLength) ? arrayLength - 1 : index;
    return index;
}

/** Handle app game navigation */
function requestGameChange(changeState) {
    var params = {
        coordinator: (game.coordinator != undefined),
        gun: game.gun,
        game: game.game,
        report: game.report,
        path: game.paths[game.state]
    };

    wss.broadcast(assembleSocket('game_changed', params));
}

function startGame() {
    var countDown = 3;
    var remainingTime = game.game.length;
    const timer_precision = 100;

    function sendRemainingTime() {
        game.timer = setInterval(function () {
            remainingTime -= timer_precision;
            wss.broadcast(assembleSocket('remainingTime', remainingTime));

            if (remainingTime <= 0) {
                game.coordinator.send(assembleSocket('request_report'));
                stopGame();
            }
        }, timer_precision);
    }

    function sendCountDown() {
        setTimeout(function () {
            countDown--;
            wss.broadcast(assembleSocket('countdown', countDown));

            if (countDown > 0) {
                sendCountDown();

            } else {
                game.coordinator.send(assembleSocket('start_game', game.game));
                sendRemainingTime();
            }
        }, 1000);
    }

    sendCountDown();
}

function stopGame() {
    clearInterval(game.timer);
    game.timer = undefined;
    game.state = 'Mission Report';
    requestGameChange();
}

function updateGameState() {
    switch (game.state) {
        case 'Start Screen':
            game.state = 'Gun Selection';
            break;

        case 'Gun Selection':
            if (game.gun) {
                game.state = 'Game Selection';
            }
            break;

        case 'Game Selection':
            if (game.game) {
                game.state = 'Mission Summary';
            }
            break;

        case 'Mission Summary':
            if (game.coordinator) {
                startGame();
                game.state = 'Game On';
            }
            break;

        case 'Game On':
            break;

        case 'Mission Report':
            break;

        default:
            throw new Error('Game state "' + game.state + '" was not recognized!');
            break;
    }
}