from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required

from http import HTTPStatus

from .controller import RecordController
from ..utils import expect


record_api_v1 = Blueprint(
    'record_api_v1', 'record_api_v1', url_prefix='/api/v1/records')

CORS(record_api_v1)


@record_api_v1.route('/user/<user_id>', methods=['GET'])
@jwt_required()
def api_get_records_by_user(user_id):
    try:
        response, status = RecordController.get_records_by_user(user_id)

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@record_api_v1.route('/<id>', methods=['GET'])
@jwt_required()
def api_get_record(id):
    try:
        response, status = RecordController.get_record_by_id(id)
        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@record_api_v1.route('/register', methods=['POST'])
@jwt_required()
def api_post_record():
    req = request.get_json()
    try:
        user_id = expect(req.get('user_id'), int, 'user_id')
        searched_region = expect(req.get('searched_region'), str, 'searched_region')

        response, status = RecordController.add_record(user_id, searched_region)
        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@record_api_v1.route('/<id>', methods=['DELETE'])
def api_delete_record(id):
    try:
        response, status = RecordController.delete_record(id)
        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


@record_api_v1.route('/delete/<user_id>', methods=['DELETE'])
def api_delete_all_records_by_user(user_id):
    try:
        response, status = RecordController.delete_all_records_by_user(user_id)
        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST
