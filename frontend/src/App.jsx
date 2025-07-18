import { useEffect, useState } from 'react';

function App() {
  const [tipos, setTipos] = useState([]);
  const [idPersona, setIdPersona] = useState('');
  const [idTipoActividad, setIdTipoActividad] = useState('');
  const [message, setMessage] = useState('');

  // Load activity types from backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/actividades/tipoActividad')
      .then(res => res.json())
      .then(data => setTipos(data))
      .catch(err => console.error('Error fetching tipos:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      id_persona: idPersona,
      id_tipo_actividad: idTipoActividad,
      id_usuario: 1,
      id_tipo_registro: 1
    };

    const res = await fetch('http://127.0.0.1:5000/actividades/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('✅ Registro exitoso');
    } else {
      setMessage(`❌ Error: ${data.message || 'Algo salió mal'}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h2>Registrar Actividad</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Persona:</label><br />
          <input
            type="number"
            value={idPersona}
            onChange={(e) => setIdPersona(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Tipo de Actividad:</label><br />
          <select
            value={idTipoActividad}
            onChange={(e) => setIdTipoActividad(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>Registrar</button>
      </form>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}

export default App;
