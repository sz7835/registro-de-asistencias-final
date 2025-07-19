import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RegistroActividad = () => {
  const [tipos, setTipos] = useState([]);
  const [idTipoAct, setIdTipoAct] = useState('');
  const [personaId, setPersonaId] = useState('');
  const [createUser, setCreateUser] = useState('');
  const [fechaHora, setFechaHora] = useState(new Date());
  const [detalle, setDetalle] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then((res) => setTipos(res.data))
      .catch((err) => console.error('Error al cargar tipos:', err));
  }, []);

  const formatFecha = (date) => {
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
  };

  const formatHora = (date) => {
    return date.toTimeString().slice(0, 5); // HH:mm
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      idTipoAct: parseInt(idTipoAct),
      personaId: parseInt(personaId),
      fecha: formatFecha(fechaHora),
      hora: formatHora(fechaHora),
      detalle: detalle.trim() === '' ? 'Detalle no proporcionado' : detalle,
      createUser: parseInt(createUser),
    };

    try {
      const res = await axios.post('http://localhost:5000/actividades/create', payload);
      setMensaje('✅ Registro exitoso');
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al registrar asistencia');
    }
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Nuevo Registro de Asistencia</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>ID Persona</Form.Label>
                <Form.Control
                  type="number"
                  value={personaId}
                  onChange={(e) => setPersonaId(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>ID Usuario</Form.Label>
                <Form.Control
                  type="number"
                  value={createUser}
                  onChange={(e) => setCreateUser(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de Asistencia</Form.Label>
                <Form.Select
                  value={idTipoAct}
                  onChange={(e) => setIdTipoAct(e.target.value)}
                  required
                >
                  <option value="">Seleccione</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha y Hora</Form.Label>
                <DatePicker
                  selected={fechaHora}
                  onChange={(date) => setFechaHora(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                  className="form-control"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Detalle</Form.Label>
                <Form.Control
                  type="text"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Escriba un detalle opcional"
                />
              </Form.Group>
            </Col>
          </Row>

          {mensaje && (
            <Row className="mb-3">
              <Col>
                <span className={mensaje.includes('✅') ? 'text-success' : 'text-danger'}>
                  {mensaje}
                </span>
              </Col>
            </Row>
          )}

          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button variant="secondary" type="reset">
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistroActividad;
