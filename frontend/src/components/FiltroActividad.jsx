import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import axios from 'axios';

const FiltroActividad = () => {
  const [fecha, setFecha] = useState('');
  const [tipoActividad, setTipoActividad] = useState('Todos');
  const [tiposActividad, setTiposActividad] = useState([]);
  const [resultados, setResultados] = useState([]);

  const obtenerTiposActividad = async () => {
    try {
      const response = await axios.get('http://localhost:5000/actividades/tipoActividad');
      setTiposActividad(response.data);
    } catch (error) {
      console.error('Error al obtener los tipos de actividad:', error);
    }
  };

  const handleBuscar = async () => {
    try {
      const payload = {};
      if (fecha) payload.fecha = fecha;
      if (tipoActividad !== 'Todos') payload.id_tipo_actividad = tipoActividad;

      const response = await axios.get('http://localhost:5000/actividades/filter', {
        params: payload,
      });

      setResultados(response.data);
    } catch (error) {
      console.error('Error al buscar actividades:', error);
      setResultados([]);
    }
  };

  useEffect(() => {
    obtenerTiposActividad();
  }, []);

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <strong>Filtros de búsqueda</strong>
          <Button variant="outline-light" className="rounded-circle px-3 py-1">
            <i className="bi bi-house-door-fill"></i> Asignar
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Fecha de registro</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Tipo de asistencia:</Form.Label>
              <Form.Select
                value={tipoActividad}
                onChange={(e) => setTipoActividad(e.target.value)}
              >
                <option value="Todos">Todos</option>
                {tiposActividad.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleBuscar}>
                Buscar asistencia
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={2}>
              <Button variant="success">Nuevo registro</Button>
            </Col>
            <Col md={2}>
              <Form.Select>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </Form.Select>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Fecha y Hora</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Ningún dato disponible en esta tabla
                  </td>
                </tr>
              ) : (
                resultados.map((actividad, index) => (
                  <tr key={index}>
                    <td>{actividad.fecha_hora?.split('T')[0] || '--'}</td>
                    <td>{actividad.nombre_tipo || '--'}</td>
                    <td>{actividad.fecha_hora || '--'}</td>
                    <td>--</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Mostrando registros del 0 al {resultados.length} de un total de {resultados.length}
            </span>
            <div>
              <Button variant="outline-primary" className="me-2">
                &lt;
              </Button>
              <Button variant="outline-primary">&gt;</Button>
            </div>
          </div>

          <div className="mt-3">
            <Button variant="primary">Excel</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FiltroActividad;


