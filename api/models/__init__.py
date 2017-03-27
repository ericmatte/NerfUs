from flask import json
from lib.AlchemyEncoder import AlchemyEncoder


def add_to_db(sql_object, **attributes):
    from nerfus import db_session
    set_attributes(sql_object, **attributes)
    db_session.add(sql_object)
    db_session.commit()
    return sql_object


def set_attributes(sql_object, **attributes):
    for key, value in attributes.items():
        setattr(sql_object, key, value)
    return sql_object


def to_json(sql_object, to_string=True):
    j = json.dumps(sql_object, cls=AlchemyEncoder)
    return j if to_string else json.loads(j)