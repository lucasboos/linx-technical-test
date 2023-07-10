import os
import configparser
import datetime

from apps.factory import create_app
from apps.sql_alchemy import db


if __name__ == "__main__":
    config = configparser.ConfigParser()
    config.read(os.path.abspath(os.path.join(".ini")))

    app = create_app()
    app.config['DEBUG'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = config['PROD']['DB_URI']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_SECRET_KEY"] = config['SECRET_KEY']['JWT_SECRET_KEY']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=120)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.run()
