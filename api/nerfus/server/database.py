from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sshtunnel import SSHTunnelForwarder

DeclarativeBase = declarative_base()

def init_db(config):
    _server = None
    if config.get('USE_SSH_TUNNEL'):
        _server = SSHTunnelForwarder(
            (config['HOSTNAME'], 22),
            ssh_username=config['SHH_USER'],
            ssh_password=config['SHH_PWD'],
            remote_bind_address=('localhost', 3306),
            local_bind_address=('localhost', config['SHH_TUNNEL_PORT']))
        try:
            _server.start()
            print('Tunneling {0} on port {1}'.format(_server.ssh_host, str(_server.local_bind_port)))
        except Exception:
            _server.close()
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    engine = create_engine(config['DB_CONNECTION_STRING'], convert_unicode=True)
    _db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    DeclarativeBase.session = _db_session
    DeclarativeBase.query = _db_session.query_property()
    DeclarativeBase.metadata.create_all(bind=engine)
    return _db_session, _server