import React, { useState, useEffect, useCallback } from 'react';
import { Card, Nav, Tab, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ParticipantCard from './ParticipantCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ParticipantsList = ({ opportunityId, user, readOnly = false }) => {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const fetchParticipants = useCallback(async () => {
    if (!opportunityId || !user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Fetching participants for opportunity:', opportunityId);
      console.log('User role:', user.email, readOnly ? '(read-only)' : '(full access)');
      
      const response = await fetch(`http://localhost:3001/api/opportunities/${opportunityId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(t('participants.fetchError'));
      }
      
      const data = await response.json();
      console.log('Participants data received:', data);
      setParticipants(data || []);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [opportunityId, t, user, readOnly]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleStatusChange = async (participantId, newStatus) => {
    if (readOnly || user.email === 'admin@lector.com') {
      alert(t('participants.readOnlyAdminCannotModify'));
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/participation-requests/${participantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error(t('participants.updateError'));
      }
      
      // Actualizar localmente el estado del participante
      setParticipants(prevParticipants => 
        prevParticipants.map(p => 
          p.id === participantId ? { ...p, status: newStatus } : p
        )
      );
      
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateCertificate = async (participant) => {
    // Aquí iría la lógica para generar un certificado
    alert(t('participants.certificateGenerated', { name: participant.user?.name }));
  };

  // Si no hay ID de oportunidad o usuario, no mostrar nada
  if (!opportunityId || !user) {
    return null;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={fetchParticipants} />;

  // Filtrar participantes según la pestaña activa
  const filteredParticipants = participants.filter(p => {
    if (activeTab === 'pending') return p.status === 'pending';
    if (activeTab === 'accepted') return p.status === 'accepted';
    if (activeTab === 'rejected') return p.status === 'rejected';
    return true;
  });

  // Determinar si estamos en modo de solo lectura
  const isReadOnly = readOnly || user.email === 'admin@lector.com';

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header>
        <h5 className="mb-0">
          {t('participants.title')}
          {isReadOnly && (
            <small className="ms-2 text-muted">{t('participants.readOnlyMode')}</small>
          )}
        </h5>
      </Card.Header>
      
      {participants.length === 0 ? (
        <Card.Body className="text-center py-5">
          <i className="fas fa-users fa-3x text-muted mb-3"></i>
          <h5>{t('participants.noApplicationsYet')}</h5>
          <p className="text-muted">{t('participants.waitingForParticipants')}</p>
        </Card.Body>
      ) : (
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mt-2 px-3">
            <Nav.Item>
              <Nav.Link eventKey="pending" className="d-flex align-items-center">
                {t('participants.pending')}
                <span className="badge bg-primary ms-2">
                  {participants.filter(p => p.status === 'pending').length}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="accepted" className="d-flex align-items-center">
                {t('participants.accepted')}
                <span className="badge bg-success ms-2">
                  {participants.filter(p => p.status === 'accepted').length}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="rejected" className="d-flex align-items-center">
                {t('participants.rejected')}
                <span className="badge bg-danger ms-2">
                  {participants.filter(p => p.status === 'rejected').length}
                </span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          <Tab.Content className="p-3">
            <Tab.Pane eventKey={activeTab}>
              {filteredParticipants.length === 0 ? (
                <Alert variant="info">
                  {activeTab === 'pending' 
                    ? t('participants.noPending') 
                    : activeTab === 'accepted'
                      ? t('participants.noAccepted')
                      : t('participants.noRejected')}
                </Alert>
              ) : (
                filteredParticipants.map(participant => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    onStatusChange={handleStatusChange}
                    onGenerateCertificate={handleGenerateCertificate}
                    readOnly={isReadOnly}
                  />
                ))
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      )}
    </Card>
  );
};

export default ParticipantsList;