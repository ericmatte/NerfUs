from flask import json
from flask import make_response
from flask import render_template
from flask import request

from lib.AlchemyEncoder import AlchemyEncoder
from nerfus.flask import app
from models.gun import Gun


@app.route('/sample', methods=['GET'])
def sample_page():
    return render_template('sample.html', guns=Gun.get_all())


@app.route('/', methods=['GET'])
def index():
    # return make_response(open('nerfus/templates/index.html').read())
    return render_template('index.html')


@app.route('/get-guns', methods=['POST'])
def get_guns():
    # return make_response(open('nerfus/templates/index.html').read())
    guns = Gun.get_all()
    return make_response(json.dumps(guns, cls=AlchemyEncoder))