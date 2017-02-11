from .gun import Gun


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