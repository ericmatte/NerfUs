import os
os.environ['MODE'] = 'PROD'

from nerfus.flask import app
if __name__ == '__main__':
    app.run()
