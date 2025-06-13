import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MyParticipations = ({ user }) => {
  const { t } = useTranslation();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
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
      const response = await fetch(`http://localhost:3001/api/participation-requests/user/${userObj.id}`, {
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
        throw new Error('Error al obtener participaciones');
      }

      const data = await response.json();
      
      // Enriquecer con datos de oportunidad y fundación
      const enrichedParticipations = await Promise.all(
        data.map(async (participation) => {
          try {
            // Obtener detalles de la oportunidad
            const opportunityResponse = await fetch(`http://localhost:3001/api/opportunities/${participation.social_action_id}`);
            if (opportunityResponse.ok) {
              participation.opportunity = await opportunityResponse.json();
              
              // Obtener detalles de la fundación
              if (participation.opportunity.foundation_id) {
                const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${participation.opportunity.foundation_id}`);
                if (foundationResponse.ok) {
                  participation.opportunity.foundation = await foundationResponse.json();
                }
              }
            }
            return participation;
          } catch (err) {
            console.error('Error enriching participation:', err);
            return participation;
          }
        })
      );

      setParticipations(enrichedParticipations);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Pendiente' },
      accepted: { bg: 'success', text: 'Aceptado' },
      rejected: { bg: 'danger', text: 'Rechazado' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getOpportunityStatus = (opportunity) => {
    if (!opportunity) return null;
    
    const now = new Date();
    const startDate = new Date(opportunity.start_date);
    const endDate = new Date(opportunity.end_date);
    
    if (now < startDate) {
      return <Badge bg="info">Próximamente</Badge>;
    } else if (now >= startDate && now <= endDate) {
      return <Badge bg="success">Activa</Badge>;
    } else {
      return <Badge bg="secondary">Finalizada</Badge>;
    }
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
            <h3>{t('common.loginShort')}</h3>
            <p className="text-muted">{t('common.loginRequiredToViewParticipations')}</p>
            <Button as={Link} to="/login" variant="primary" size="lg">
              <i className="fas fa-sign-in-alt me-2"></i>
              {t('common.loginShort')}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchParticipations} />;

  const pendingParticipations = participations.filter(p => p.status === 'pending');
  const acceptedParticipations = participations.filter(p => p.status === 'accepted');
  const rejectedParticipations = participations.filter(p => p.status === 'rejected');

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">{t('participations.title')}</h1>
          <p className="text-muted">{t('participations.subtitle')}</p>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h3 className="text-warning">{pendingParticipations.length}</h3>
              <p className="text-muted">{t('participants.pending')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h3 className="text-success">{acceptedParticipations.length}</h3>
              <p className="text-muted">{t('participants.accepted')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <h3 className="text-danger">{rejectedParticipations.length}</h3>
              <p className="text-muted">{t('participants.rejected')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h3 className="text-primary">{participations.length}</h3>
              <p className="text-muted">{t('participants.total')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Participations Tabs */}
      <Row>
        <Col>
          {participations.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                <h5>{t('participations.noParticipations')}</h5>
                <p className="text-muted">{t('participations.noParticipationsDescription')}</p>
                <Button as={Link} to="/opportunities" variant="primary">
                  {t('home.findOpportunities')}
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Tabs defaultActiveKey="all" className="mb-3">
              <Tab eventKey="all" title="Todas">
                {participations.map(participation => (
                  <Card key={participation.id} className="mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <h5>
                            <Link 
                              to={`/opportunities/${participation.social_action_id}`}
                              className="text-decoration-none"
                            >
                              {participation.opportunity?.title || 
                               participation.opportunity?.description?.substring(0, 100) + '...' ||
                               'Oportunidad'}
                            </Link>
                          </h5>
                          {participation.opportunity?.foundation && (
                            <p className="text-muted mb-1">
                              <i className="fas fa-building me-1"></i>
                              <Link 
                                to={`/foundations/${participation.opportunity.foundation.id}`}
                                className="text-decoration-none"
                              >
                                {participation.opportunity.foundation.legal_name}
                              </Link>
                            </p>
                          )}
                          <p className="text-muted mb-1">
                            <i className="fas fa-calendar me-1"></i>
                            <p>{t('participations.appliedOnn', { date: new Date(participation.request_date).toLocaleDateString() })}</p>

                          </p>
                          {participation.opportunity && (
                            <p className="text-muted mb-1">
                              <i className="fas fa-clock me-1"></i>
                              {new Date(participation.opportunity.start_date).toLocaleDateString()} - {new Date(participation.opportunity.end_date).toLocaleDateString()}
                            </p>
                          )}
                          {participation.message && (
                            <div className="mt-2">
                              <small className="text-muted">{t('participations.messageLabel')}</small>
                              <p className="small">{participation.message}</p>
                            </div>
                          )}
                        </Col>
                        <Col md={4} className="text-end">
                          <div className="mb-2">
                            {getStatusBadge(participation.status)}
                          </div>
                          {participation.opportunity && (
                            <div className="mb-2">
                              {getOpportunityStatus(participation.opportunity)}
                            </div>
                          )}
                          <div>
                            <Button 
                              as={Link}
                              to={`/opportunities/${participation.social_action_id}`}
                              variant="outline-primary" 
                              size="sm"
                            >
                              {t('common.viewDetails')}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Tab>

              <Tab eventKey="pending" title="Pendientes">
                {pendingParticipations.length === 0 ? (
                  <Card>
                    <Card.Body className="text-center py-3">
                      <p className="text-muted">{t('participations.noPendingParticipations')}</p>
                    </Card.Body>
                  </Card>
                ) : (
                  pendingParticipations.map(participation => (
                    <Card key={participation.id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <h6>
                              <Link 
                                to={`/opportunities/${participation.social_action_id}`}
                                className="text-decoration-none"
                              >
                                {participation.opportunity?.title || 
                                 participation.opportunity?.description?.substring(0, 100) + '...' ||
                                 'Oportunidad'}
                              </Link>
                            </h6>
                            <p className="text-muted small mb-0">
                              {t('participations.appliedOnn', { date: new Date(participation.request_date).toLocaleDateString() })}
                            </p>
                          </Col>
                          <Col md={4} className="text-end">
                            {getStatusBadge(participation.status)}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Tab>

              <Tab eventKey="accepted" title="Aceptadas">
                {acceptedParticipations.length === 0 ? (
                  <Card>
                    <Card.Body className="text-center py-3">
                      <p className="text-muted">{t('participations.noAcceptedParticipations')}</p>
                    </Card.Body>
                  </Card>
                ) : (
                  acceptedParticipations.map(participation => (
                    <Card key={participation.id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <h6>
                              <Link 
                                to={`/opportunities/${participation.social_action_id}`}
                                className="text-decoration-none"
                              >
                                {participation.opportunity?.title || 
                                 participation.opportunity?.description?.substring(0, 100) + '...' ||
                                 'Oportunidad'}
                              </Link>
                            </h6>
                            <p className="text-muted small mb-0">
                              {t('participations.acceptedOnn', {date: new Date(participation.updated_at || participation.request_date).toLocaleDateString()})}
                            </p>
                          </Col>
                          <Col md={4} className="text-end">
                            <div className="mb-2">
                              {getStatusBadge(participation.status)}
                            </div>
                            {participation.opportunity && getOpportunityStatus(participation.opportunity)}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Tab>
            </Tabs>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyParticipations;