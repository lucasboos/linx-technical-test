from datetime import datetime

from ..sql_alchemy import db


class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.created_at = datetime.now()

    @property
    def json(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
        }

    @classmethod
    def get_users(cls):
        return [user for user in cls.query.all()]

    @classmethod
    def find_user_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def find_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def save_user(self):
        db.session.add(self)
        db.session.commit()

    def update_user(self, username, password):
        self.username = username
        self.password = password
        self.updated_at = datetime.now()
        db.session.commit()

    def delete_user(self):
        db.session.delete(self)
        db.session.commit()
