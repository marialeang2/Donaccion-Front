import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const EditOpportunity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    required_skills: '',
    volunteers_needed: '',
    contact_email: '',
    image: null
  });

  const fetchOpportunity = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/opportunities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('editOpportunity.errors.fetchFailed'));
      }

      const opportunity = await response.json();
      
      // Parse structured description if it exists
      const parsedData = parseDescription(opportunity.description);
      
      setFormData({
        title: parsedData.title || opportunity.title || '',
        description: parsedData.description || opportunity.description || '',
        start_date: new Date(opportunity.start_date).toISOString().split('T')[0],
        end_date: new Date(opportunity.end_date).toISOString().split('T')[0],
        location: parsedData.location || opportunity.location || '',
        required_skills: parsedData.skills || '',
        volunteers_needed: parsedData.volunteers || '',
        contact_email: parsedData.contact || '',
        image: null
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  const parseDescription = (description) => {
    if (!description) return {};
    
    const lines = description.split('\n\n');
    const parsed = {};
    
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        const normalizedKey = key.trim().toLowerCase().replace(' ', '_');
        parsed[normalizedKey] = value;
      }
    });

    return {
      title: parsed.título || parsed.title,
      description: parsed.descripción || parsed.description,
      skills: parsed.habilidades_requeridas || parsed.required_skills,
      location: parsed.ubicación || parsed.location,
      volunteers: parsed.voluntarios_necesarios || parsed.volunteers_needed,
      contact: parsed.contacto || parsed.contact
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildStructuredDescription = () => {
    const parts = [];
    
    if (formData.title) parts.push(`Título: ${formData.title}`);
    if (formData.description) parts.push(`Descripción: ${formData.description}`);
    if (formData.required_skills) parts.push(`Habilidades requeridas: ${formData.required_skills}`);
    if (formData.location) parts.push(`Ubicación: ${formData.location}`);
    if (formData.volunteers_needed) parts.push(`Voluntarios necesarios: ${formData.volunteers_needed}`);
    if (formData.contact_email) parts.push(`Contacto: ${formData.contact_email}`);
    
    return parts.join('\n\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Build structured description
      const structuredDescription = buildStructuredDescription();
      
      const opportunityData = {
        description: structuredDescription,
        start_date: new Date(`${formData.start_date}T09:00:00`).toISOString(),
        end_date: new Date(`${formData.end_date}T17:00:00`).toISOString()
      };

      const response = await fetch(`http://localhost:3001/api/opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });

      if (!response.ok) {
        throw new Error(t('editOpportunity.errors.updateFailed'));
      }

      // Upload image if provided
      if (formData.image) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', formData.image);
        formDataUpload.append('type', 'opportunity');
        formDataUpload.append('entity_id', id);

        await fetch('http://localhost:3001/api/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
      }

      // Success - redirect to opportunity detail
      navigate(`/opportunities/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message={t('editOpportunity.loading')} />;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">{t('editOpportunity.title')}</h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.title')} *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder={t('editOpportunity.titlePlaceholder')}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.location')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder={t('editOpportunity.locationPlaceholder')}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>{t('editOpportunity.description')} *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t('editOpportunity.descriptionPlaceholder')}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.startDate')} *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.endDate')} *</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.requiredSkills')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="required_skills"
                        value={formData.required_skills}
                        onChange={handleInputChange}
                        placeholder={t('editOpportunity.requiredSkillsPlaceholder')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>{t('editOpportunity.volunteersNeeded')}</Form.Label>
                      <Form.Control
                        type="number"
                        name="volunteers_needed"
                        value={formData.volunteers_needed}
                        onChange={handleInputChange}
                        placeholder="20"
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>{t('editOpportunity.contactEmail')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="contact@foundation.org"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('editOpportunity.image')}</Form.Label>
                  <FileUpload
                    onFileSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
                    accept="image/*"
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/opportunities/${id}`)}
                  >
                    {t('common.cancel')}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {t('editOpportunity.saving')}
                      </>
                    ) : (
                      t('editOpportunity.save')
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

export default EditOpportunity;