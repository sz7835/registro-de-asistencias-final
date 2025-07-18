import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Form, Table } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';

const FiltroActividad = () => {
  const [fecha, setFecha] = useState('');
  const [tipoAsistencia, setTipoAsistencia] = useState('');
  const [tipos, setTipos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [cantidadRegistros, setCantidadRegistros] = useState(10);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(res => setTipos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBuscar = async () => {
    try {
      const response = await axios.get('http://localhost:5000/actividades/filter', {
        params: {
          fecha,
          id_tipo_actividad: tipoAsistencia
        }
      });
      setResultados(response.data);
    } catch (error) {
      console.error('Error al buscar actividades:', error);
      alert('Error al buscar actividades');
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card className="shadow-sm border-0" style={{ width: '80rem', borderRadius: '12px' }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-2" style={{ backgroundColor: '#dce8ff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="fw-bold mb-0 text-primary">Filtros de búsqueda</h5>
          <Button variant="light" className="shadow-sm rounded-circle"><FaHome /></Button>
        </div>
        <Card.Body>
          <div className="d-flex gap-3 mb-3">
            <Form.Group style={{ flex: 1 }}>
              <Form.Label className="text-muted fw-semibold">Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="border-success"
              />
            </Form.Group>
            <Form.Group style={{ flex: 2 }}>
              <Form.Label className="text-muted fw-semibold">Tipo de asistencia</Form.Label>
              <Form.Select
                value={tipoAsistencia}
                onChange={(e) => setTipoAsistencia(e.target.value)}
                className="border-success"
              >
                <option value="">Seleccione uno</option>
                {tipos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <Button variant="primary" onClick={handleBuscar} className="mb-4 px-4" style={{ backgroundColor: '#9896f0', border: 'none' }}>
            Buscar asistencia
          </Button>

          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Tipo de Asistencia</th>
                <th>Fecha y Hora</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {resultados.slice(0, cantidadRegistros).map((res, index) => (
                <tr key={res.id} className="text-center">
                  <td>{index + 1}</td>
                  <td>{res.nombre_tipo_actividad}</td>
                  <td>{res.fecha_hora}</td>
                  <td>{res.detalle || '—'}</td>
                </tr>
              ))}
              {resultados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="success" disabled>Exportar a Excel</Button>
            <Form.Select
              style={{ width: '10rem' }}
              value={cantidadRegistros}
              onChange={(e) => setCantidadRegistros(Number(e.target.value))}
            >
              <option value={10}>Mostrar 10 registros</option>
              <option value={25}>Mostrar 25 registros</option>
              <option value={50}>Mostrar 50 registros</option>
            </Form.Select>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FiltroActividad;


