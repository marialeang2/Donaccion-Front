import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DonationCard from '../components/DonationCard';
import RatingStars from '../components/RatingStars';

const MyDonations = ({ user }) => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const userObj = JSON.parse(userData);
      
      // Hacer petición con el token en el header
      const response = await fetch(`http://localhost:3001/api/donations/user/${userObj.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido, limpiar y redirigir
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          return;
        }
        throw new Error('Error al obtener donaciones');
      }

      const data = await response.json();
      
      // Enriquecer con datos de fundación y validar amounts
      const enrichedDonations = await Promise.all(
        data.map(async (donation) => {
          try {
            // Asegurar que amount es un número válido
            donation.amount = parseFloat(donation.amount) || 0;
            
            const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${donation.foundation_id}`);
            if (foundationResponse.ok) {
              donation.foundation = await foundationResponse.json();
            }
            return donation;
          } catch (err) {
            console.error('Error getting foundation:', err);
            // Asegurar que amount es válido incluso si falla la fundación
            donation.amount = parseFloat(donation.amount) || 0;
            return donation;
          }
        })
      );

      setDonations(enrichedDonations);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleRate = (donation) => {
  //   setSelectedDonation(donation);
  //   setRating(5);
  //   setShowRatingModal(true);
  // };

  // const handleComment = (donation) => {
  //   setSelectedDonation(donation);
  //   setComment('');
  //   setShowCommentModal(true);
  // };

  const submitRating = async () => {
    if (!selectedDonation) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await fetch('http://localhost:3001/api/ratings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData.id,
          donation_id: selectedDonation.id,
          rating: rating
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar calificación');
      }

      alert('Calificación enviada exitosamente');
      setShowRatingModal(false);
      setSelectedDonation(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const submitComment = async () => {
    if (!selectedDonation || !comment.trim()) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData.id,
          donation_id: selectedDonation.id,
          text: comment
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar comentario');
      }

      alert('Comentario enviado exitosamente');
      setShowCommentModal(false);
      setSelectedDonation(null);
      setComment('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (amount) => {
    // Validar que amount es un número válido
    const validAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(validAmount);
  };

  const getTotalDonated = () => {
    if (!donations || donations.length === 0) return 0;
    
    return donations.reduce((sum, donation) => {
      const amount = parseFloat(donation.amount) || 0;
      return sum + amount;
    }, 0);
  };

  // Verificar si hay token/usuario
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  if (!token || !userData) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <i className="fas fa-lock fa-3x text-primary mb-3"></i>
            <h3>Inicia Sesión</h3>
            <p className="text-muted">Debes iniciar sesión para ver tus donaciones</p>
            <Button as={Link} to="/login" variant="primary" size="lg">
              <i className="fas fa-sign-in-alt me-2"></i>
              Iniciar Sesión
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchDonations} />;

  // Calcular valores de manera segura
  const totalDonated = getTotalDonated();
  const totalDonations = donations ? donations.length : 0;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">{t('donations.title')}</h1>
          <p className="text-muted">{t('donations.contributionHistory')}</p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h3 className="text-primary">{formatAmount(totalDonated)}</h3>
              <p className="text-muted">{t('donations.totalDonated')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center border-success">
            <Card.Body>
              <h3 className="text-success">{totalDonations}</h3>
              <p className="text-muted">{t('donations.totalDonations')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Donations List */}
      <Row>
        <Col>
          {donations.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="fas fa-donate fa-3x text-muted mb-3"></i>
                <h5>{t('foundation.noDonations')}</h5>
                <p className="text-muted">{t('donations.noDonationsMade')}</p>
                <Button as={Link} to="/foundations" variant="primary">
                  {t('donations.startDonating')}
                </Button>
              </Card.Body>
            </Card>
          ) : (
            donations.map(donation => (
              <DonationCard
                key={donation.id}
                donation={donation}
                showFoundation={true}
              />
            ))
          )}
        </Col>
      </Row>

      {/* Rating Modal */}
      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('donations.rateDonation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <>
              <p>{t('donations.rateDescription', { foundation: selectedDonation.foundation?.legal_name })}</p>
              <Form>
                <Form.Group className="text-center">
                  <Form.Label>{t('donations.yourRating')}</Form.Label>
                  <div className="mt-2">
                    <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
                  </div>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={submitRating} disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar Calificación'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Comment Modal */}
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('donations.commentDonation')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDonation && (
            <Form>
              <Form.Group>
                <Form.Label>{t('donations.shareExperience')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="{t('donations.donationExperiencePlaceholder')}"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={submitComment} disabled={submitting || !comment.trim()}>
            {submitting ? 'Enviando...' : 'Enviar Comentario'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyDonations;