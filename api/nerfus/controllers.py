from models import to_json
from models.game import Game
from nerfus import sockets  # Unused import, but necessary in order for sockets to work
from flask import json
from flask import make_response
from flask import render_template
from lib.AlchemyEncoder import AlchemyEncoder
from nerfus.flask import app
from models.gun import Gun


@app.route('/', methods=['GET'])
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
    return make_response(to_json(guns))


@app.route('/get-games', methods=['POST'])
def get_games():
    games = Game.get_all()
    return make_response(to_json(games))

