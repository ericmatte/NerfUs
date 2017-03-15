from flask import json
from flask import make_response
from flask import render_template
from flask_socketio import emit

from lib.AlchemyEncoder import AlchemyEncoder
from nerfus.flask import app, socket_io
from models.gun import Gun


@app.route('/index', methods=['GET'])
def index():
    # return make_response(open('nerfus/templates/index.html').read())
    return render_template('index.html')


@app.route('/websocket', methods=['GET'])
def websocket():
    return render_template('websocket.html')


@app.route('/get-guns', methods=['POST'])
def get_guns():
    # return make_response(open('nerfus/templates/index.html').read())
    guns = Gun.get_all()
    return make_response(json.dumps(guns, cls=AlchemyEncoder))


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