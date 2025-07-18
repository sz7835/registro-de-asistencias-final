# backend/app/routes.py

from flask import Blueprint, jsonify
from flask_sqlalchemy import SQLAlchemy

main = Blueprint('main', __name__)
db = SQLAlchemy()

# Define model inline since there's no models.py
class TipoActividad(db.Model):
    __tablename__ = 'out_tipo_actividad'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre
        }

@main.route('/ping', methods=['GET'])
def ping():
    return 'pong'

@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    try:
        tipos = TipoActividad.query.all()
        result = [tipo.to_dict() for tipo in tipos]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
