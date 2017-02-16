from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import FetchedValue
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class Player(DeclarativeBase, BaseEntity):
    """Represent tza player"""
    __tablename__ = 'player'

    player_id = Column('player_id', Integer, primary_key=True)

    name = Column('name', Unicode(64))
    creation_time = Column('creation_time', DateTime, server_default=FetchedValue())
