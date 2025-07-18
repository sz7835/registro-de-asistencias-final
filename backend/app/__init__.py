from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .routes import main, db

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://szavala:Szavala%401507@161.132.202.110:3306/freedb_registro'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(main)

    return app
