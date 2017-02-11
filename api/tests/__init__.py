from contextlib import contextmanager
from flask import appcontext_pushed
from flask import g
from nerfus.flask import app


@contextmanager
def set_current_user():
    def handler(sender, **kwargs):
        g.player = "Test Player"
    with appcontext_pushed.connected_to(handler, app):
        with app.app_context():
            yield