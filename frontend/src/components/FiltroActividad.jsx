import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FiltroActividad = () => {
  const [tiposActividad, setTiposActividad] = useState([]);
  const [idTipoFiltro, setIdTipoFiltro] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(res => setTiposActividad(res.data))
      .catch(err => console.error('Error al cargar tipos:', err));
  }, []);

  const handleBuscar = () => {
    axios.get(`http://localhost:5000/actividades/filter?id_tipo_actividad=${idTipoFiltro}`)
      .then(res => setResultados(res.data))
      .catch(err => alert('Error al filtrar resultados.'));
  };

  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">Filtrar Asistencias</h5>
      
      <div className="d-flex align-items-end gap-3 mb-3">
        <div className="flex-grow-1">
          <label className="form-label">Tipo de Actividad</label>
          <select
            className="form-select"
            value={idTipoFiltro}
            onChange={e => setIdTipoFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {tiposActividad.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-success" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {resultados.length > 0 && (
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-light">
            <tr>
              <th>ID Persona</th>
              <th>Tipo Actividad</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((registro, index) => (
              <tr key={index}>
                <td>{registro.id_persona}</td>
                <td>{registro.nombre_actividad}</td>
                <td>{registro.fecha}</td>
                <td>{registro.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {resultados.length === 0 && (
        <p className="text-muted">No hay resultados aún.</p>
      )}
    </div>
  );
};

export default FiltroActividad;
