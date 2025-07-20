import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const RegistroActividad = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipoAsistencia, setTipoAsistencia] = useState("");
  const [detalle, setDetalle] = useState("");
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/actividades/tipoActividad")
      .then((res) => setTipos(res.data))
      .catch((err) => console.error("Error al obtener tipos:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Print current form data to debug
    console.log({
      tipoAsistencia,
      fecha,
      hora,
      detalle,
    });

    try {
      const response = await axios.post("http://localhost:5000/actividades/create", {
        idTipoAct: tipoAsistencia,
        personaId: 1,
        fecha: fecha,
        hora: hora,
        detalle: detalle || "Detalle no proporcionado",
        createUser: 1,
      });

      alert("Registro creado exitosamente");
      console.log("Respuesta:", response.data);

      // Clear form
      setTipoAsistencia("");
      setFecha("");
      setHora("");
      setDetalle("");
    } catch (error) {
      console.error("Error al registrar asistencia:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.message || "No se pudo crear el registro"));
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header className="bg-success text-white">Nuevo Registro de Asistencia</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="tipoAsistencia" className="mb-3">
                <Form.Label>Tipo de asistencia</Form.Label>
                <Form.Select
                  value={tipoAsistencia}
                  onChange={(e) => setTipoAsistencia(e.target.value)}
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
            <Col md={3}>
              <Form.Group controlId="fecha" className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="hora" className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="detalle" className="mb-3">
            <Form.Label>Detalle (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Crear Registro
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegistroActividad;
