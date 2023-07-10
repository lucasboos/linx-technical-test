from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required

from http import HTTPStatus

from .controller import UserController, Login
from ..utils import expect


user_api_v1 = Blueprint(
    'auth_api_v1', 'auth_api_v1', url_prefix='/api/v1/user')

CORS(user_api_v1)


@user_api_v1.route('/', methods=['GET'])
@jwt_required()
def api_get_users():
    try:
        response, status = UserController.get_users()

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@user_api_v1.route('/<username>', methods=['GET'])
def api_get_user(username):
    try:
        response, status = UserController.get_user_by_username(username)

        if response:
            return jsonify(response), status
        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@user_api_v1.route('/signup', methods=['POST'])
def api_post_user():
    req = request.get_json()

    try:
        username = expect(req.get('username'), str, 'username')
        password = expect(req.get('password'), str, 'password')

        response, status = UserController.add_user(
            username=username,
            password=password,
        )

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@user_api_v1.route('/<username>', methods=['PUT'])
@jwt_required()
def api_update_user(username):
    req = request.get_json()

    try:
        new_username = req.get('username')
        password = req.get('password')

        response, status = UserController.update_user(
            username=username,
            new_username=new_username,
            password=password,
        )

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@user_api_v1.route('/<username>', methods=['DELETE'])
@jwt_required()
def api_delete_user(username):
    try:
        response, status = UserController.delete_user(username)

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@user_api_v1.route('/signin', methods=['POST'])
def api_signin_user():
    req = request.get_json()

    try:
        username = expect(req.get('username'), str, 'username')
        password = expect(req.get('password'), str, 'password')

        response, status = Login.login(username, password)

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST
