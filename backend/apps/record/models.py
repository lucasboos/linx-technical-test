from datetime import datetime

from ..sql_alchemy import db


class RecordModel(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    searched_region = db.Column(db.String(255))
    date = db.Column(db.DateTime, server_default=db.func.now())

    def __init__(self, user_id, searched_region):
        self.user_id = user_id
        self.searched_region = searched_region
        self.date = datetime.now()

    @property
    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'searched_region': self.searched_region,
            'date': self.date,
        }

    @classmethod
    def get_record_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_records_by_user(cls, user_id):
        return [record for record in cls.query.filter_by(user_id=user_id).all()]

    @classmethod
    def delete_all_records_by_user(cls, user_id):
        records_to_delete = cls.query.filter_by(user_id=user_id).all()

        for record in records_to_delete:
            db.session.delete(record)

        db.session.commit()

    def save_record(self):
        db.session.add(self)
        db.session.commit()

    def update_record(self, user_id, searched_region):
        self.user_id = user_id
        self.searched_region = searched_region
        db.session.commit()

    def delete_record(self):
        db.session.delete(self)
        db.session.commit()
