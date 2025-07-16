from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .routes import main

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    from config import Config
    app.config.from_object(Config)

    db.init_app(app)
    app.register_blueprint(main)

    return app
