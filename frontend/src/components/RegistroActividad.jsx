import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';

const RegistroActividad = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [tipoAsistencia, setTipoAsistencia] = useState('');
  const [detalle, setDetalle] = useState('');
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/actividades/tipoActividad')
      .then(res => setTipos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      id_persona: 1,
      id_usuario: 1,
      id_tipo_actividad: tipoAsistencia,
      fecha_hora: `${fecha} ${hora}`,
      id_tipo_registro: 1,
      detalle
    };

    try {
      await axios.post('http://localhost:5000/actividades/create', data);
      alert('Asistencia registrada exitosamente');
    } catch (error) {
      alert('Error al registrar asistencia');
    }
  };

  const today = new Date();
  const defaultFecha = today.toISOString().split('T')[0];

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <Card className="shadow-sm border-0" style={{ width: '40rem', borderRadius: '12px' }}>
        <Card.Body>
          <Card.Title className="fs-4 fw-bold mb-4 text-center">Asistencia - nuevo registro</Card.Title>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex gap-3 mb-3">
              <Form.Group style={{ flex: 1 }}>
                <Form.Label className="text-muted fw-semibold">Fecha de asistencia</Form.Label>
                <Form.Control
                  type="date"
                  value={fecha}
                  defaultValue={defaultFecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="border-success"
                  required
                />
              </Form.Group>
              <Form.Group style={{ flex: 1 }}>
                <Form.Label className="text-muted fw-semibold">Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="border-success"
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="text-muted fw-semibold">Tipo de asistencia:</Form.Label>
              <Form.Select
                value={tipoAsistencia}
                onChange={(e) => setTipoAsistencia(e.target.value)}
                className="border-success"
                required
              >
                <option value="">Seleccione uno</option>
                {tipos.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-muted fw-semibold">Detalle</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                className="border-success"
              />
            </Form.Group>

            <div className="d-flex justify-content-center gap-3">
              <Button variant="secondary" className="px-4" type="button">Cancelar</Button>
              <Button style={{ backgroundColor: '#9896f0', border: 'none' }} type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegistroActividad;
