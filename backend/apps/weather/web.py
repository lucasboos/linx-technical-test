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
    req = request.get_json()

    try:
        user_id = expect(req.get('user_id'), int, 'user_id')
        lat = expect(req.get('lat'), float, 'lat')
        lon = expect(req.get('lon'), float, 'lon')

        response, status = WeatherController.get_weather(
            user_id=user_id,
            lat=lat,
            lon=lon,
        )

        return jsonify(response), status
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST
