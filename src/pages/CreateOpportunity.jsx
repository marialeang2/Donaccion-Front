import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CreateOpportunity = ({ user }) => {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const foundationInfo = JSON.parse(localStorage.getItem('foundationInfo'));
      const token = localStorage.getItem('token');

      if (!foundationInfo) {
        throw new Error('Se requiere información de la fundación');
      }

      // Crear fechas en formato ISO como en populateDB.py
      const startDate = new Date(`${formData.startDate}T09:00:00`);
      const endDate = new Date(`${formData.endDate}T17:00:00`);

      // EXACTAMENTE los mismos campos que en populateDB.py
      const opportunityData = {
        foundation_id: foundationInfo.id,
        description: formData.description,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      };

      console.log('Sending opportunity data:', opportunityData);

      const response = await fetch('http://localhost:3001/api/opportunities', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        throw new Error(`Error al crear oportunidad: ${errorText}`);
      }

      const createdOpportunity = await response.json();
      console.log('Opportunity created successfully:', createdOpportunity);

      navigate('/foundation/dashboard', {
        state: { message: 'Oportunidad creada exitosamente' }
      });

    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Crear Oportunidad</h2>
                <p className="text-muted">Crea una nueva oportunidad de voluntariado</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción de la Oportunidad</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe la oportunidad de voluntariado..."
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando...
                      </>
                    ) : (
                      'Crear Oportunidad'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOpportunity;