from flask import Blueprint, jsonify, request
from .models import db, RegistroActividad, TipoActividad
from datetime import datetime

main = Blueprint("main", __name__)

@main.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "pong"}), 200

@main.route("/actividades/tipoActividad", methods=["GET"])
def obtener_tipos_actividad():
    tipos = TipoActividad.query.all()
    resultados = [{"id": tipo.id, "nombre": tipo.nombre} for tipo in tipos]
    return jsonify(resultados), 200

@main.route("/actividades/create", methods=["POST"])
def crear_actividad():
    data = request.get_json()

    if not data or "id_persona" not in data or "id_tipo_actividad" not in data:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    existente = RegistroActividad.query.filter_by(
        id_persona=data["id_persona"],
        id_tipo_actividad=data["id_tipo_actividad"]
    ).first()

    if existente:
        return jsonify({"error": "Ya existe un registro para esta persona con este tipo de actividad"}), 409

    nueva_actividad = RegistroActividad(
        id_persona=data["id_persona"],
        id_tipo_actividad=data["id_tipo_actividad"],
        id_usuario=1,
        fecha_hora=datetime.now(),
        id_tipo_registro=1
    )

    db.session.add(nueva_actividad)
    db.session.commit()

    return jsonify({"message": "Registro creado exitosamente"}), 201

@main.route("/actividades/filter", methods=["GET"])
def filtrar_actividades():
    fecha_str = request.args.get("fecha")
    id_tipo_actividad = request.args.get("id_tipo_actividad")
    id_usuario = request.args.get("id_usuario")

    if not fecha_str or not id_tipo_actividad or not id_usuario:
        return jsonify({"error": "Faltan parámetros requeridos"}), 400

    try:
        fecha_inicio = datetime.strptime(fecha_str, "%Y-%m-%d")
        fecha_fin = fecha_inicio.replace(hour=23, minute=59, second=59)
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido. Usa YYYY-MM-DD"}), 400

    query = db.session.query(RegistroActividad, TipoActividad).join(
        TipoActividad, RegistroActividad.id_tipo_actividad == TipoActividad.id
    ).filter(
        RegistroActividad.id_usuario == int(id_usuario),
        RegistroActividad.id_tipo_actividad == int(id_tipo_actividad),
        RegistroActividad.fecha_hora >= fecha_inicio,
        RegistroActividad.fecha_hora <= fecha_fin
    )

    resultados = query.all()

    response = [{
        "id": r.id,
        "id_persona": r.id_persona,
        "id_tipo_actividad": r.id_tipo_actividad,
        "nombre_actividad": t.nombre,
        "fecha_hora": r.fecha_hora.isoformat()
    } for r, t in resultados]

    return jsonify(response), 200
