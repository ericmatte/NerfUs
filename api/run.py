import os
os.environ['MODE'] = 'DEBUG'

from nerfus.flask import app
if __name__ == '__main__':
    app.run(threaded=True)
