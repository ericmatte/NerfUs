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
    return '{"event":"' + event + '","data":' + JSON.stringify(data) + '}';
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

/** Game logics */
var game = { 'gun': undefined, 'game': undefined, 'coordinator': undefined };

/** Handle all received messages that has at least event and optional data
 * Supported websocket form : {"event":"chat","data":"Message test"}
 * @param {String} event The event of the message
 * @param {JSON} data The associated data
 */
function handleSocket(event, data, ws) {
    switch (event.toLowerCase()) {
        case 'gun':
            var query = 'SELECT * FROM nerfus.gun WHERE nerfus.gun.rfid_code = ?';
            var query = server.connection.query(query, data.id, function (err, gun) {
                if (gun) {
                    wss.broadcast(assembleSocket('select_gun', gun[0]));
                }
            });
            break;

        case 'chat':
            ws.send('{"event":"' + event + '","data":' + JSON.stringify(data) + '}');
            break;
        default:
            if (data === undefined) {
                wss.broadcast('{"event":"' + event + '"}');
            } else {
                wss.broadcast('{"event":"' + event + '","data":' + JSON.stringify(data) + '}');
            }
            break;
    }
}