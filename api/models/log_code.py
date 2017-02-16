from sqlalchemy import Column
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class LogCode(DeclarativeBase, BaseEntity):
    """Represent a specific type of log (something that we expect to arrive at some point)"""
    __tablename__ = 'log_code'

    log_code_id = Column('log_code_id', Integer, primary_key=True)

    name = Column('name', Unicode(45))
    description = Column('description', Unicode(256))
