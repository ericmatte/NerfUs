from sqlalchemy import Column
from sqlalchemy.types import Integer, Unicode
from nerfus.server.base import DeclarativeBase, BaseEntity


class Gun(DeclarativeBase, BaseEntity):
    """The gun"""
    __tablename__ = 'gun'

    gun_id = Column('gun_id', Integer, primary_key=True)

    name = Column('name', Unicode(30))
    description = Column('description', Unicode(256))
    ammo = Column('ammo', Integer)
    damage = Column('damage', Integer)
    range = Column('range', Integer)
    accuracy = Column('accuracy', Integer)
    rfid_code = Column('rfid_code', Unicode(64))
