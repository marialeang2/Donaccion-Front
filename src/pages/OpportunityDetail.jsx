import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Modal, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CommentSection from '../components/CommentSection';
import FavoriteButton from '../components/FavoriteButton';
import RatingStars from '../components/RatingStars';
import ParticipantsList from '../components/ParticipantsList';
import { getConsistentImage } from '../utils/ImageUtils';
import { FaShareAlt, FaTwitter, FaFacebook, FaBuilding, FaDonate, FaHandPaper, FaUsers } from 'react-icons/fa';

const OpportunityDetail = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [canManageParticipants, setCanManageParticipants] = useState(false);
  const [canViewParticipants, setCanViewParticipants] = useState(false);

  const fetchOpportunityData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching opportunity data for ID:', id);
      const opportunityResponse = await fetch(`http://localhost:3001/api/opportunities/${id}`);
      if (!opportunityResponse.ok) {
        console.error('Error fetching opportunity:', opportunityResponse.status);
        throw new Error(t('opportunity.notFound'));
      }
      const opportunityData = await opportunityResponse.json();
      console.log('Opportunity data received:', opportunityData);

      if (opportunityData.foundation_id) {
        try {
          const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${opportunityData.foundation_id}`);
          if (foundationResponse.ok) {
            opportunityData.foundation = await foundationResponse.json();
            console.log('Foundation data:', opportunityData.foundation);
          }
        } catch (foundationErr) {
          console.error('Error fetching foundation:', foundationErr);
          // No lanzar error, solo continuar sin datos de la fundación
        }
      }

      try {
        const ratingResponse = await fetch(`http://localhost:3001/api/ratings/opportunity/${id}/average`);
        if (ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          opportunityData.averageRating = ratingData.average_rating || 0;
          opportunityData.ratingCount = ratingData.count || 0;
          console.log('Rating data:', ratingData);
        }
      } catch (ratingErr) {
        console.error('Error fetching ratings:', ratingErr);
        // No lanzar error, solo continuar sin datos de valoraciones
      }

      setOpportunity(opportunityData);
      
      // Verificar si el usuario actual es el propietario de la oportunidad
      const isUserOwner = user && 
                          user.user_type === 'foundation' && 
                          opportunityData.foundation && 
                          user.id === opportunityData.foundation.user_id;
                          
      setIsOwner(isUserOwner);
      
      // El usuario puede gestionar participantes si es propietario O si es admin@admin.com
      const isFullAdmin = user && user.email === 'admin@admin.com';
      const isReadOnlyAdmin = user && user.email === 'admin@lector.com';
      
      console.log('User roles:', {
        isOwner: isUserOwner,
        isFullAdmin,
        isReadOnlyAdmin
      });
      
      // Puede gestionar (modificar) participantes: admin completo o propietario
      setCanManageParticipants(isUserOwner || isFullAdmin);
      
      // Puede ver participantes: cualquier admin o propietario
      setCanViewParticipants(isUserOwner || isFullAdmin || isReadOnlyAdmin);
      
    } catch (err) {
      console.error('Error in fetchOpportunityData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, t, user]);

  useEffect(() => {
    if (id) {
      fetchOpportunityData();
    }
  }, [fetchOpportunityData, id]);

  const getStatusBadge = () => {
    if (!opportunity) return null;

    const now = new Date();
    const startDate = new Date(opportunity.start_date);
    const endDate = new Date(opportunity.end_date);

    if (now < startDate) {
      return <Badge bg="info" className="fs-6">{t('opportunities.upcoming')}</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge bg="success" className="fs-6">{t('opportunities.active')}</Badge>;
    } else {
      return <Badge bg="secondary" className="fs-6">{t('opportunities.ended')}</Badge>;
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.user_type === 'foundation') {
      alert(t('opportunity.foundationsCannotApply'));
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/opportunities/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: applicationMessage
        })
      });

      if (!response.ok) {
        throw new Error(t('opportunity.applicationError'));
      }

      alert(t('opportunity.applicationSuccess'));
      setShowApplicationModal(false);
      setApplicationMessage('');
    } catch (err) {
      alert(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchOpportunityData} />;
  if (!opportunity) return <ErrorMessage error={t('opportunity.notFound')} />;

  return (
    <Container className="py-5 opportunity-details">
      <Row>
        <Col md={8}>
          <Card className="shadow-sm">
            <div className="position-relative">
              <Card.Img
                variant="top"
                src={opportunity.image || getConsistentImage('opportunities', opportunity.id)}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 p-3">
                {getStatusBadge()}
              </div>
              {user && (
                <div className="position-absolute top-0 end-0 p-3">
                  <FavoriteButton 
                    item={opportunity}
                    itemType="opportunity"
                    user={user}
                  />
                </div>
              )}
            </div>

            <Card.Body>
              <h1 className="fw-bold">
                {opportunity.title || opportunity.description?.substring(0, 100) + '...'}
              </h1>

              <div className="mb-3">
                <Link to={`/foundations/${opportunity.foundation?.id}`} className="text-decoration-none">
                  <h5 className="text-primary">
                    <FaBuilding className="me-2" />
                    {opportunity.foundation?.legal_name || t('opportunity.foundation')}
                  </h5>
                </Link>
              </div>

              <div className="mb-3">
                <RatingStars rating={opportunity.averageRating} showValue={true} />
                <small className="text-muted ms-2">
                  ({opportunity.ratingCount} {t('opportunity.reviews')})
                </small>
              </div>

              <h5>{t('opportunity.description')}</h5>
              <p className="text-muted">{opportunity.description}</p>

              <h5>{t('opportunity.details')}</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>{t('opportunity.startDate')}:</strong> {new Date(opportunity.start_date).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('opportunity.endDate')}:</strong> {new Date(opportunity.end_date).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('opportunity.location')}:</strong> {opportunity.location || opportunity.foundation?.address || t('common.locationNotSpecified')}
                </ListGroup.Item>
                {opportunity.foundation?.phone && (
                  <ListGroup.Item>
                    <strong>{t('opportunity.contact')}:</strong> {opportunity.foundation.phone}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Lista de participantes (visible para propietarios y admins) */}
          {canViewParticipants && (
            <ParticipantsList 
              opportunityId={id} 
              user={user} 
              readOnly={user.email === 'admin@lector.com'}
            />
          )}

          <div className="mt-4">
            <CommentSection itemId={opportunity.id} itemType="opportunity" user={user} />
          </div>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h5>{t('opportunity.actions')}</h5>

              <div className="d-grid gap-2">
                {isOwner || user?.email === 'admin@admin.com' ? (
                  <Button as={Link} to={`/opportunities/${id}/edit`} variant="primary" size="lg">
                    <i className="fas fa-edit me-2"></i>
                    {t('opportunity.edit')}
                  </Button>
                ) : (
                  user && user.user_type === 'user' && (
                    <Button variant="primary" size="lg" onClick={handleApply}>
                      <FaHandPaper className="me-2" />
                      {t('opportunity.apply')}
                    </Button>
                  )
                )}

                {canManageParticipants && (
                  <Button as={Link} to={`/opportunities/${id}/participants`} variant="info">
                    <FaUsers className="me-2" />
                    {t('opportunity.manageParticipants')}
                  </Button>
                )}

                <Button as={Link} to={`/foundations/${opportunity.foundation?.id}`} variant="outline-primary">
                  <FaBuilding className="me-2" />
                  {t('opportunity.viewFoundation')}
                </Button>

                <Button as={Link} to={`/donate/${opportunity.foundation?.id}`} variant="outline-success">
                  <FaDonate className="me-2" />
                  {t('opportunity.supportFoundation')}
                </Button>
              </div>

              <hr />

              <h6>{t('opportunity.shareOpportunity')}</h6>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => navigator.share ? 
                    navigator.share({
                      title: opportunity.title || opportunity.description,
                      url: window.location.href
                    }) : 
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <FaShareAlt />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  as="a"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(opportunity.title || opportunity.description)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  as="a"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </Button>
              </div>
            </Card.Body>
          </Card>

          {opportunity.foundation && (
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <h6>{t('opportunity.aboutFoundation')}</h6>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={opportunity.foundation.image_url || getConsistentImage('foundations', opportunity.foundation.id)}
                    alt={opportunity.foundation.legal_name}
                    className="rounded-circle me-3"
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0">{opportunity.foundation.legal_name}</h6>
                    <small className="text-muted">{opportunity.foundation.address}</small>
                  </div>
                </div>
                <p className="small text-muted">
                  {opportunity.foundation.description || t('foundation.noDescription')}
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showApplicationModal} onHide={() => setShowApplicationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('opportunity.applicationForm')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t('opportunity.applicationMessage')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                placeholder={t('opportunity.applicationPlaceholder')}
              />
              <Form.Text className="text-muted">{t('opportunity.applicationHint')}</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={submitApplication} disabled={applying}>
            {applying ? t('common.submitting') : t('opportunity.submitApplication')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OpportunityDetail;