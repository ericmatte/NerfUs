activate_this = '/home/ubuntu/.virtualenvs/sw-nerfus/bin/activate_this.py'
exec(open(activate_this).read(), dict(__file__=activate_this))

import sys
import os
sys.path.insert(0, '/opt/flask/nerfus')
os.environ['MODE'] = 'PROD'

from endless.flask import app as application