var server = require('./server');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: server.wsPort });
console.log('Websocket listening @ ws://localhost:' + server.wsPort + '/')

function assembleSocket(event, data) {
    return '{"event":"'+event+'","data":'+JSON.stringify(data)+'}';
}

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function connection(ws) {
    console.log("New websocket connection");

    ws.on('message', function incoming(message) {
        console.log("Received " + message);
        try {
            var socket = JSON.parse(message);
            handleSocket(socket.event, socket.data, ws);
        }
        catch(err) {
            // Scream server example: "hi" -> "HI!!!" 
            ws.send(JSON.stringify(message).toUpperCase()+"!!!");
        }
    });
});

function handleSocket(event, data, ws) {
    // ws form : {"event":"chat","data":"Message test"}
    switch(event.toLowerCase()) {
        case 'gun':
            var query = 'SELECT * FROM nerfus.gun WHERE nerfus.gun.rfid_code = ?';
            var query = server.connection.query(query, data, function(err, gun) {
                if (gun) {
                    wss.broadcast(assembleSocket('select_gun', gun[0]));
                }
            });
            break;

        case 'chat':
        default:
            ws.send('{"event":"'+event+'","data":'+JSON.stringify(data)+'}');
            break;
    }
}