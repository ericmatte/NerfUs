from setuptools import setup

# Packages to install in linux
# sudo apt-get install build-essential libssl-dev libffi-dev python-dev python-dev3
testpkgs = [
    'pytest',
]

setup(
    name='Flask API',
    version='1.1',
    long_description=__doc__,
    install_requires=[
        'pip >= 9.0.1',
        'Flask >= 0.11.1',
        'tornado',
        'oauth2client',
        'blinker >= 1.4',
        'sqlalchemy >= 0.9.9',
        'Flask-SQLAlchemy >= 2.0',
        'PyMySQL >= 0.6.6',
        'sshtunnel >= 0.1.2',
        'Jinja2 >= 2.8',
        'MarkupSafe >= 0.23',
        'Werkzeug >= 0.11.10',
        'click >= 6.6',
        'itsdangerous >= 0.24',
        'pytest >= 3.0.3',
        'rsa >= 3.4.2'
    ],
    test_suite='nose.collector',
    tests_require=testpkgs,
)
