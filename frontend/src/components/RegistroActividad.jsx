import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Row,
  Col
} from "react-bootstrap";
import { FaCheck, FaCalendarAlt, FaClock } from "react-icons/fa";

const RegistroActividad = () => {
  const [tipoActividad, setTipoActividad] = useState([]);
  const [idTipoActividad, setIdTipoActividad] = useState("");
  const [detalle, setDetalle] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/actividades/tipoActividad")
      .then((response) => {
        setTipoActividad(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tipos de actividad", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      id_persona: 1,
      id_usuario: 1,
      id_tipo_actividad: idTipoActividad,
      detalle: detalle,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/actividades/create", body);
      alert("Registro exitoso");
      setIdTipoActividad("");
      setDetalle("");
    } catch (error) {
      alert("Error al registrar asistencia");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 rounded shadow bg-white" style={{ maxWidth: "600px", width: "100%" }}>
        <h4 className="mb-4 fw-bold">Asistencia - nuevo registro</h4>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="fecha">
              <Form.Label>Fecha de asistencia</Form.Label>
              <div className="d-flex align-items-center border rounded p-2">
                <Form.Control type="date" className="border-0 shadow-none" />
                <FaCalendarAlt className="ms-2 text-success" />
              </div>
            </Form.Group>

            <Form.Group as={Col} controlId="hora">
              <Form.Label>Hora</Form.Label>
              <div className="d-flex align-items-center border rounded p-2">
                <Form.Control type="time" className="border-0 shadow-none" />
                <FaCheck className="ms-2 text-success" />
              </div>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="tipoActividad">
            <Form.Label>Tipo de asistencia:</Form.Label>
            <Form.Select
              value={idTipoActividad}
              onChange={(e) => setIdTipoActividad(e.target.value)}
            >
              <option value="">Seleccione uno</option>
              {tipoActividad.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4" controlId="detalle">
            <Form.Label>Detalle</Form.Label>
            <div className="d-flex align-items-center border rounded p-2">
              <Form.Control
                as="textarea"
                rows={2}
                className="border-0 shadow-none"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
              <FaCheck className="ms-2 text-success" />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary">Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegistroActividad;
