from flask import Blueprint, jsonify, request
from .models import db, RegistroActividad, TipoActividad

main = Blueprint('main', __name__)

# ✅ /ping route
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

# ✅ GET /actividades/tipoActividad
@main.route('/actividades/tipoActividad', methods=['GET'])
def obtener_tipos_actividad():
    tipos = TipoActividad.query.all()
    resultado = [{'id': t.id, 'nombre': t.nombre} for t in tipos]
    return jsonify(resultado), 200

# ✅ POST /actividades/create
@main.route('/actividades/create', methods=['POST'])
def crear_actividad():
    data = request.get_json()

    id_persona = data.get('id_persona')
    id_tipo_actividad = data.get('id_tipo_actividad')

    if not id_persona or not id_tipo_actividad:
        return jsonify({'message': 'Faltan datos obligatorios'}), 400

    # Check if the activity already exists
    existente = RegistroActividad.query.filter_by(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo_actividad
    ).first()

    if existente:
        return jsonify({'message': 'La persona ya ha registrado esta actividad'}), 409

    nuevo_registro = RegistroActividad(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo_actividad,
        id_usuario=1,  # 🔒 Valor fijo como en el spec
        id_tipo_registro=1  # 🔒 Valor fijo como en el spec
    )

    db.session.add(nuevo_registro)
    db.session.commit()

    return jsonify({'message': 'Actividad registrada exitosamente'}), 201

# ✅ GET /actividades/filter
@main.route('/actividades/filter', methods=['GET'])
def filtrar_actividades():
    id_persona = request.args.get('id_persona')
    id_tipo_actividad = request.args.get('id_tipo_actividad')

    query = RegistroActividad.query

    if id_persona:
        query = query.filter_by(id_persona=id_persona)
    if id_tipo_actividad:
        query = query.filter_by(id_tipo_actividad=id_tipo_actividad)

    registros = query.all()

    resultado = []
    for r in registros:
        tipo = TipoActividad.query.get(r.id_tipo_actividad)
        resultado.append({
            "id": r.id,
            "id_persona": r.id_persona,
            "id_tipo_actividad": r.id_tipo_actividad,
            "nombre_actividad": tipo.nombre if tipo else None
        })

    return jsonify(resultado), 200
