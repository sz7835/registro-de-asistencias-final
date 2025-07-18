from flask import Blueprint, jsonify, request
from .models import db, TipoActividad, RegistroActividad
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

    # Verifica si la persona ya tiene un registro con este tipo de actividad
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
        fecha_hora=datetime.now(),  # ✅ Fixed the null error
        id_tipo_registro=1
    )

    db.session.add(nueva_actividad)
    db.session.commit()

    return jsonify({"message": "Registro creado exitosamente"}), 201
