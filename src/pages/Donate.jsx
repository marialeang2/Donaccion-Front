import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getConsistentImage } from '../utils/ImageUtils';

const Donate = ({ user }) => {
  const { t } = useTranslation();
  const { foundationId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [foundation, setFoundation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    donorName: '',
    donorEmail: '',
    dedication: '',
    isMonthly: false,
    paymentMethod: ''
  });

  // Predefined amounts (like in original Donate.jsx)
  const predefinedAmounts = [25000, 50000, 100000, 250000];

  const fetchFoundation = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3001/api/foundations/${foundationId}`);
      if (!response.ok) {
        throw new Error(t('foundation.notFound'));
      }
      const data = await response.json();
      setFoundation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [foundationId, t]);

  useEffect(() => {
    if (foundationId) {
      fetchFoundation();
    }
    
    // Pre-fill user data if logged in (like in original)
    if (user) {
      setFormData(prev => ({
        ...prev,
        donorName: user.name,
        donorEmail: user.email
      }));
    }
  }, [foundationId, user, fetchFoundation]);

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount,
      customAmount: ''
    }));
  };

  const handleCustomAmountChange = (e) => {
    setFormData(prev => ({
      ...prev,
      customAmount: e.target.value,
      amount: ''
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getFinalAmount = () => {
    return formData.amount || parseFloat(formData.customAmount) || 0;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in - same way as CreateOpportunity
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      navigate('/login', { state: { from: `/donate/${foundationId}` } });
      return;
    }

    const userObj = JSON.parse(userData);

    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount <= 0) {
      setError(t('donate.invalidAmount'));
      return;
    }

    

    setSubmitting(true);
    setError('');

    try {
      // Create donation data EXACTLY like in populateDB.py
      const donationData = {
        user_id: userObj.id,
        foundation_id: foundation.id,
        amount: finalAmount
      };

      console.log('=== DONATION DEBUG ===');
      console.log('User from localStorage:', userObj);
      console.log('Foundation:', foundation);
      console.log('Donation data:', donationData);
      console.log('Token exists:', !!token);

      // Make request exactly like in populateDB.py and other components
      const response = await fetch('http://localhost:3001/api/donations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalid, clear and redirect (like in other components)
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(t('donate.processingError'));
      }

      const donation = await response.json();
      console.log('SUCCESS! Donation created:', donation);

      // Simulate payment processing (like in original)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to my-donations with success message (like in original)
      navigate('/my-donations', {
        state: { 
          message: t('donate.successMessage', { 
            amount: formatAmount(finalAmount),
            foundation: foundation.legal_name 
          })
        }
      });

    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading spinner
  if (loading) return <LoadingSpinner />;
  
  // Show error if can't load foundation
  if (error && !foundation) return <ErrorMessage error={error} onRetry={fetchFoundation} />;

  // Check for auth status at the END like Favorites.jsx does
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  if (!token || !userData) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <i className="fas fa-lock fa-3x text-primary mb-3"></i>
            <h3>Inicia Sesión</h3>
            <p className="text-muted">Debes iniciar sesión para realizar donaciones</p>
            <Button as={Link} to="/login" variant="primary" size="lg">
              <i className="fas fa-sign-in-alt me-2"></i>
              Iniciar Sesión
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold">{t('donate.title')}</h2>
                {foundation && (
                  <div className="d-flex align-items-center justify-content-center mt-3">
                    <img
                      src={foundation.image_url || getConsistentImage('foundations', foundation.id)}
                      alt={foundation.legal_name}
                      className="rounded-circle border border-3 border-white me-3"
                      width="120"
                      height="120"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Amount Selection */}
                <div className="mb-4">
                  <h5>{t('donate.selectAmount')}</h5>
                  <ButtonGroup className="w-100 mb-3">
                    {predefinedAmounts.map(amount => (
                      <Button
                        key={amount}
                        variant={formData.amount === amount ? 'primary' : 'outline-primary'}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        {formatAmount(amount)}
                      </Button>
                    ))}
                  </ButtonGroup>
                  
                  <Form.Group>
                    <Form.Label>{t('donate.customAmount')}</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder={t('donate.customAmountPlaceholder')}
                      min="1000"
                    />
                  </Form.Group>
                </div>

                

                {/* Summary */}
                <div className="bg-light p-3 rounded mb-4">
                  <h6>{t('donate.summary')}</h6>
                  <div className="d-flex justify-content-between">
                    <span>{t('donate.amount')}:</span>
                    <strong>{formatAmount(getFinalAmount())}</strong>
                  </div>
                  {formData.isMonthly && (
                    <div className="d-flex justify-content-between">
                      <span>{t('donate.frequency')}:</span>
                      <span>{t('donate.monthly')}</span>
                    </div>
                  )}
                  {foundation && (
                    <div className="d-flex justify-content-between">
                      <span>{t('donate.beneficiary')}:</span>
                      <span>{foundation.legal_name}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={submitting || getFinalAmount() <= 0}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('donate.processing')}
                      </>
                    ) : (
                      t('donate.submitDonation', { amount: formatAmount(getFinalAmount()) })
                    )}
                  </Button>
                </div>

                {/* Security Note */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="fas fa-lock me-1"></i>
                    {t('donate.securityNote')}
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Donate;