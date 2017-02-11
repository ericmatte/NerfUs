from sqlalchemy import Column
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class Gun(DeclarativeBase, BaseEntity):
    __tablename__ = 'gun'

    bank_id = Column('gun_id', Integer, primary_key=True)

    name = Column('name', Unicode(30))
    description = Column('description', Unicode(256))
    initial_ammo = Column('initial_ammo', Integer)
    rfid_code = Column('rfid_code', Unicode(64))
