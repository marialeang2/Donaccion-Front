import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';

const FoundationSetup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    legal_name: '',
    address: '',
    phone: '',
    website: '',
    description: '',
    image: null
  });

  const checkFoundationStatus = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      if (!userData || userData.user_type !== 'foundation') {
        navigate('/');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/foundations/user/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const foundation = await response.json();
        if (foundation.legal_name && foundation.address) {
          // Foundation is already complete
          navigate('/foundation/dashboard');
        } else {
          // Foundation exists but incomplete, populate form
          setFormData({
            legal_name: foundation.legal_name || '',
            address: foundation.address || '',
            phone: foundation.phone || '',
            website: foundation.website || '',
            description: foundation.description || '',
            image: null
          });
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, [navigate, setFormData]);

  useEffect(() => {
    checkFoundationStatus();
  }, [checkFoundationStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.legal_name || !formData.address || !formData.phone) {
        setError(t('foundationSetup.errors.requiredFields'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      // Update foundation data
      const foundationData = {
        legal_name: formData.legal_name,
        address: formData.address,
        phone: formData.phone,
        website: formData.website || null,
        description: formData.description || null
      };

      const response = await fetch(`http://localhost:3001/api/foundations/user/${userData.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(foundationData)
      });

      if (!response.ok) {
        throw new Error(t('foundationSetup.errors.updateFailed'));
      }

      // Upload image if provided
      if (formData.image) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', formData.image);
        formDataUpload.append('type', 'foundation');
        formDataUpload.append('entity_id', userData.id);

        await fetch('http://localhost:3001/api/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });
      }

      // Success - redirect to dashboard
      navigate('/foundation/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  if (loading) return <LoadingSpinner message={t('foundationSetup.updating')} />;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">{t('foundationSetup.title')}</h3>
              <p className="mb-0">{t('foundationSetup.subtitle')}</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>{t('foundationSetup.step')} {step} {t('foundationSetup.of')} {totalSteps}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar now={progress} variant="primary" />
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div>
                  <h4 className="mb-4">{t('foundationSetup.step1.title')}</h4>
                  
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t('foundationSetup.legalName')} *</Form.Label>
                          <Form.Control
                            type="text"
                            name="legal_name"
                            value={formData.legal_name}
                            onChange={handleInputChange}
                            placeholder={t('foundationSetup.legalNamePlaceholder')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>{t('foundationSetup.phone')} *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t('foundationSetup.phonePlaceholder')}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>{t('foundationSetup.address')} *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={t('foundationSetup.addressPlaceholder')}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>{t('foundationSetup.website')}</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://www.example.com"
                      />
                    </Form.Group>
                  </Form>
                </div>
              )}

              {/* Step 2: Additional Information */}
              {step === 2 && (
                <div>
                  <h4 className="mb-4">{t('foundationSetup.step2.title')}</h4>
                  
                  <Form>
                    <Form.Group className="mb-4">
                      <Form.Label>{t('foundationSetup.description')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={t('foundationSetup.descriptionPlaceholder')}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>{t('foundationSetup.logo')}</Form.Label>
                      <FileUpload
                        onFileSelect={(file) => setFormData(prev => ({ ...prev, image: file }))}
                        accept="image/*"
                      />
                    </Form.Group>
                  </Form>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  {t('common.previous')}
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {step === totalSteps ? t('foundationSetup.complete') : t('common.next')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FoundationSetup;