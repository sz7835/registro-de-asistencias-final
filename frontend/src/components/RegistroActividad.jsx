import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistroActividad = () => {
  const [tiposActividad, setTiposActividad] = useState([]);
  const [formData, setFormData] = useState({
    fecha_hora: '',
    id_tipo_actividad: '',
    detalle: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(response => setTiposActividad(response.data))
      .catch(error => console.error('Error cargando tipos:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      id_persona: 1,           // Placeholder or replace as needed
      id_usuario: 1,           // Placeholder or replace as needed
      id_tipo_registro: 1      // Placeholder or replace as needed
    };

    axios.post('http://localhost:5000/actividades/create', payload)
      .then(() => setMessage('✅ Registro guardado'))
      .catch(() => setMessage('❌ Error al guardar'));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f5f8fc' }}>
      <div className="card shadow p-4 rounded-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h4 className="fw-bold text-dark mb-4">Asistencia - nuevo registro</h4>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Fecha de asistencia</label>
              <input
                type="date"
                name="fecha"
                className="form-control rounded-3"
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Hora</label>
              <input
                type="time"
                name="hora"
                className="form-control rounded-3"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de asistencia:</label>
            <select
              name="id_tipo_actividad"
              className="form-select rounded-3"
              value={formData.id_tipo_actividad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione uno</option>
              {tiposActividad.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Detalle</label>
            <textarea
              name="detalle"
              className="form-control rounded-3"
              rows="3"
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-secondary px-4">Cancelar</button>
            <button type="submit" className="btn btn-primary px-4">Guardar</button>
          </div>

          {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegistroActividad;
