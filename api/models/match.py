from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import FetchedValue
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class Match(DeclarativeBase, BaseEntity):
    """Give all the info about a match a player has done"""
    __tablename__ = 'match'

    match_id = Column('match_id', Integer, primary_key=True)
    player = relationship('Player')
    gun = relationship('Gun')
    game = relationship('Game')

    score = Column('score', Integer)

    # Times value must be saved in milliseconds
    length = Column('length', Integer)
    average_reflex_time = Column('average_reflex_time', Integer)

    enemy_killed = Column('enemy_killed', Integer)
    innocent_harmed = Column('innocent_harmed', Integer)
    # bullet_used = Column('bullet_used', Integer)  # Not useful for now

    upload_time = Column('upload_time', DateTime, server_default=FetchedValue())

    player_id = Column('player_id', ForeignKey('player.player_id'))
    gun_id = Column('gun_id', ForeignKey('gun.gun_id'))
    game_id = Column('game_id', ForeignKey('game.game_id'))