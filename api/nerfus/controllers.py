from flask import render_template
from nerfus.flask import app
from models.gun import Gun


@app.route('/', methods=['GET'])
def index():
    return render_template('sample.html', guns=Gun.get_all())