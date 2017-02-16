import enum
from sqlalchemy import Column
from sqlalchemy import Enum
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class DeviceType(enum.Enum):
    coordinator = 1
    router = 2
    endpoint = 3


class Device(DeclarativeBase, BaseEntity):
    """Represent a mbed device"""
    __tablename__ = 'device'

    device_id = Column('device_id', Integer, primary_key=True)

    mac_address = Column('mac_address', Unicode(16))
    type = Column('type', Enum(DeviceType))
