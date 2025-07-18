import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Optional: for any custom tweaks

function App() {
  const [tiposActividad, setTiposActividad] = useState([]);
  const [formData, setFormData] = useState({
    id_persona: '',
    id_tipo_actividad: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(response => setTiposActividad(response.data))
      .catch(error => console.error('Error al obtener tipos:', error));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/actividades/create', formData)
      .then(() => setMessage('✅ Actividad registrada exitosamente.'))
      .catch(() => setMessage('❌ Error al registrar la actividad.'));
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="card shadow-lg p-4 rounded-4 w-100" style={{ maxWidth: '480px', backgroundColor: '#ffffff' }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Registrar Actividad</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id_persona" className="form-label">ID Persona:</label>
            <input
              type="number"
              className="form-control rounded-3"
              id="id_persona"
              name="id_persona"
              value={formData.id_persona}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="id_tipo_actividad" className="form-label">Tipo de Actividad:</label>
            <select
              className="form-select rounded-3"
              id="id_tipo_actividad"
              name="id_tipo_actividad"
              value={formData.id_tipo_actividad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una opción</option>
              {tiposActividad.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-3">
            Registrar
          </button>
        </form>

        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </div>
    </div>
  );
}

export default App;
