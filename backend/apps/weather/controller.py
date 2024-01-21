import os
import requests
import configparser

from http import HTTPStatus

from apps.record.controller import RecordController


config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join('.ini')))
API_KEY = config['API']['API_KEY']


class WeatherController:
    @classmethod
    def get_weather(cls, user_id, city):
        cords_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&appid={API_KEY}"
        response = requests.get(cords_url)

        if response.status_code == 200:
            if not response.json():
                return {'message': 'City not found.'}, HTTPStatus.NOT_FOUND
            cords_data = response.json()[0]
        else:
            return {'message': 'An internal error occurred.'}, HTTPStatus.INTERNAL_SERVER_ERROR

        url = f"http://api.openweathermap.org/data/2.5/forecast?lat={cords_data['lat']}&lon={cords_data['lon']}&appid={API_KEY}"
        response = requests.get(url)

        if response.status_code == 200:
            weather_data = response.json()
            RecordController.add_record(user_id, weather_data['city']['name'])
            return weather_data, HTTPStatus.OK
        else:
            return {'message': 'An internal error occurred.'}, HTTPStatus.INTERNAL_SERVER_ERROR
