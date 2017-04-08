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
                    requestGameChange(false);
                });
            } else {
                game.coordinator = undefined;
            }
            requestGameChange(false);
            break;

        case 'reset_game':
            game.gun = undefined;
            game.game = undefined;
            game.gameOn = false;
            game.gameStarted = false;
            game.currentPath = game.paths[0];
            requestGameChange(false);
            break;

        case 'fetch_game':
            requestGameChange(false);
            break;

        case 'start':
            requestGameChange(true);
            break;

        case 'gun':
            var q = 'SELECT * FROM nerfus.gun WHERE nerfus.gun.rfid_code = ?';
            server.connection.query(q, data.rfid_code, function (err, gun) {
                game.gun = gun[0];
                requestGameChange(false);
            });
            break;

        case 'game':
            var q = 'SELECT * FROM nerfus.game WHERE nerfus.game.game_id = ?';
            server.connection.query(q, data.game_id, function (err, gameMode) {
                game.game = gameMode[0];
                requestGameChange(false);
            });
            break;

        case 'report':
            if (game.timer != undefined) {
                clearInterval(game.timer);
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
    currentPath: '/',
    // The list of path that the game must follow
    paths: ['/', '/gun-selection', '/game-selection', '/ready', '/game-on']
};

module.exports = {
    game: game
};

/** Handle app in mennu navigation
 * @param {JSON} data The associated data
 */
function navigate(direction) {
    switch (game.currentPath) {
        case game.paths[1]: // Gun Selection Menu
            server.connection.query('SELECT * FROM nerfus.gun', function (err, guns) {
                if (!game.gun) {
                    game.gun = guns[0];
                } else {
                    var index = guns.map(function (e) { return e.gun_id; }).indexOf(game.gun.gun_id);
                    game.gun = guns[getNewIndex(direction, index, guns.length)];
                }
                requestGameChange(false);
            });
            break;
        case game.paths[2]: // Game Selection Menu
            server.connection.query('SELECT * FROM nerfus.game', function (err, games) {
                if (!game.game) {
                    game.game = games[0];
                } else {
                    var index = games.map(function (e) { return e.game_id; }).indexOf(game.game.game_id);
                    game.game = games[getNewIndex(direction, index, games.length)];
                }
                requestGameChange(false);
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

/** Handle app game navigation
 * @param {Boolean} changePath If true, will force the frontend to change it`s location path according to the server
 */
function requestGameChange(changePath) {
    var params = {
        coordinator: (game.coordinator != undefined),
        gun: game.gun,
        game: game.game,
        path: game.currentPath
    };

    if (changePath) {

        if (!game.gun && !game.game) {
            // Go to Gun Selection Menu
            params.path = game.paths[1];

        } else if (game.gun && !game.game) {
            // Go to Game Selection Menu
            params.path = game.paths[2];

        } else if (game.gun && game.game && !game.gameOn) {
            // Go to Mission Summary
            params.path = game.paths[3];
            game.gameOn = true;

        } else if (game.gun && game.game && game.gameOn) {
            if (game.coordinator) {
                // The game has started!
                params.path = game.paths[4];

                if (!game.gameStarted) {
                    startGame();
                    game.gameStarted = true;
                }
            }
        }

        game.currentPath = params.path;
    }

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
                clearInterval(game.timer);
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