import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const SuggestionsReceived = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unprocessed, processed
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = localStorage.getItem('token');

      if (!userData || userData.user_type !== 'foundation') {
        throw new Error('Access denied');
      }

      let endpoint = 'http://localhost:3001/api/suggestions';
      if (filter === 'unprocessed') {
        endpoint = 'http://localhost:3001/api/suggestions/unprocessed';
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('suggestionsReceived.errors.fetchFailed'));
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, [t, filter]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleMarkAsProcessed = async (suggestionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/suggestions/${suggestionId}/process`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('suggestionsReceived.errors.markFailed'));
      }

      // Update local state
      setSuggestions(prev => prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, processed: true }
          : suggestion
      ));

      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSuggestion = async (suggestionId) => {
    if (!window.confirm(t('suggestionsReceived.confirmDelete'))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/suggestions/${suggestionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('suggestionsReceived.errors.deleteFailed'));
      }

      // Remove from local state
      setSuggestions(prev => prev.filter(suggestion => suggestion.id !== suggestionId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'processed') return suggestion.processed;
    if (filter === 'unprocessed') return !suggestion.processed;
    return true;
  });

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const paginatedSuggestions = filteredSuggestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (processed) => {
    return processed ? (
      <Badge bg="success">{t('suggestionsReceived.processed')}</Badge>
    ) : (
      <Badge bg="warning">{t('suggestionsReceived.pending')}</Badge>
    );
  };

  if (loading) return <LoadingSpinner message={t('suggestionsReceived.loading')} />;
  if (error) return <ErrorMessage error={error} onRetry={fetchSuggestions} />;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>{t('suggestionsReceived.title')}</h1>
          <p className="text-muted">{t('suggestionsReceived.subtitle')}</p>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">{t('suggestionsReceived.filters.all')}</option>
            <option value="unprocessed">{t('suggestionsReceived.filters.unprocessed')}</option>
            <option value="processed">{t('suggestionsReceived.filters.processed')}</option>
          </Form.Select>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="outline-primary" onClick={fetchSuggestions}>
            <i className="fas fa-sync-alt me-2"></i>
            {t('common.refresh')}
          </Button>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-primary">{suggestions.length}</h3>
              <p className="text-muted mb-0">{t('suggestionsReceived.stats.total')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-warning">{suggestions.filter(s => !s.processed).length}</h3>
              <p className="text-muted mb-0">{t('suggestionsReceived.stats.pending')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="text-success">{suggestions.filter(s => s.processed).length}</h3>
              <p className="text-muted mb-0">{t('suggestionsReceived.stats.processed')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Suggestions List */}
      {paginatedSuggestions.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h4>{t('suggestionsReceived.noSuggestions')}</h4>
            <p className="text-muted">{t('suggestionsReceived.noSuggestionsMessage')}</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {paginatedSuggestions.map((suggestion) => (
            <Card key={suggestion.id} className="mb-3 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <h6 className="mb-0 me-3">
                        {suggestion.user?.name || t('common.anonymousUser')}
                      </h6>
                      {getStatusBadge(suggestion.processed)}
                    </div>
                    <p className="text-muted small mb-2">
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(suggestion.created_at).toLocaleDateString()} {new Date(suggestion.created_at).toLocaleTimeString()}
                    </p>
                    <p className="mb-3">{suggestion.content}</p>
                  </div>
                  
                  <div className="text-end">
                    <div className="btn-group">
                      {!suggestion.processed && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setShowModal(true);
                          }}
                        >
                          <i className="fas fa-check me-1"></i>
                          {t('suggestionsReceived.markAsProcessed')}
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteSuggestion(suggestion.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Response Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('suggestionsReceived.markAsProcessed')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('suggestionsReceived.markAsProcessedMessage')}</p>
          <div className="bg-light p-3 rounded mb-3">
            <strong>{t('suggestionsReceived.suggestion')}:</strong>
            <p className="mb-0 mt-2">{selectedSuggestion?.content}</p>
          </div>
          <Form.Group>
            <Form.Label>{t('suggestionsReceived.response')} ({t('common.optional')})</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder={t('suggestionsReceived.responsePlaceholder')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleMarkAsProcessed(selectedSuggestion?.id)}
          >
            {t('suggestionsReceived.confirm')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SuggestionsReceived;