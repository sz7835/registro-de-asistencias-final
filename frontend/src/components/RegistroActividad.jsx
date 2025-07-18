import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./RegistroActividad.css";

const RegistroActividad = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipoAsistencia, setTipoAsistencia] = useState("");
  const [detalle, setDetalle] = useState("");
  const [tiposDeAsistencia, setTiposDeAsistencia] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/actividades/tipoActividad")
      .then((response) => response.json())
      .then((data) => setTiposDeAsistencia(data))
      .catch((error) => console.error("Error fetching tipos:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const actividad = {
      fecha,
      hora,
      id_tipo_actividad: tipoAsistencia,
      detalle,
    };
    console.log("Actividad enviada:", actividad);
    // Aquí conectarás con el backend más adelante
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card">
        <h4 className="registro-title">Asistencia - nuevo registro</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Label className="registro-label">Fecha de asistencia</Form.Label>
              <div className="registro-input-icon">
                <Form.Control
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
                <FaCalendarAlt className="registro-icon" />
                <FaCheck className="registro-check" />
              </div>
            </Col>
            <Col>
              <Form.Label className="registro-label">Hora</Form.Label>
              <div className="registro-input-icon">
                <Form.Control
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />
                <FaClock className="registro-icon" />
                <FaCheck className="registro-check" />
              </div>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label className="registro-label">Tipo de asistencia:</Form.Label>
            <Form.Select
              value={tipoAsistencia}
              onChange={(e) => setTipoAsistencia(e.target.value)}
              required
            >
              <option value="">Seleccione uno</option>
              {tiposDeAsistencia.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label className="registro-label">Detalle</Form.Label>
            <div className="registro-input-icon">
              <Form.Control
                as="textarea"
                rows={3}
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
              <FaCheck className="registro-check" />
            </div>
          </Form.Group>

          <div className="registro-buttons">
            <Button variant="secondary" type="button">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegistroActividad;
