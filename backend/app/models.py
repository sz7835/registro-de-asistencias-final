from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class RegistroActividad(db.Model):
    __tablename__ = 'out_registro_actividad'

    id = db.Column(db.Integer, primary_key=True)
    id_persona = db.Column(db.Integer, nullable=False)
    id_tipo_actividad = db.Column(db.Integer, nullable=False)
    id_usuario = db.Column(db.Integer, nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    id_tipo_registro = db.Column(db.Integer, nullable=False)

class TipoActividad(db.Model):
    __tablename__ = 'out_tipo_actividad'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
