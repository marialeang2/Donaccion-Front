import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import OpportunityCard from '../components/OpportunityCard';
import CommentSection from '../components/CommentSection';
import FavoriteButton from '../components/FavoriteButton';
import StatsCard from '../components/StatsCard';
import { getConsistentImage } from '../utils/ImageUtils';

const FoundationDetail = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [foundation, setFoundation] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${amount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const fetchFoundationData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch foundation details
      const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${id}`);
      if (!foundationResponse.ok) {
        throw new Error(t('foundation.notFound'));
      }
      const foundationData = await foundationResponse.json();
      setFoundation(foundationData);

      // Initialize opportunities data
      let opportunitiesData = [];

      // Fetch foundation's opportunities
      const opportunitiesResponse = await fetch(`http://localhost:3001/api/opportunities/foundation/${id}`);
      if (opportunitiesResponse.ok) {
        opportunitiesData = await opportunitiesResponse.json();
        setOpportunities(opportunitiesData);
      }

      // Fetch donations received (only if user has access)
      let donationsData = [];
      if (user) {
        const token = localStorage.getItem('token');
        const donationsResponse = await fetch(`http://localhost:3001/api/donations/foundation/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (donationsResponse.ok) {
          donationsData = await donationsResponse.json();
          setDonations(donationsData);
        }
      }

      // Calculate stats - Fix: Ensure donation amounts are parsed as numbers
      const totalDonations = donationsData.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0);
      const activeOpportunities = opportunitiesData.filter(opp => 
        new Date(opp.end_date) > new Date()
      ).length;

      setStats({
        totalOpportunities: opportunitiesData.length,
        activeOpportunities,
        totalDonations
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, t, user]);

  useEffect(() => {
    fetchFoundationData();
  }, [fetchFoundationData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchFoundationData} />;
  if (!foundation) return <ErrorMessage error={t('foundation.notFound')} />;

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="position-relative">
            <div 
              className="bg-primary rounded-3 p-5 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${foundation.banner_image || getConsistentImage('foundations', foundation.id)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Row className="align-items-center">
                <Col md={2}>
                  <img
                    src={foundation.image_url || getConsistentImage('foundations', foundation.id)}
                    alt={foundation.legal_name}
                    className="rounded-circle border border-3 border-white"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover' }}
                  />
                </Col>
                <Col md={6}>
                  <h1 className="fw-bold">{foundation.legal_name}</h1>
                  <p className="lead mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {foundation.address}
                  </p>
                  <div className="d-flex gap-3">
                    {foundation.phone && (
                      <span>
                        <i className="fas fa-phone me-1"></i>
                        {foundation.phone}
                      </span>
                    )}
                    {foundation.website && (
                      <a href={foundation.website} target="_blank" rel="noopener noreferrer" className="text-white">
                        <i className="fas fa-globe me-1"></i>
                        {t('foundation.website')}
                      </a>
                    )}
                  </div>
                </Col>

                <Col md={4} className="text-end">
                  {user && (
                    <div className="d-flex gap-3 justify-content-end align-items-center">
                      <FavoriteButton 
                        item={foundation}
                        itemType="foundation"
                        user={user}
                      />
                      <Button 
                        as={Link} 
                        to={`/donate/${foundation.id}`} 
                        variant="success" 
                        size="lg"
                        className="px-4"
                      >
                        <i className="fas fa-heart me-2"></i>
                        {t('foundation.donate')}
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <StatsCard
            title={t('foundation.totalOpportunities')}
            value={stats.totalOpportunities}
            icon="fas fa-hands-helping"
            variant="primary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title={t('foundation.activeOpportunities')}
            value={stats.activeOpportunities}
            icon="fas fa-calendar-check"
            variant="success"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title={t('foundation.totalDonations')}
            value={formatCurrency(stats.totalDonations || 0)}
            icon="fas fa-donate"
            variant="warning"
          />
        </Col>
      </Row>

      {/* Content Tabs */}
      <Row>
        <Col>
          <Tabs defaultActiveKey="about" className="mb-3">
            <Tab eventKey="about" title={t('foundation.about')}>
              <Card>
                <Card.Body>
                  <h5>{t('foundation.aboutTitle')}</h5>
                  <p>{foundation.description || t('foundation.noDescription')}</p>
                  
                  <h5 className="mt-4">{t('foundation.contactInfo')}</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>{t('foundation.legalName')}:</strong> {foundation.legal_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>{t('foundation.address')}:</strong> {foundation.address}
                    </ListGroup.Item>
                    {foundation.phone && (
                      <ListGroup.Item>
                        <strong>{t('foundation.phone')}:</strong> {foundation.phone}
                      </ListGroup.Item>
                    )}
                    {foundation.website && (
                      <ListGroup.Item>
                        <strong>{t('foundation.website')}:</strong>{' '}
                        <a href={foundation.website} target="_blank" rel="noopener noreferrer">
                          {foundation.website}
                        </a>
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="opportunities" title={t('foundation.opportunities')}>
              {opportunities.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                    <h5>{t('foundation.noOpportunities')}</h5>
                    <p className="text-muted">{t('foundation.noOpportunitiesDescription')}</p>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {opportunities.map((opportunity) => (
                    <Col md={4} key={opportunity.id} className="mb-4">
                      <OpportunityCard 
                        opportunity={{
                          ...opportunity,
                          foundation: foundation
                        }} 
                        user={user} 
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Tab>

            <Tab eventKey="reviews" title={t('foundation.reviews')}>
              <CommentSection
                itemId={foundation.id}
                itemType="foundation"
                user={user}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default FoundationDetail;