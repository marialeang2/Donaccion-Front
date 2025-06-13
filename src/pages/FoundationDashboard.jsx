import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';

const FoundationDashboard = ({ user }) => {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    foundation: null,
    stats: {},
    recentOpportunities: [],
    pendingApplications: [],
    recentDonations: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [actionType, setActionType] = useState(''); // 'accept' or 'reject'

  const fetchDashboardData = useCallback(async (token, userObj) => {
    try {
      console.log('Fetching foundation info for user:', userObj.id);
      
      // 1. Fetch foundation info
      const foundationResponse = await fetch(`http://localhost:3001/api/foundations/user/${userObj.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Foundation response status:', foundationResponse.status);
      
      if (foundationResponse.status === 401) {
        console.log('401 error, cleaning localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      let foundation = null;
      if (foundationResponse.ok) {
        foundation = await foundationResponse.json();
        console.log('Foundation data:', foundation);
        localStorage.setItem('foundationInfo', JSON.stringify(foundation));
      } else {
        console.log('Foundation not found, status:', foundationResponse.status);
        const errorText = await foundationResponse.text();
        console.log('Foundation error response:', errorText);
        setError('Fundación no encontrada. Complete su configuración.');
        setLoading(false);
        return;
      }

      // 2. Fetch opportunities
      console.log('Fetching opportunities for foundation:', foundation.id);
      const opportunitiesResponse = await fetch(`http://localhost:3001/api/opportunities/foundation/${foundation.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let opportunities = [];
      if (opportunitiesResponse.ok) {
        opportunities = await opportunitiesResponse.json();
        console.log('Opportunities count:', opportunities.length);
      } else if (opportunitiesResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      // 3. Fetch donations with user names
      console.log('Fetching donations for foundation:', foundation.id);
      const donationsResponse = await fetch(`http://localhost:3001/api/donations/foundation/${foundation.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      let donations = [];
      if (donationsResponse.ok) {
        donations = await donationsResponse.json();
        console.log('Donations count:', donations.length);
      } else if (donationsResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      // 4. Fetch pending applications for each opportunity
      console.log('Fetching pending applications...');
      let pendingApplications = [];
      try {
        for (const opportunity of opportunities) {
          const applicationsResponse = await fetch(
            `http://localhost:3001/api/participation-requests/social-action/${opportunity.id}/pending`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          if (applicationsResponse.ok) {
            const applications = await applicationsResponse.json();
            pendingApplications.push(...applications.map(app => ({
              ...app,
              opportunity: opportunity
            })));
          } else if (applicationsResponse.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            navigate('/login');
            return;
          }
        }
        console.log('Pending applications count:', pendingApplications.length);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }

      // 5. Calculate stats
      const totalDonations = donations.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0);
      const activeOpportunities = opportunities.filter(opp => 
        new Date(opp.end_date) > new Date()
      ).length;

      console.log('Setting dashboard data...');
      setDashboardData({
        foundation,
        stats: {
          totalOpportunities: opportunities.length,
          activeOpportunities,
          totalDonations,
          pendingApplications: pendingApplications.length,
          totalNotifications: 0   // Simplificado por ahora
        },
        recentOpportunities: opportunities.slice(0, 3),
        pendingApplications: pendingApplications,
        recentDonations: donations.slice(0, 10),
        notifications: []
      });

      console.log('Dashboard data set successfully');
      setLoading(false);

    } catch (err) {
      console.error('Error in fetchDashboardData:', err);
      setError(`Error cargando dashboard: ${err.message}`);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    console.log('FoundationDashboard: useEffect triggered');
    
    // Verificar token y userData inmediatamente
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    console.log('Token exists:', !!token);
    console.log('UserData exists:', !!userData);
    
    if (!token || !userData) {
      console.log('No token/userData, redirecting to login');
      navigate('/login');
      return;
    }

    let userObj;
    try {
      userObj = JSON.parse(userData);
      console.log('Parsed user:', userObj);
    } catch (err) {
      console.error('Error parsing userData:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/login');
      return;
    }

    if (userObj.user_type !== 'foundation') {
      console.log('User is not foundation type:', userObj.user_type);
      setError('Acceso denegado: Solo fundaciones pueden acceder al dashboard');
      setLoading(false);
      return;
    }

    console.log('Starting fetchDashboardData...');
    fetchDashboardData(token, userObj);
  }, [navigate, fetchDashboardData]); // Added dependencies

  const handleApplicationAction = (application, action) => {
    setSelectedApplication(application);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmApplicationAction = async () => {
    if (!selectedApplication) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/participation-requests/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: actionType === 'accept' ? 'accepted' : 'rejected' })
      });

      if (response.ok) {
        // Actualizar la lista localmente
        setDashboardData(prev => ({
          ...prev,
          pendingApplications: prev.pendingApplications.filter(app => app.id !== selectedApplication.id),
          stats: {
            ...prev.stats,
            pendingApplications: prev.stats.pendingApplications - 1
          }
        }));
        setShowActionModal(false);
        setSelectedApplication(null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
      } else {
        throw new Error('Error al procesar solicitud');
      }
    } catch (err) {
      console.error('Error processing application:', err);
      alert('Error al procesar la solicitud');
    }
  };

  if (loading) {
    console.log('Rendering loading spinner...');
    return <LoadingSpinner />;
  }
  
  if (error) {
    console.log('Rendering error:', error);
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="alert alert-danger">
            <h3>Error</h3>
            <p>{error}</p>
            <Button as={Link} to="/foundation/setup" variant="primary">
              Configurar Fundación
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  console.log('Rendering dashboard...');
  return (
    <Container className="py-5">
      {/* Header - Sin botón de configuración */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Dashboard de Fundación</h1>
              <p className="text-muted">
                Bienvenido, {dashboardData.foundation?.legal_name || 'Fundación'}
              </p>
            </div>
            <div>
              <Button as={Link} to="/opportunities/create" variant="primary">
                <i className="fas fa-plus me-1"></i>
                Crear Oportunidad
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <StatsCard
            title="Total Oportunidades"
            value={dashboardData.stats.totalOpportunities || 0}
            icon="fas fa-hands-helping"
            variant="primary"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Oportunidades Activas"
            value={dashboardData.stats.activeOpportunities || 0}
            icon="fas fa-calendar-check"
            variant="success"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Total Donaciones"
            value={`$${(dashboardData.stats.totalDonations || 0).toLocaleString()}`}
            icon="fas fa-donate"
            variant="warning"
          />
        </Col>
        <Col md={3}>
          <StatsCard
            title="Solicitudes Pendientes"
            value={dashboardData.stats.pendingApplications || 0}
            icon="fas fa-file-alt"
            variant="info"
          />
        </Col>
      </Row>

      {/* Content Tabs */}
      <Row>
        <Col>
          <Tabs defaultActiveKey="overview" className="mb-3">
            <Tab eventKey="overview" title="Resumen">
              <Row>
                {/* Recent Opportunities */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Oportunidades Recientes</h5>
                    </Card.Header>
                    <Card.Body>
                      {dashboardData.recentOpportunities.length === 0 ? (
                        <div className="text-center py-3">
                          <i className="fas fa-hands-helping fa-2x text-muted mb-2"></i>
                          <p className="text-muted">No hay oportunidades aún</p>
                          <Button as={Link} to="/opportunities/create" variant="primary" size="sm">
                            Crear Primera Oportunidad
                          </Button>
                        </div>
                      ) : (
                        dashboardData.recentOpportunities.map(opportunity => (
                          <div key={opportunity.id} className="border-bottom pb-2 mb-2 last:border-b-0">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-1">
                                  <Link to={`/opportunities/${opportunity.id}`} className="text-decoration-none">
                                    {opportunity.description?.substring(0, 50)}...
                                  </Link>
                                </h6>
                                <small className="text-muted">
                                  {new Date(opportunity.start_date).toLocaleDateString()} - {new Date(opportunity.end_date).toLocaleDateString()}
                                </small>
                              </div>
                              <Badge bg={new Date(opportunity.end_date) > new Date() ? 'success' : 'secondary'}>
                                {new Date(opportunity.end_date) > new Date() ? 'Activa' : 'Finalizada'}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* Recent Donations - Mostrar nombre en lugar de fecha */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header>
                      <h5 className="mb-0">Donaciones Recientes</h5>
                    </Card.Header>
                    <Card.Body>
                      {dashboardData.recentDonations.length === 0 ? (
                        <div className="text-center py-3">
                          <i className="fas fa-donate fa-2x text-muted mb-2"></i>
                          <p className="text-muted">No hay donaciones aún</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Monto</th>
                                <th>Donador</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dashboardData.recentDonations.map(donation => (
                                <tr key={donation.id}>
                                  <td>${parseFloat(donation.amount || 0).toLocaleString()}</td>
                                  <td>{donation.user?.name || 'Anónimo'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>

            {/* Nueva pestaña: Todas mis acciones sociales */}
            <Tab eventKey="all-opportunities" title="Todas mis Acciones Sociales">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Mis Acciones Sociales ({dashboardData.stats.totalOpportunities})</h5>
                </Card.Header>
                <Card.Body>
                  {dashboardData.recentOpportunities.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                      <h5>No has creado acciones sociales aún</h5>
                      <p className="text-muted">Crea tu primera acción social para comenzar a conectar con voluntarios</p>
                      <Button as={Link} to="/opportunities/create" variant="primary">
                        <i className="fas fa-plus me-2"></i>
                        Crear Primera Acción Social
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Fechas</th>
                            <th>Estado</th>
                            <th>Participantes</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Mostrar todas las oportunidades, no solo las recientes */}
                          {(dashboardData.recentOpportunities.length > 3 ? 
                            dashboardData.allOpportunities || dashboardData.recentOpportunities : 
                            dashboardData.recentOpportunities
                          ).map(opportunity => {
                            const isActive = new Date(opportunity.end_date) > new Date();
                            const participants = dashboardData.pendingApplications.filter(
                              app => app.opportunity?.id === opportunity.id
                            ).length;
                            
                            return (
                              <tr key={opportunity.id}>
                                <td>
                                  <div>
                                    <strong>
                                      <Link to={`/opportunities/${opportunity.id}`} className="text-decoration-none">
                                        {opportunity.description?.substring(0, 60)}...
                                      </Link>
                                    </strong>
                                  </div>
                                </td>
                                <td>
                                  <small>
                                    <strong>Inicio:</strong> {new Date(opportunity.start_date).toLocaleDateString()}<br/>
                                    <strong>Fin:</strong> {new Date(opportunity.end_date).toLocaleDateString()}
                                  </small>
                                </td>
                                <td>
                                  <Badge bg={isActive ? 'success' : 'secondary'}>
                                    {isActive ? 'Activa' : 'Finalizada'}
                                  </Badge>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {participants} solicitudes
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group">
                                    <Button
                                      as={Link}
                                      to={`/opportunities/${opportunity.id}`}
                                      variant="outline-primary"
                                      size="sm"
                                    >
                                      <i className="fas fa-eye me-1"></i>
                                      Ver
                                    </Button>
                                    
                                    {participants > 0 && (
                                      <Button
                                        as={Link}
                                        to={`/opportunities/${opportunity.id}/participants`}
                                        variant="outline-success"
                                        size="sm"
                                      >
                                        <i className="fas fa-users me-1"></i>
                                        Gestionar
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* Nueva pestaña para gestionar solicitudes */}
            <Tab eventKey="applications" title={`Solicitudes (${dashboardData.pendingApplications.length})`}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Solicitudes Pendientes de Aprobación</h5>
                </Card.Header>
                <Card.Body>
                  {dashboardData.pendingApplications.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <h5>No hay solicitudes pendientes</h5>
                      <p className="text-muted">Todas las solicitudes han sido procesadas</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Voluntario</th>
                            <th>Oportunidad</th>
                            <th>Fecha de Solicitud</th>
                            <th>Mensaje</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.pendingApplications.map(application => (
                            <tr key={application.id}>
                              <td>
                                <div>
                                  <strong>{application.user?.name || 'Usuario'}</strong>
                                  <br />
                                  <small className="text-muted">{application.user?.email}</small>
                                </div>
                              </td>
                              <td>
                                <Link to={`/opportunities/${application.opportunity?.id}`} className="text-decoration-none">
                                  {application.opportunity?.description?.substring(0, 40)}...
                                </Link>
                              </td>
                              <td>{new Date(application.request_date).toLocaleDateString()}</td>
                              <td>
                                {application.message ? (
                                  <span className="text-truncate" style={{ maxWidth: '200px', display: 'inline-block' }}>
                                    {application.message}
                                  </span>
                                ) : (
                                  <em className="text-muted">Sin mensaje</em>
                                )}
                              </td>
                              <td>
                                <div className="btn-group">
                                  <Button
                                    data-cy="accept-application-btn"
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleApplicationAction(application, 'accept')}
                                  >
                                    <i className="fas fa-check me-1"></i>
                                    Aceptar
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleApplicationAction(application, 'reject')}
                                  >
                                    <i className="fas fa-times me-1"></i>
                                    Rechazar
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Modal de confirmación para acciones */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'accept' ? 'Aceptar Solicitud' : 'Rechazar Solicitud'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que quieres{' '}
            <strong>{actionType === 'accept' ? 'aceptar' : 'rechazar'}</strong>{' '}
            la solicitud de <strong>{selectedApplication?.user?.name}</strong>?
          </p>
          {selectedApplication?.opportunity && (
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">Oportunidad:</small>
              <p className="mb-0">{selectedApplication.opportunity.description?.substring(0, 100)}...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant={actionType === 'accept' ? 'success' : 'danger'}
            onClick={confirmApplicationAction}
          >
            {actionType === 'accept' ? 'Aceptar' : 'Rechazar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FoundationDashboard;