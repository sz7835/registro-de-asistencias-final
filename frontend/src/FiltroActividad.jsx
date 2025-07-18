// src/FiltroActividad.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FiltroActividad() {
  const [idPersona, setIdPersona] = useState('');
  const [tipoActividad, setTipoActividad] = useState('');
  const [tipos, setTipos] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(res => setTipos(res.data))
      .catch(err => console.error('Error al cargar tipos:', err));
  }, []);

  const buscarActividades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/actividades/filter', {
        params: {
          id_persona: idPersona,
          id_tipo_actividad: tipoActividad
        }
      });
      setResultados(response.data);
    } catch (err) {
      console.error('Error al buscar actividades:', err);
    }
  };

  return (
    <div className="mt-5">
      <h2>Buscar Actividades</h2>

      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label>ID Persona:</label>
          <input
            type="text"
            className="form-control"
            value={idPersona}
            onChange={e => setIdPersona(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label>Tipo de Actividad:</label>
          <select
            className="form-select"
            value={tipoActividad}
            onChange={e => setTipoActividad(e.target.value)}
          >
            <option value="">Seleccione una opción</option>
            {tipos.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={buscarActividades}>
            Buscar
          </button>
        </div>
      </div>

      {/* Results Table */}
      {resultados.length > 0 && (
        <div className="mt-4">
          <h4>Resultados</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID Registro</th>
                <th>ID Persona</th>
                <th>ID Tipo Actividad</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map(registro => (
                <tr key={registro.id}>
                  <td>{registro.id}</td>
                  <td>{registro.id_persona}</td>
                  <td>{registro.id_tipo_actividad}</td>
                  <td>{registro.fecha_hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FiltroActividad;
