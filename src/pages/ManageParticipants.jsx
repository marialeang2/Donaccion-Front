import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ParticipantCard from '../components/ParticipantCard';

const ManageParticipants = ({ user }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState({
    participant: null,
    description: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');

      // Fetch opportunity details
      const opportunityResponse = await fetch(`http://localhost:3001/api/opportunities/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!opportunityResponse.ok) {
        throw new Error(t('opportunity.notFound'));
      }

      const opportunityData = await opportunityResponse.json();
      setOpportunity(opportunityData);

      // Fetch participants
      const participantsResponse = await fetch(`http://localhost:3001/api/participation-requests/social-action/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (participantsResponse.ok) {
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (participantId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/participation-requests/${participantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(t('participants.statusChangeError'));
      }

      // Refresh participants list
      fetchData();

    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateCertificate = (participant) => {
    setCertificateData({
      participant: participant,
      description: t('certificates.defaultDescription', {
        participantName: participant.user?.name,
        opportunityTitle: opportunity?.title || 'participación en actividad social'
      })
    });
    setShowCertificateModal(true);
  };

  const submitCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/certificates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: certificateData.participant.user.id,
          description: certificateData.description
        })
      });

      if (!response.ok) {
        throw new Error(t('certificates.generateError'));
      }

      alert(t('certificates.generateSuccess'));
      setShowCertificateModal(false);
      setCertificateData({ participant: null, description: '' });

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchData} />;
  if (!opportunity) return <ErrorMessage error={t('opportunity.notFound')} />;

  const pendingParticipants = participants.filter(p => p.status === 'pending');
  const acceptedParticipants = participants.filter(p => p.status === 'accepted');
  const rejectedParticipants = participants.filter(p => p.status === 'rejected');

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">{t('participants.manage')}</h1>
              <p className="text-muted">
                {opportunity.title || opportunity.description?.substring(0, 100) + '...'}
              </p>
            </div>
            <div>
              <Button as={Link} to={`/opportunities/${id}`} variant="outline-primary" className="me-2">
                <i className="fas fa-eye me-1"></i>
                {t('opportunity.view')}
              </Button>
              <Button as={Link} to={`/opportunities/${id}/edit`} variant="outline-secondary">
                <i className="fas fa-edit me-1"></i>
                {t('opportunity.edit')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h3 className="text-warning">{pendingParticipants.length}</h3>
              <p className="text-muted">{t('participants.pending')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h3 className="text-success">{acceptedParticipants.length}</h3>
              <p className="text-muted">{t('participants.accepted')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <h3 className="text-danger">{rejectedParticipants.length}</h3>
              <p className="text-muted">{t('participants.rejected')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h3 className="text-primary">{participants.length}</h3>
              <p className="text-muted">{t('participants.total')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Participants Tabs */}
      <Row>
        <Col>
          <Tabs defaultActiveKey="pending" className="mb-3">
            <Tab 
              eventKey="pending" 
              title={
                <span>
                  {t('participants.pending')} 
                  {pendingParticipants.length > 0 && (
                    <Badge bg="warning" className="ms-2">{pendingParticipants.length}</Badge>
                  )}
                </span>
              }
            >
              {pendingParticipants.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                    <h5>{t('participants.noPending')}</h5>
                    <p className="text-muted">{t('participants.noPendingDescription')}</p>
                  </Card.Body>
                </Card>
              ) : (
                pendingParticipants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onStatusChange={handleStatusChange}
                    onGenerateCertificate={handleGenerateCertificate}
                  />
                ))
              )}
            </Tab>

            <Tab eventKey="accepted" title={t('participants.accepted')}>
              {acceptedParticipants.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
                    <h5>{t('participants.noAccepted')}</h5>
                    <p className="text-muted">{t('participants.noAcceptedDescription')}</p>
                  </Card.Body>
                </Card>
              ) : (
                acceptedParticipants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onStatusChange={handleStatusChange}
                    onGenerateCertificate={handleGenerateCertificate}
                  />
                ))
              )}
            </Tab>

            <Tab eventKey="rejected" title={t('participants.rejected')}>
              {rejectedParticipants.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <i className="fas fa-times-circle fa-3x text-muted mb-3"></i>
                    <h5>{t('participants.noRejected')}</h5>
                    <p className="text-muted">{t('participants.noRejectedDescription')}</p>
                  </Card.Body>
                </Card>
              ) : (
                rejectedParticipants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onStatusChange={handleStatusChange}
                    onGenerateCertificate={handleGenerateCertificate}
                  />
                ))
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Certificate Modal */}
      <Modal show={showCertificateModal} onHide={() => setShowCertificateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('certificates.generate')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t('certificates.participant')}</Form.Label>
              <Form.Control
                type="text"
                value={certificateData.participant?.user?.name || ''}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('certificates.description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={certificateData.description}
                onChange={(e) => setCertificateData({
                  ...certificateData,
                  description: e.target.value
                })}
                placeholder={t('certificates.descriptionPlaceholder')}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCertificateModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={submitCertificate}>
            {t('certificates.generate')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageParticipants;