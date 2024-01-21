from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import jwt_required

from http import HTTPStatus

from .controller import WeatherController
from ..utils import expect


weather_api_v1 = Blueprint(
    'weather_api_v1', 'weather_api_v1', url_prefix='/api/v1/weather')

CORS(weather_api_v1)


@weather_api_v1.route('/', methods=['GET'])
@jwt_required()
def api_get_weather():
    try:
        user_id = expect(request.args.get('user_id'), str, 'user_id')
        city = expect(request.args.get('city'), str, 'city')

        response, status = WeatherController.get_weather(
            user_id=user_id,
            city=city,
        )

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST
