from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class RegistroActividad(db.Model):
    __tablename__ = 'out_registro_actividad'

    id = db.Column(db.Integer, primary_key=True)
    id_persona = db.Column(db.Integer, nullable=False)
    id_tipo_actividad = db.Column(db.Integer, nullable=False)
    id_usuario = db.Column(db.Integer, nullable=False)
    fecha_hora = db.Column(db.DateTime, default=datetime.utcnow)
    id_tipo_registro = db.Column(db.Integer, nullable=False)
