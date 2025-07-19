from flask import Blueprint, jsonify, request
from sqlalchemy import text
from .models import db

main = Blueprint('main', __name__)

@main.route('/ping')
def ping():
    return 'pong'

@main.route('/actividades/tipoActividad', methods=['GET'])
def obtener_tipos_actividad():
    try:
        result = db.session.execute(text("SELECT id, nombre FROM out_tipo_actividad"))
        tipos = [{"id": row[0], "nombre": row[1]} for row in result]
        return jsonify(tipos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/actividades/create', methods=['POST'])
def crear_actividad():
    data = request.get_json()
    id_persona = data.get("id_persona")
    id_tipo_actividad = data.get("id_tipo_actividad")
    id_usuario = data.get("id_usuario")
    id_tipo_registro = data.get("id_tipo_registro")
    fecha_hora = data.get("fecha_hora")

    if not all([id_persona, id_tipo_actividad, id_usuario, id_tipo_registro, fecha_hora]):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    # Verificar duplicado
    query = text("""
        SELECT COUNT(*) FROM out_registro_actividad
        WHERE id_persona = :id_persona AND id_tipo_actividad = :id_tipo_actividad
    """)
    result = db.session.execute(query, {
        "id_persona": id_persona,
        "id_tipo_actividad": id_tipo_actividad
    }).scalar()

    if result > 0:
        return jsonify({"error": "La persona ya ha registrado esta actividad"}), 409

    insert = text("""
        INSERT INTO out_registro_actividad (id_persona, id_tipo_actividad, id_usuario, fecha_hora, id_tipo_registro)
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

    return jsonify({"mensaje": "Registro de asistencia exitoso"})

@main.route('/actividades/filter', methods=['GET'])
def filtrar_actividades():
    fecha = request.args.get('fecha')
    id_tipo_actividad = request.args.get('id_tipo_actividad')
    id_usuario = request.args.get('id_usuario')

    if not fecha:
        return jsonify({"error": "El parámetro 'fecha' es obligatorio"}), 400

    query = """
        SELECT id, id_persona, id_tipo_actividad, id_usuario, fecha_hora, id_tipo_registro
        FROM out_registro_actividad
        WHERE DATE(fecha_hora) = :fecha
    """
    params = {"fecha": fecha}

    if id_tipo_actividad:
        query += " AND id_tipo_actividad = :id_tipo_actividad"
        params["id_tipo_actividad"] = id_tipo_actividad
    if id_usuario:
        query += " AND id_usuario = :id_usuario"
        params["id_usuario"] = id_usuario

    result = db.session.execute(text(query), params)
    actividades = [
        {
            "id": row[0],
            "id_persona": row[1],
            "id_tipo_actividad": row[2],
            "id_usuario": row[3],
            "fecha_hora": row[4].strftime("%Y-%m-%d %H:%M:%S"),
            "id_tipo_registro": row[5]
        }
        for row in result
    ]
    return jsonify(actividades)
