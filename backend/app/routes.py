from flask import Blueprint, request, jsonify
from app.models import db
from sqlalchemy import text
from datetime import datetime

main = Blueprint('main', __name__)

# Ruta de prueba
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"}), 200

# Ruta 1: Obtener tipos de actividad
@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    try:
        result = db.session.execute(text("SELECT id, nombre FROM out_tipo_actividad"))
        actividades = [{"id": row[0], "nombre": row[1]} for row in result]
        return jsonify(actividades), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta 2: Registrar una actividad
@main.route('/actividades/create', methods=['POST'])
def create_actividad():
    data = request.get_json()

    id_persona = data.get("id_persona")
    id_tipo_actividad = data.get("id_tipo_actividad")
    id_usuario = data.get("id_usuario")
    id_tipo_registro = data.get("id_tipo_registro", 1)
    fecha_hora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    if not id_persona or not id_tipo_actividad or not id_usuario:
        return jsonify({"error": "Faltan campos requeridos"}), 400

    try:
        # Verifica si ya existe un registro para esa persona y actividad
        query = text("""
            SELECT COUNT(*) FROM out_registro_actividad 
            WHERE id_persona = :id_persona AND id_tipo_actividad = :id_tipo_actividad
        """)
        result = db.session.execute(query, {
            "id_persona": id_persona,
            "id_tipo_actividad": id_tipo_actividad
        }).scalar()

        if result > 0:
            return jsonify({"message": "La persona ya ha registrado esta actividad"}), 409

        # Inserta el nuevo registro
        insert = text("""
            INSERT INTO out_registro_actividad 
            (id_persona, id_tipo_actividad, id_usuario, fecha_hora, id_tipo_registro)
            VALUES (:id_persona, :id_tipo_actividad, :id_usuario, :fecha_hora, :id_tipo_registro)
        """)
        db.session.execute(insert, {
            "id_persona": id_persona,
            "id_tipo_actividad": id_tipo_actividad,
            "id_usuario": id_usuario,
            "fecha_hora": fecha_hora,
            "id_tipo_registro": id_tipo_registro
        })
        db.session.commit()

        return jsonify({"message": "Actividad registrada exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
