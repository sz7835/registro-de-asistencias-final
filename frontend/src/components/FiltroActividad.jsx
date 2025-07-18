import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { BsHouseFill, BsFunnelFill } from 'react-icons/bs';

const FiltroActividad = () => {
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [tipoAsistencia, setTipoAsistencia] = useState('');
  const [tiposActividad, setTiposActividad] = useState([]);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    // Cargar tipos de actividad
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then((res) => setTiposActividad(res.data))
      .catch((err) => console.error('Error al cargar tipos:', err));
  }, []);

  const handleBuscar = () => {
    axios.get('http://localhost:5000/actividades/filter', {
      params: {
        fecha: fechaRegistro,
        tipo: tipoAsistencia,
      },
    })
      .then((res) => setRegistros(res.data))
      .catch((err) => console.error('Error al filtrar registros:', err));
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
          <div>
            <BsFunnelFill className="me-2" />
            Filtros de búsqueda
          </div>
          <Button variant="outline-light" className="d-flex align-items-center rounded-pill px-3 py-1" style={{ fontSize: '14px' }}>
            <BsHouseFill className="me-2" />
            Asignar
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Fecha de registro</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaRegistro}
                  onChange={(e) => setFechaRegistro(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de asistencia</Form.Label>
                <Form.Select
                  value={tipoAsistencia}
                  onChange={(e) => setTipoAsistencia(e.target.value)}
                >
                  <option value="">Todos</option>
                  {tiposActividad && tiposActividad.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleBuscar}>Buscar asistencia</Button>
            </Col>
          </Row>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button variant="success">Nuevo registro</Button>
            <div className="d-flex align-items-center">
              <span className="me-2">Mostrar</span>
              <Form.Select style={{ width: '80px' }}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </Form.Select>
              <span className="ms-2">registros</span>
            </div>
          </div>

          <Table bordered hover>
            <thead className="table-primary">
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Fecha y Hora</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">Ningún dato disponible en esta tabla</td>
                </tr>
              ) : (
                registros.map((registro, idx) => (
                  <tr key={idx}>
                    <td>{registro.fecha}</td>
                    <td>{registro.tipo}</td>
                    <td>{registro.fecha_hora}</td>
                    <td>{registro.detalle}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="outline-primary">Excel</Button>
            <div>
              <Button variant="light" className="me-2">{'<'}</Button>
              <Button variant="light">{'>'}</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FiltroActividad;

