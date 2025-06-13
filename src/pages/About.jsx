import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'fas fa-hands-helping',
      title: t('about.features.connect.title'),
      description: t('about.features.connect.description')
    },
    {
      icon: 'fas fa-donate',
      title: t('about.features.donate.title'),
      description: t('about.features.donate.description')
    },
    {
      icon: 'fas fa-certificate',
      title: t('about.features.certificates.title'),
      description: t('about.features.certificates.description')
    },
    {
      icon: 'fas fa-chart-line',
      title: t('about.features.transparency.title'),
      description: t('about.features.transparency.description')
    }
  ];

  const team = [
    {
      name: 'Marco Ramirez',
      role: t('about.team.founder'),
      image: '/images/marco.png',
      description: t('about.team.marco.description')
    },
    {
      name: 'Alejandra Angulo',
      role: t('about.team.founder1'),
      image: '/images/alejandra.jpeg',
      description: t('about.team.alejandra.description')
    },
    {
      name: 'Juan Diego Lozano',
      role: t('about.team.founder'),
      image: '/images/lozano.jpeg',
      description: t('about.team.juandiego.description')
    },
    {
      name: 'Laura Murcia',
      role: t('about.team.founder1'),
      image: '/images/laura.jpeg',
      description: t('about.team.laura.description')
    },
    {
      name: 'Francois Morales',
      role: t('about.team.founder'),
      image: '/images/francois.jpeg',
      description: t('about.team.francois.description')
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold">{t('about.hero.title')}</h1>
              <p className="lead">{t('about.hero.subtitle')}</p>
              <Button as={Link} to="/register" variant="light" size="lg">
                {t('about.hero.cta')}
              </Button>
            </Col>
            <Col lg={6}>
              <img 
                src="/images/Sobre-noosotro-1.jpg" 
                alt={t('about.hero.imageAlt')}
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-5">
                  <div className="text-primary mb-4">
                    <i className="fas fa-bullseye fa-3x"></i>
                  </div>
                  <h3>{t('about.mission.title')}</h3>
                  <p className="text-muted">{t('about.mission.description')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-5">
                  <div className="text-success mb-4">
                    <i className="fas fa-eye fa-3x"></i>
                  </div>
                  <h3>{t('about.vision.title')}</h3>
                  <p className="text-muted">{t('about.vision.description')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2>{t('about.features.title')}</h2>
              <p className="text-muted">{t('about.features.subtitle')}</p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm text-center">
                  <Card.Body className="p-4">
                    <div className="text-primary mb-3">
                      <i className={`${feature.icon} fa-2x`}></i>
                    </div>
                    <h5>{feature.title}</h5>
                    <p className="text-muted small">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Statistics */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col lg={3} md={6} className="mb-4">
              <div className="border-0">
                <h2 className="text-primary fw-bold">1000+</h2>
                <p className="text-muted">{t('about.stats.users')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="border-0">
                <h2 className="text-success fw-bold">50+</h2>
                <p className="text-muted">{t('about.stats.foundations')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="border-0">
                <h2 className="text-warning fw-bold">200+</h2>
                <p className="text-muted">{t('about.stats.opportunities')}</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="border-0">
                <h2 className="text-info fw-bold">$100k+</h2>
                <p className="text-muted">{t('about.stats.donated')}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team */}
      <section className="py-5 bg-light">
        <Container>
          <Row >
            <Col lg={12} className="text-center mb-5">
              <h2>{t('about.team.title')}</h2>
              <p className="text-muted">{t('about.team.subtitle')}</p>
            </Col>
          </Row>
          <Row className= "justify-content-center">
            {team.map((member, index) => (
              <Col lg={4} md={6} className="mb-4" key={index}>
                <Card className="h-100 border-0 shadow-sm text-center">
                  <Card.Body className="p-4">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h5>{member.name}</h5>
                    <p className="text-primary small fw-bold">{member.role}</p>
                    <p className="text-muted small">{member.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h2>{t('about.cta.title')}</h2>
              <p className="lead">{t('about.cta.subtitle')}</p>
              <div className="d-flex justify-content-center gap-3">
                <Button as={Link} to="/register" variant="light" size="lg">
                  {t('about.cta.join')}
                </Button>
                <Button as={Link} to="/foundations" variant="outline-light" size="lg">
                  {t('about.cta.explore')}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;