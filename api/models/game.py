from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class Game(DeclarativeBase, BaseEntity):
    """Represent all the type of game a player can play"""
    __tablename__ = 'game'

    game_id = Column('game_id', Integer, primary_key=True)

    name = Column('name', Unicode(45))
    description = Column('description', Unicode(256))
    game_length = Column('game_length', Integer)
    max_reflex_time = Column('max_reflex_time', Integer)
    verify_precision = Column('verify_precision', Boolean)
