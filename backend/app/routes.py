from flask import Blueprint, jsonify, request
from .models import db, TipoActividad, RegistroActividad
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/ping')
def ping():
    return 'pong'

@main.route('/actividades/tipoActividad', methods=['GET'])
def obtener_tipo_actividades():
    tipos = TipoActividad.query.all()
    data = [{'id': tipo.id, 'nombre': tipo.nombre} for tipo in tipos]
    return jsonify(data)

@main.route('/actividades/create', methods=['POST'])
def crear_registro_actividad():
    data = request.get_json()

    id_tipo = data.get('idTipoAct')
    id_persona = data.get('personaId')
    fecha = data.get('fecha')
    hora = data.get('hora')
    id_usuario = data.get('createUser')

    if id_tipo is None or id_persona is None or not fecha or not hora or id_usuario is None:
        return jsonify({'error': 'Faltan campos requeridos'}), 422

    try:
        fecha_hora = datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({'error': 'Formato de fecha u hora inválido'}), 422

    existente = RegistroActividad.query.filter_by(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo
    ).first()

    if existente:
        return jsonify({'error': 'La persona ya tiene registrada esta actividad'}), 409

    nuevo = RegistroActividad(
        id_persona=id_persona,
        id_tipo_actividad=id_tipo,
        fecha_hora=fecha_hora,
        id_usuario=id_usuario,
        id_tipo_registro=1
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify({'mensaje': 'Registro creado exitosamente'})

@main.route('/actividades/filter', methods=['GET'])
def filtrar_actividades():
    fecha = request.args.get('fecha')
    tipo = request.args.get('tipo')

    query = RegistroActividad.query

    if fecha:
        try:
            fecha_dt = datetime.strptime(fecha, "%Y-%m-%d").date()
            query = query.filter(db.func.date(RegistroActividad.fecha_hora) == fecha_dt)
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido'}), 422

    if tipo:
        query = query.filter_by(id_tipo_actividad=tipo)

    resultados = query.all()
    data = [{
        'id': r.id,
        'id_persona': r.id_persona,
        'id_tipo_actividad': r.id_tipo_actividad,
        'id_usuario': r.id_usuario,
        'id_tipo_registro': r.id_tipo_registro,
        'fecha_hora': r.fecha_hora.strftime('%Y-%m-%d %H:%M:%S')
    } for r in resultados]

    return jsonify(data)
