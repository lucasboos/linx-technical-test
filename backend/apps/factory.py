from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from apps.user.web import user_api_v1
from apps.record.web import record_api_v1
from apps.weather.web import weather_api_v1


def create_app():
    app = Flask(__name__)
    CORS(app)
    jwt = JWTManager(app)

    app.register_blueprint(user_api_v1)
    app.register_blueprint(record_api_v1)
    app.register_blueprint(weather_api_v1)

    return app
