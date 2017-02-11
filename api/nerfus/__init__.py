from nerfus.flask import app, db_session
from nerfus import controllers

@app.before_request
def get_current_user():
    pass


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
