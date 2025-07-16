from flask import Blueprint, jsonify

# Crear un Blueprint llamado "main"
main = Blueprint('main', __name__)

# Ruta de prueba para verificar que el backend funciona correctamente
@main.route('/ping')
def ping():
    return jsonify({'message': 'pong'})
