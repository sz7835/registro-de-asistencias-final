import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FiltroActividad from './components/FiltroActividad';
import RegistroActividad from './components/RegistroActividad';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // For future use

  const handleSuccess = () => {
    setRefreshFlag(prev => !prev); // Not used yet, ready for filter refresh
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Registro de Asistencias</h2>
        <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
          + Nuevo Registro
        </button>
      </div>

      {showModal && (
        <RegistroActividad onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}

      <FiltroActividad />
    </div>
  );
}

export default App;
