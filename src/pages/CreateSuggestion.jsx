import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CreateSuggestion = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    category: '',
    isAnonymous: false
  });

  const categories = [
    { value: 'platform', label: t('createSuggestion.categories.platform') },
    { value: 'foundations', label: t('createSuggestion.categories.foundations') },
    { value: 'opportunities', label: t('createSuggestion.categories.opportunities') },
    { value: 'donations', label: t('createSuggestion.categories.donations') },
    { value: 'certificates', label: t('createSuggestion.categories.certificates') },
    { value: 'other', label: t('createSuggestion.categories.other') }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        throw new Error(t('createSuggestion.errors.loginRequired'));
      }

      const suggestionData = {
        user_id: userData.id,
        content: formData.content,
        processed: false
      };

      const response = await fetch('http://localhost:3001/api/suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(suggestionData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        throw new Error(t('createSuggestion.errors.submitFailed'));
      }

      setSuccess(true);
      setFormData({
        content: '',
        category: '',
        isAnonymous: false
      });

      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      setError(err.message);
      console.error('Error submitting suggestion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">{t('createSuggestion.title')}</h3>
              <p className="mb-0">{t('createSuggestion.subtitle')}</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle me-3 fs-4"></i>
                    <div>
                      <strong>{t('createSuggestion.success.title')}</strong>
                      <p className="mb-0">{t('createSuggestion.success.message')}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {!success && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>{t('createSuggestion.category')}</Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">{t('createSuggestion.selectCategory')}</option>
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {t('createSuggestion.categoryHelp')}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>{t('createSuggestion.content')} *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder={t('createSuggestion.contentPlaceholder')}
                      required
                      maxLength={1000}
                    />
                    <Form.Text className="text-muted">
                      {formData.content.length}/1000 {t('createSuggestion.characters')}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleInputChange}
                      label={t('createSuggestion.anonymous')}
                    />
                    <Form.Text className="text-muted">
                      {t('createSuggestion.anonymousHelp')}
                    </Form.Text>
                  </Form.Group>

                  <div className="border-top pt-4">
                    <h5>{t('createSuggestion.guidelines.title')}</h5>
                    <ul className="text-muted small">
                      <li>{t('createSuggestion.guidelines.specific')}</li>
                      <li>{t('createSuggestion.guidelines.constructive')}</li>
                      <li>{t('createSuggestion.guidelines.respectful')}</li>
                      <li>{t('createSuggestion.guidelines.implementable')}</li>
                    </ul>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate('/')}
                    >
                      {t('common.cancel')}
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || !formData.content.trim()}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          {t('createSuggestion.submitting')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          {t('createSuggestion.submit')}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Information Cards */}
      <Row className="mt-5">
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-3">
                <i className="fas fa-lightbulb fa-2x"></i>
              </div>
              <h5>{t('createSuggestion.info.improve.title')}</h5>
              <p className="text-muted small">{t('createSuggestion.info.improve.description')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-3">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h5>{t('createSuggestion.info.community.title')}</h5>
              <p className="text-muted small">{t('createSuggestion.info.community.description')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-warning mb-3">
                <i className="fas fa-heart fa-2x"></i>
              </div>
              <h5>{t('createSuggestion.info.impact.title')}</h5>
              <p className="text-muted small">{t('createSuggestion.info.impact.description')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateSuggestion;