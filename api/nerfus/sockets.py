
from flask_socketio import emit

from models import to_json
from models.gun import Gun
from nerfus.flask import socket_io

values = {
    'slider1': 25,
    'slider2': 0,
}
@socket_io.on('value changed')
def value_changed(message):
    values[message['who']] = message['data']
    emit('update value', message, broadcast=True)


@socket_io.on('mbed')
def value_changed(message):
    param, value = message.split('=')
    if param == 'GUN':
        gun = Gun.get(rfid_code=value)
        emit('select_gun', to_json(gun, False), broadcast=True)


@socket_io.on('chat')
def handle_message(message):
    print('received message: ' + message)
    emit('test', message)


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