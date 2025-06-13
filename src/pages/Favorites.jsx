import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import FoundationCard from '../components/FoundationCard';
import OpportunityCard from '../components/OpportunityCard';
import { useTranslation } from 'react-i18next';

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState({
    foundations: [],
    opportunities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
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
      const response = await fetch(`http://localhost:3001/api/users/${userObj.id}/favorites`, {
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
        throw new Error('Error al obtener favoritos');
      }

      const data = await response.json();
      
      // Separar favoritos por tipo y obtener detalles completos
      const foundationFavorites = data.filter(fav => fav.item_type === 'foundation');
      const opportunityFavorites = data.filter(fav => fav.item_type === 'opportunity');

      // Obtener detalles de fundaciones
      const foundationDetails = await Promise.all(
        foundationFavorites.map(async (fav) => {
          try {
            const response = await fetch(`http://localhost:3001/api/foundations/${fav.item_id}`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (err) {
            console.error('Error fetching foundation:', err);
            return null;
          }
        })
      );

      // Obtener detalles de oportunidades
      const opportunityDetails = await Promise.all(
        opportunityFavorites.map(async (fav) => {
          try {
            const response = await fetch(`http://localhost:3001/api/opportunities/${fav.item_id}`);
            if (response.ok) {
              const opportunity = await response.json();
              
              // Obtener fundación para la oportunidad
              const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${opportunity.foundation_id}`);
              if (foundationResponse.ok) {
                opportunity.foundation = await foundationResponse.json();
              }
              
              // Obtener rating
              const ratingResponse = await fetch(`http://localhost:3001/api/ratings/opportunity/${opportunity.id}/average`);
              if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                opportunity.averageRating = ratingData.average_rating || 0;
              }
              
              return opportunity;
            }
            return null;
          } catch (err) {
            console.error('Error fetching opportunity:', err);
            return null;
          }
        })
      );

      setFavorites({
        foundations: foundationDetails.filter(f => f !== null),
        opportunities: opportunityDetails.filter(o => o !== null)
      });

    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
            <p className="text-muted">{t('favorites.loginRequired')}</p>
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
  if (error) return <ErrorMessage error={error} onRetry={fetchFavorites} />;

  const totalFavorites = favorites.foundations.length + favorites.opportunities.length;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">{t('favorites.title')}</h1>
          <p className="text-muted">
            {t('favorites.subtitle', { count: totalFavorites })}
          </p>
        </Col>
      </Row>

      {totalFavorites === 0 ? (
        <Row>
          <Col>
            <Card>
              <Card.Body className="text-center py-5">
                <i className="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5>{t('favorites.noFavorites')}</h5>
                <p className="text-muted">{t('favorites.noFavoritesDescription')}</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Button as={Link} to="/foundations" variant="primary">
                    {t('favorites.exploreFoundations')}
                  </Button>
                  <Button as={Link} to="/opportunities" variant="outline-primary">
                    {t('favorites.exploreOpportunities')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Tabs defaultActiveKey="all" className="mb-3">
              <Tab eventKey="all" title={`Todos (${totalFavorites})`}>
                <Row>
                  {/* Fundaciones */}
                  {favorites.foundations.length > 0 && (
                    <Col xs={12}>
                      <h5 className="mb-3">Fundaciones ({favorites.foundations.length})</h5>
                    </Col>
                  )}
                  {favorites.foundations.map(foundation => (
                    <Col lg={4} md={6} key={foundation.id} className="mb-4">
                      <FoundationCard foundation={foundation} user={user} />
                    </Col>
                  ))}
                  
                  {/* Oportunidades */}
                  {favorites.opportunities.length > 0 && (
                    <Col xs={12}>
                      <h5 className="mb-3 mt-4">Oportunidades ({favorites.opportunities.length})</h5>
                    </Col>
                  )}
                  {favorites.opportunities.map(opportunity => (
                    <Col lg={4} md={6} key={opportunity.id} className="mb-4">
                      <OpportunityCard opportunity={opportunity} user={user} />
                    </Col>
                  ))}
                </Row>
              </Tab>

              <Tab eventKey="foundations" title={`Fundaciones (${favorites.foundations.length})`}>
                {favorites.foundations.length === 0 ? (
                  <Card>
                    <Card.Body className="text-center py-5">
                      <i className="fas fa-building fa-3x text-muted mb-3"></i>
                      <h5>No hay fundaciones favoritas</h5>
                      <p className="text-muted">Agrega fundaciones a favoritos para verlas aquí</p>
                      <Button as={Link} to="/foundations" variant="primary">
                        Explorar Fundaciones
                      </Button>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {favorites.foundations.map(foundation => (
                      <Col lg={4} md={6} key={foundation.id} className="mb-4">
                        <FoundationCard foundation={foundation} user={user} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>

              <Tab eventKey="opportunities" title={`Oportunidades (${favorites.opportunities.length})`}>
                {favorites.opportunities.length === 0 ? (
                  <Card>
                    <Card.Body className="text-center py-5">
                      <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                      <h5>No hay oportunidades favoritas</h5>
                      <p className="text-muted">Agrega oportunidades a favoritos para verlas aquí</p>
                      <Button as={Link} to="/opportunities" variant="primary">
                        Explorar Oportunidades
                      </Button>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {favorites.opportunities.map(opportunity => (
                      <Col lg={4} md={6} key={opportunity.id} className="mb-4">
                        <OpportunityCard opportunity={opportunity} user={user} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Favorites;