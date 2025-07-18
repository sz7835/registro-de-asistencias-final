import React from 'react';
import RegistroActividad from './components/RegistroActividad';
import FiltroActividad from './components/FiltroActividad'; // ✅ import it

function App() {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sistema de Registro de Asistencias</h2>

      {/* ✅ FIRST: Filter existing records */}
      <FiltroActividad />

      <hr />

      {/* ✅ SECOND: Register a new attendance */}
      <RegistroActividad />
    </div>
  );
}

export default App;
