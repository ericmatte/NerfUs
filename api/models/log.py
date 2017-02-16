import enum

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum
from sqlalchemy import FetchedValue
from sqlalchemy import ForeignKey
from sqlalchemy import Text
from sqlalchemy.orm import relationship
from sqlalchemy.types import Integer, Unicode

from nerfus.server.base import DeclarativeBase, BaseEntity


class LogType(enum.Enum):
    test = 1
    runtime = 2


class Log(DeclarativeBase, BaseEntity):
    """This class is useful to keep track on all error with the software and communications"""
    __tablename__ = 'log'

    log_id = Column('log_id', Integer, primary_key=True)
    device = relationship('Device')
    log_code = relationship('LogCode')

    context_description = Column('context_description', Text)
    type = Column('type', Enum(LogType))
    timestamp = Column('timestamp', DateTime, server_default=FetchedValue())

    device_id = Column('device_id', Integer, ForeignKey('device.device_id'))
    log_code_id = Column('log_code_id', Integer, ForeignKey('log_code.log_code_id'))

