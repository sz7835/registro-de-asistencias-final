# app/routes.py

from flask import Blueprint, jsonify, request
from .models import db, RegistroActividad, TipoActividad
from datetime import datetime

main = Blueprint('main', __name__)

# ✅ GET /ping - health check
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

# ✅ GET /actividades/tipoActividad
@main.route('/actividades/tipoActividad', methods=['GET'])
def get_tipo_actividad():
    tipos = TipoActividad.query.all()
    result = [{'id': t.id, 'nombre': t.nombre} for t in tipos]
    return jsonify(result), 200

# ✅ POST /actividades/create
@main.route('/actividades/create', methods=['POST'])
def create_actividad():
    data = request.get_json()

    id_persona = data.get('id_persona')
    id_tipo_actividad = data.get('id_tipo_actividad')

    # Validation
    if not id_persona:
        return jsonify({'error': 'Falta el campo: id_persona'}), 422
    if not id_tipo_actividad:
        return jsonify({'error': 'Falta el campo: id_tipo_actividad'}), 422

    # Duplicate check
    existing = RegistroActividad.query.filter_by(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo_actividad
    ).first()

    if existing:
        return jsonify({'message': 'La persona ya ha registrado esta actividad'}), 409

    # Save new activity
    nueva_actividad = RegistroActividad(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo_actividad,
        id_usuario=1,
        fecha_hora=datetime.now(),
        id_tipo_registro=1
    )
    db.session.add(nueva_actividad)
    db.session.commit()

    return jsonify({'message': 'Actividad registrada exitosamente'}), 201

# ✅ NEW: GET /actividades/filter
@main.route('/actividades/filter', methods=['GET'])
def filter_actividades():
    id_persona = request.args.get('id_persona', type=int)
    id_tipo_actividad = request.args.get('id_tipo_actividad', type=int)

    query = RegistroActividad.query

    if id_persona:
        query = query.filter_by(id_persona=id_persona)
    if id_tipo_actividad:
        query = query.filter_by(id_tipo_actividad=id_tipo_actividad)

    resultados = query.all()

    response = []
    for r in resultados:
        response.append({
            'id': r.id,
            'id_persona': r.id_persona,
            'id_tipo_actividad': r.id_tipo_actividad,
            'id_usuario': r.id_usuario,
            'fecha_hora': r.fecha_hora.strftime('%Y-%m-%d %H:%M:%S'),
            'id_tipo_registro': r.id_tipo_registro
        })

    return jsonify(response), 200
