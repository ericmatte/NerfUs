var server = require('./server');
var ws = require("nodejs-websocket");

// Websocket
var wsServer = ws.createServer(function (conn) {
    console.log("New websocket connection");

    conn.on("text", function (str) {
        console.log("Received " + str);
        try {
            var socket = JSON.parse(str);
            handleSocket(socket.event, socket.data, conn);
        }
        catch(err) {
            // Scream server example: "hi" -> "HI!!!" 
            conn.sendText(JSON.stringify(str).toUpperCase()+"!!!");
        }
    });

    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });

}).listen(server.wsPort, function(){
    console.log('Websocket listening @ ws://localhost:' + server.wsPort + '/')
});

function broadcast(msg) {
    wsServer.connections.forEach(function (conn) {
        conn.sendText(msg)
    });
}

function handleSocket(event, data, conn) {
    // ws form : {"event":"chat","data":"Message test"}
    switch(event.toLowerCase()) {
        case 'gun':
            var gun = server.databaseQuery(res, 'SELECT * FROM nerfus.gun WHERE gun.rfid_code = ?', data);
            console.log(JSON.stringify(gun));
            
            break;

        case 'test':
        case 'chat':
        default:
            conn.sendText('{"event":"'+event+'","data":'+JSON.stringify(data)+'}');
            break;
    }
}