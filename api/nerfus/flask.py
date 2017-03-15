import os

from flask.app import Flask
from nerfus.server.database import init_db

app = Flask(__name__)
selected_config_file = ('../../deployment_config/config_{0}.cfg'
                        .format('prod' if os.environ.get('MODE', '') == 'PROD' else 'debug'))
app.config.from_pyfile(selected_config_file)
app.secret_key = 'f3c82c6484157c7ba650b18c38837cca'


# Database init
db_session, server = init_db(app.config)
