from flask_jwt_extended import create_access_token
import bcrypt

from http import HTTPStatus

from .models import UserModel


class UserController:
    @classmethod
    def get_users(cls):
        users = UserModel.get_users()
        users_json = [user.json for user in users]
        return users_json, HTTPStatus.OK

    @classmethod
    def get_user_by_username(cls, username):
        user = UserModel.find_user_by_username(username)
        if user:
            return user.json, HTTPStatus.OK
        return {'message': 'User not found'}, HTTPStatus.NOT_FOUND

    @classmethod
    def add_user(cls, username, password):
        user, status = cls.get_user_by_username(username)
        if status == HTTPStatus.OK:
            return {'message': f'User with username {username} already exists'}, HTTPStatus.UNAUTHORIZED

        hash_password = None
        if password:
            hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        new_user = UserModel(username=username, password=hash_password)

        try:
            new_user.save_user()
        except Exception as e:
            return {'message': 'An internal error occurred.'}, HTTPStatus.INTERNAL_SERVER_ERROR

        return new_user.json, HTTPStatus.CREATED

    @classmethod
    def update_user(cls, username, new_username, password):
        user = UserModel.find_user_by_username(username)
        if not user:
            return {'message': 'User not found'}, HTTPStatus.NOT_FOUND

        hash_password = None
        if password:
            hash_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user.username = new_username
        user.password = hash_password
        user.save_user()

        return {'message': 'User updated successfully'}, HTTPStatus.OK

    @classmethod
    def delete_user(cls, username):
        user = UserModel.find_user_by_username(username)
        if not user:
            return {'message': 'User not found'}, HTTPStatus.NOT_FOUND

        user_instance = UserModel.query.filter_by(username=username).first()
        user_instance.delete_user()

        return {'message': 'User deleted successfully'}, HTTPStatus.OK

class Login:
    @staticmethod
    def login(username, password):
        user, status = UserController.get_user_by_username(username)
        token = {}

        if status == HTTPStatus.OK and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            additional_claims = {'user_id': user['id']}
            token['token'] = create_access_token(identity=user['username'], additional_claims=additional_claims)
            return token, status

        return {'message': 'Invalid credentials'}, HTTPStatus.UNAUTHORIZED
