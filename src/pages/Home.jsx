import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FoundationCard from '../components/FoundationCard';
import OpportunityCard from '../components/OpportunityCard';

const Home = ({ user }) => {
  const { t } = useTranslation();
  const [featuredFoundations, setFeaturedFoundations] = useState([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [stats, setStats] = useState({
    totalFoundations: 0,
    totalOpportunities: 0,
    totalDonations: 0,
    activeVolunteers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured foundations
      const foundationsResponse = await fetch('http://localhost:3001/api/foundations');
      if (foundationsResponse.ok) {
        const foundationsData = await foundationsResponse.json();
        setFeaturedFoundations(foundationsData.slice(0, 3));
        setStats(prev => ({ ...prev, totalFoundations: foundationsData.length }));
      }

      // Fetch featured opportunities (active ones)
      const opportunitiesResponse = await fetch('http://localhost:3001/api/opportunities/active');
      if (opportunitiesResponse.ok) {
        const opportunitiesData = await opportunitiesResponse.json();
        // Add foundation info to opportunities
        const enrichedOpportunities = await Promise.all(
          opportunitiesData.slice(0, 3).map(async (opp) => {
            try {
              const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${opp.foundation_id}`);
              if (foundationResponse.ok) {
                opp.foundation = await foundationResponse.json();
              }
              return opp;
            } catch (err) {
              console.error('Error fetching foundation for opportunity:', err);
              return opp;
            }
          })
        );
        setFeaturedOpportunities(enrichedOpportunities);
      }

      // Get total opportunities count
      const allOpportunitiesResponse = await fetch('http://localhost:3001/api/opportunities');
      if (allOpportunitiesResponse.ok) {
        const allOpportunities = await allOpportunitiesResponse.json();
        setStats(prev => ({ ...prev, totalOpportunities: allOpportunities.length }));
      }

      // Set static values for demonstration (since reports endpoint requires auth)
      setStats(prev => ({
        ...prev,
        totalDonations: 150000, // Static demo value
        activeVolunteers: 250    // Static demo value
      }));

    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning text-center m-4">
        <h4>{t('common.error')}</h4>
        <p>{error}</p>
        <Button onClick={fetchHomeData} variant="primary">
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-white d-flex align-items-center" style={{
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)',
  paddingTop: '4rem',
  paddingBottom: '4rem'
}}>
  <Container className="text-center">
    <div className="mb-4">
      <span className="badge bg-light text-dark px-4 py-2 rounded-pill fs-6 fw-normal">
        {t('home.leadingVolunteerPlatform')}
      </span>
    </div>

    <h1 className="display-3 fw-bold mb-4 text-shadow">
      {t('home.heroTitle')}
      <span className="d-block text-warning">{t('home.solidarity')}</span>
    </h1>

    <p className="lead fs-3 mb-5 opacity-90 mx-auto" style={{ maxWidth: '600px' }}>
      {t('home.heroSubtitle')}
    </p>

    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
      <Button
        as={Link}
        to="/opportunities"
        size="lg"
        className="px-5 py-3 fw-semibold"
        style={{
          background: 'linear-gradient(135deg, #0d6efd, #0b5ed7)',
          border: 'none',
          borderRadius: '50px',
          boxShadow: '0 8px 30px rgba(13, 110, 253, 0.3)'
        }}
      >
        <i className="fas fa-search me-2"></i>
        {t('home.findOpportunities')}
      </Button>
      <Button
        as={Link}
        to="/foundations"
        data-cy="discover-foundations-btn"
        size="lg"
        variant="outline-light"
        className="px-5 py-3 fw-semibold"
        style={{
          borderRadius: '50px',
          borderWidth: '2px'
        }}
      >
        <i className="fas fa-heart me-2"></i>
        {t('home.discoverFoundations')}
      </Button>
    </div>

    <Row className="text-center g-4">
      <Col xs={12} md={6}>
        <div>
          <div className="display-6 fw-bold text-warning">{stats.totalFoundations}+</div>
          <div className="text-light opacity-75">{t('home.foundations')}</div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div>
          <div className="display-6 fw-bold text-success">{stats.totalOpportunities}+</div>
          <div className="text-light opacity-75">{t('home.opportunities')}</div>
        </div>
      </Col>
      
    </Row>
  </Container>
</section>


      {/* Featured Foundations */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="mb-5">
            <Col md={8}>
              <h2 className="fw-bold">{t('home.featuredFoundations')}</h2>
              <p className="text-muted">{t('home.foundationsDescription')}</p>
            </Col>
            <Col md={4} className="text-end">
              <Button as={Link} to="/foundations" variant="outline-primary">
                {t('common.viewAll')} <i className="fas fa-arrow-right ms-1"></i>
              </Button>
            </Col>
          </Row>
          <Row>
            {featuredFoundations.length === 0 ? (
              <Col>
                <div className="text-center py-4">
                  <i className="fas fa-building fa-3x text-muted mb-3"></i>
                  <p className="text-muted">{t('home.noFoundations')}</p>
                </div>
              </Col>
            ) : (
              featuredFoundations.map((foundation) => (
                <Col md={4} key={foundation.id} className="mb-4">
                  <FoundationCard foundation={foundation} user={user} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* Featured Opportunities */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col md={8}>
              <h2 className="fw-bold">{t('home.activeOpportunities')}</h2>
              <p className="text-muted">{t('home.opportunitiesDescription')}</p>
            </Col>
            <Col md={4} className="text-end">
              <Button as={Link} to="/opportunities" variant="outline-primary">
                {t('home.viewAll')} <i className="fas fa-arrow-right ms-1"></i>
              </Button>
            </Col>
          </Row>
          <Row>
            {featuredOpportunities.length === 0 ? (
              <Col>
                <div className="text-center py-4">
                  <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                  <p className="text-muted">{t('home.noOpportunities')}</p>
                </div>
              </Col>
            ) : (
              featuredOpportunities.map((opportunity) => (
                <Col md={4} key={opportunity.id} className="mb-4">
                  <OpportunityCard opportunity={opportunity} user={user} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold mb-4">{t('home.ctaTitle')}</h2>
              <p className="lead mb-4">{t('home.ctaDescription')}</p>
              {!user && (
                <Button as={Link} to="/register" variant="light" size="lg">
                  {t('home.joinToday')}
                </Button>
              )}
              {user && user.user_type === 'user' && (
                <Button as={Link} to="/opportunities" variant="light" size="lg">
                  {t('home.startHelping')}
                </Button>
              )}
              {user && user.user_type === 'foundation' && (
                <Button as={Link} to="/opportunities/create" variant="light" size="lg">
                  {t('home.createOpportunity')}
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(13, 110, 253, 0.4) !important;
        }
        
        .btn-outline-light:hover {
          transform: translateY(-3px);
          background-color: white;
          color: #0d6efd;
          border-color: white;
        }
        
        .hero-stat {
          transition: transform 0.3s ease;
        }
        
        .hero-stat:hover {
          transform: scale(1.1);
        }
        
        .z-index-2 {
          z-index: 2;
        }
      `}</style>
    </>
  );
};

export default Home;