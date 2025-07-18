import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistroActividad = ({ onClose, onSuccess }) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [idTipoActividad, setIdTipoActividad] = useState('');
  const [detalle, setDetalle] = useState('');
  const [tiposActividad, setTiposActividad] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(res => setTiposActividad(res.data))
      .catch(err => console.error('Error al cargar tipos:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id_persona: 1,  // Simulado por ahora
      id_tipo_actividad: idTipoActividad
    };

    axios.post('http://localhost:5000/actividades/create', payload)
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch(() => alert('Error al registrar la actividad.'));
  };

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Asistencia - nuevo registro</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Fecha de asistencia</label>
                  <input
                    type="date"
                    className="form-control border-success"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    className="form-control border-success"
                    value={hora}
                    onChange={e => setHora(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Tipo de asistencia:</label>
                <select
                  className="form-control"
                  value={idTipoActividad}
                  onChange={e => setIdTipoActividad(e.target.value)}
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
                  className="form-control border-success"
                  value={detalle}
                  onChange={e => setDetalle(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroActividad;
