
from flask_socketio import emit

from nerfus.flask import socket_io

values = {
    'slider1': 25,
    'slider2': 0,
}
@socket_io.on('value changed')
def value_changed(message):
    values[message['who']] = message['data']
    emit('update value', message, broadcast=True)


@socket_io.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))
    return 'one', 2

@socket_io.on('message')
def handle_message(message):
    print('received message: ' + message)

@socket_io.on('json')
def handle_json(json):
    print('received json: ' + str(json))

@socket_io.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socket_io.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')