import os
os.environ['MODE'] = 'PROD'

from nerfus.flask import app, socket_io

if __name__ == '__main__':
    socket_io.run(app)