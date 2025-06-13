import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DonationCard from '../components/DonationCard';
import CertificateCard from '../components/CertificateCard';
import OpportunityCard from '../components/OpportunityCard';

const Profile = ({ currentUser }) => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeParticipations, setActiveParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const isOwnProfile = currentUser && (currentUser.id === userId || !userId);

  const fetchUserData = useCallback(async (targetUserId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user info
      const userResponse = await fetch(`http://localhost:3001/api/users/${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error(t('profile.userNotFound'));
      }

      const userData = await userResponse.json();
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email
      });

      // Fetch donations if own profile
      if (isOwnProfile) {
        const donationsResponse = await fetch(`http://localhost:3001/api/donations/user/${targetUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json();
          setDonations(donationsData);
        }

        // Fetch participations
        const participationsResponse = await fetch(`http://localhost:3001/api/participation-requests/user/${targetUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (participationsResponse.ok) {
          const participationsData = await participationsResponse.json();
          setParticipations(participationsData);
        }

        // Fetch certificates
        const certificatesResponse = await fetch(`http://localhost:3001/api/certificates/user/${targetUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (certificatesResponse.ok) {
          const certificatesData = await certificatesResponse.json();
          setCertificates(certificatesData);
        }
      } else if (userData.user_type === 'user') {
        // Fetch active participations for public profile - ONLY for regular users, not foundations
        await fetchActiveParticipations(targetUserId, token);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [t, isOwnProfile]);

  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      navigate('/login');
      return;
    }
    fetchUserData(targetUserId);
  }, [userId, currentUser, navigate, fetchUserData]);

  const fetchActiveParticipations = async (targetUserId, token) => {
    try {
      // Fetch user's participations
      const participationsResponse = await fetch(`http://localhost:3001/api/participation-requests/user/${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!participationsResponse.ok) return;

      const participationsData = await participationsResponse.json();
      
      // Filter only accepted participations
      const acceptedParticipations = participationsData.filter(p => p.status === 'accepted');

      // Enrich with opportunity details and filter active ones
      const enrichedParticipations = await Promise.all(
        acceptedParticipations.map(async (participation) => {
          try {
            // Get opportunity details
            const opportunityResponse = await fetch(`http://localhost:3001/api/opportunities/${participation.social_action_id}`);
            if (!opportunityResponse.ok) return null;

            const opportunity = await opportunityResponse.json();
            
            // Check if opportunity is active (current date is between start and end dates)
            const now = new Date();
            const startDate = new Date(opportunity.start_date);
            const endDate = new Date(opportunity.end_date);
            
            if (now < startDate || now > endDate) return null; // Not active

            // Get foundation details
            const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${opportunity.foundation_id}`);
            if (foundationResponse.ok) {
              opportunity.foundation = await foundationResponse.json();
            }

            // Get average rating
            const ratingResponse = await fetch(`http://localhost:3001/api/ratings/opportunity/${opportunity.id}/average`);
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              opportunity.averageRating = ratingData.average_rating || 0;
            }

            return {
              ...participation,
              opportunity
            };
          } catch (err) {
            console.error('Error enriching participation:', err);
            return null;
          }
        })
      );

      // Filter out null values and set active participations
      const activeOnes = enrichedParticipations.filter(p => p !== null);
      setActiveParticipations(activeOnes);
    } catch (err) {
      console.error('Error fetching active participations:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(t('profile.updateError'));
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      
      // Update localStorage if own profile
      if (isOwnProfile) {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={() => fetchUserData(userId || currentUser.id)} />;
  if (!user) return <ErrorMessage error={t('profile.userNotFound')} />;

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <Card className="shadow">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img
                  src="/images/default-profile.png"
                  alt="Profile"
                  className="rounded-circle"
                  width="120"
                  height="120"
                />
              </div>
              
              {isEditing ? (
                <Form onSubmit={handleSaveProfile}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="sm">
                      {t('common.save')}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <h4>{user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                  <p className="text-muted small">
                    {t('profile.memberSince')} {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  
                  {isOwnProfile && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      {t('profile.editProfile')}
                    </Button>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {isOwnProfile ? (
            <Tabs defaultActiveKey="donations" className="mb-3">
              <Tab eventKey="donations" title={t('profile.donations')}>
                <div>
                  {donations.length === 0 ? (
                    <Card>
                      <Card.Body className="text-center">
                        <i className="fas fa-donate fa-3x text-muted mb-3"></i>
                        <h5>{t('profile.noDonations')}</h5>
                        <p className="text-muted">{t('profile.startDonating')}</p>
                        <Button as="a" href="/foundations" variant="primary">
                          {t('profile.findFoundations')}
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
                </div>
              </Tab>

              <Tab eventKey="participations" title={t('profile.participations')}>
                <div>
                  {participations.length === 0 ? (
                    <Card>
                      <Card.Body className="text-center">
                        <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                        <h5>{t('profile.noParticipations')}</h5>
                        <p className="text-muted">{t('profile.startVolunteering')}</p>
                        <Button as="a" href="/opportunities" variant="primary">
                          {t('profile.findOpportunities')}
                        </Button>
                      </Card.Body>
                    </Card>
                  ) : (
                    participations.map(participation => (
                      <Card key={participation.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6>{participation.social_action?.description || t('profile.opportunity')}</h6>
                              <p className="text-muted small">
                                {t('profile.appliedOn')} {new Date(participation.request_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className={`badge bg-${
                                participation.status === 'accepted' ? 'success' :
                                participation.status === 'rejected' ? 'danger' : 'warning'
                              }`}>
                                {t(`participations.${participation.status}`)}
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </div>
              </Tab>

              <Tab eventKey="certificates" title={t('profile.certificates')}>
                <div>
                  {certificates.length === 0 ? (
                    <Card>
                      <Card.Body className="text-center">
                        <i className="fas fa-certificate fa-3x text-muted mb-3"></i>
                        <h5>{t('profile.noCertificates')}</h5>
                        <p className="text-muted">{t('profile.earnCertificates')}</p>
                      </Card.Body>
                    </Card>
                  ) : (
                    certificates.map(certificate => (
                      <CertificateCard
                        key={certificate.id}
                        certificate={certificate}
                        onDownload={handleDownloadCertificate}
                      />
                    ))
                  )}
                </div>
              </Tab>
            </Tabs>
          ) : (
            <div>
              {/* Show active activities only for regular users (not foundations) */}
              {user.user_type === 'user' ? (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-hands-helping me-2 text-success"></i>
                      Actividades Activas
                    </h5>
                    <small className="text-muted">
                      {user.name} está participando actualmente en {activeParticipations.length} actividad{activeParticipations.length !== 1 ? 'es' : ''}
                    </small>
                  </Card.Header>
                  <Card.Body>
                    {activeParticipations.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                        <h6>Sin actividades activas</h6>
                        <p className="text-muted small">
                          {user.name} no está participando en ninguna actividad en este momento.
                        </p>
                      </div>
                    ) : (
                      <Row>
                        {activeParticipations.map(participation => (
                          <Col lg={6} className="mb-3" key={participation.id}>
                            <OpportunityCard 
                              opportunity={participation.opportunity} 
                              user={currentUser}
                              showFavorite={false}
                            />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="fas fa-building me-2 text-primary"></i>
                      Perfil de Fundación
                    </h5>
                  </Card.Header>
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-building fa-3x text-muted mb-3"></i>
                    <h6>Fundación</h6>
                    <p className="text-muted">
                      Esta es una fundación dedicada a crear oportunidades de voluntariado y recibir donaciones.
                    </p>
                    {currentUser && (
                      <div className="d-flex gap-2 justify-content-center">
                        <Button 
                          as="a" 
                          href={`/foundations/${user.id}`}
                          variant="primary" 
                          size="sm"
                        >
                          <i className="fas fa-eye me-1"></i>
                          Ver detalles
                        </Button>
                        <Button 
                          as="a" 
                          href={`/donate/${user.id}`}
                          variant="success" 
                          size="sm"
                        >
                          <i className="fas fa-donate me-1"></i>
                          Donar
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* Additional Info Card */}
              <Card className="mt-3">
                <Card.Body className="text-center">
                  <h6 className="text-muted">Información del Perfil</h6>
                  <p className="text-muted small mb-0">
                    Esta es la información pública disponible de {user.name}.
                  </p>
                  {currentUser && user.user_type === 'user' && (
                    <div className="mt-2">
                      <Button 
                        as="a" 
                        href="/opportunities" 
                        variant="outline-primary" 
                        size="sm"
                      >
                        <i className="fas fa-search me-1"></i>
                        Buscar oportunidades juntos
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;