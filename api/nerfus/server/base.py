import sqlalchemy.orm.properties
from sqlalchemy.orm import exc
from sqlalchemy.sql.functions import func

from nerfus.server.database import DeclarativeBase

metadata = DeclarativeBase.metadata


class BaseEntity:
    @classmethod
    def get(cls, *args, **kwargs):
        try:
            return cls.filter(*args, **kwargs).one()
        except exc.NoResultFound:
            return None

    @classmethod
    def get_all(cls, *args, **kwargs):
        return cls.filter(*args, **kwargs).all()

    @classmethod
    def filter(cls, *args, **kwargs):
        return cls.query.filter(*args).filter_by(**kwargs)

    @classmethod
    def get_latest(cls, filtering_column, limit=1):
        """Get the latest created row"""
        q = cls.filter().order_by(filtering_column.desc()).first()
        return q.first() if limit == 1 else q.limit(limit)

    @classmethod
    def apply_sorting(cls, query, **kw):
        """For Datatables"""
        if 'sidx' in kw and kw['sidx']:
            sort_idx = kw['sidx']
            sort_ord = kw['sord']
            if hasattr(cls, sort_idx):
                attr = getattr(cls, sort_idx)

                if isinstance(attr.property, sqlalchemy.orm.properties.RelationshipProperty):
                    query = query.join(attr)
                    attr = attr.property.argument.getSortingAttribute()

                if sort_ord == 'asc':
                    query = query.order_by(attr)
                else:
                    query = query.order_by(attr.desc())

        return query

    @classmethod
    def get_count(cls, **kwargs):
        q = cls.session.query(func.count(next(iter(cls.__table__.primary_key.columns))))
        q = cls.apply_filter(q, **kwargs)
        return q.scalar()

    @classmethod
    def get_page_rows(cls, start_idx, end_idx, **kwargs):
        q = cls.query
        q = cls.apply_filter(q, **kwargs)
        q = q.slice(start_idx, end_idx)
        return q.all()
