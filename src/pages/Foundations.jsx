import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import FoundationCard from '../components/FoundationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const Foundations = ({ user }) => {
  const { t } = useTranslation();
  const [foundations, setFoundations] = useState([]);
  const [filteredFoundations, setFilteredFoundations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const fetchFoundations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/foundations');
      if (!response.ok) {
        throw new Error(t('foundations.fetchError'));
      }
      const data = await response.json();
      setFoundations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const filterAndSortFoundations = useCallback(() => {
    let filtered = [...foundations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(foundation =>
        foundation.legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        foundation.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(foundation =>
        foundation.address?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.legal_name.localeCompare(b.legal_name);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

    setFilteredFoundations(filtered);
    setCurrentPage(1);
  }, [foundations, searchTerm, locationFilter, sortBy]);

  useEffect(() => {
    fetchFoundations();
  }, [fetchFoundations]);

  useEffect(() => {
    filterAndSortFoundations();
  }, [foundations, searchTerm, locationFilter, sortBy, filterAndSortFoundations]);

  const handleSearch = (e) => {
    e.preventDefault();
    // filterAndSortFoundations is called automatically by useEffect
  };

  // Pagination
  const totalPages = Math.ceil(filteredFoundations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFoundations = filteredFoundations.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <LoadingSpinner message={t('foundations.loading')} />;
  if (error) return <ErrorMessage error={error} onRetry={fetchFoundations} />;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">{t('foundations.title')}</h1>
          <p className="text-muted">{t('foundations.subtitle')}</p>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Row className="mb-4">
        <Col md={4}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t('foundations.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder={t('foundations.locationPlaceholder')}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">{t('foundations.sortByName')}</option>
            <option value="newest">{t('foundations.sortByNewest')}</option>
            <option value="oldest">{t('foundations.sortByOldest')}</option>
          </Form.Select>
        </Col>
        <Col md={2} className="text-end">
          <Button variant="outline-secondary" onClick={() => {
            setSearchTerm('');
            setLocationFilter('');
            setSortBy('name');
          }}>
            {t('common.clearFilters')}
          </Button>
        </Col>
      </Row>

      {/* Results Info */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            {t('foundations.showingResults', {
              start: startIndex + 1,
              end: Math.min(startIndex + itemsPerPage, filteredFoundations.length),
              total: filteredFoundations.length
            })}
          </p>
        </Col>
      </Row>

      {/* Foundations Grid */}
      {currentFoundations.length === 0 ? (
        <Row>
          <Col className="text-center py-5">
            <i className="fas fa-building fa-3x text-muted mb-3"></i>
            <h4>{t('foundations.noResults')}</h4>
            <p className="text-muted">{t('foundations.tryDifferentSearch')}</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            {currentFoundations.map((foundation) => (
              <Col lg={4} md={6} key={foundation.id} className="mb-4">
                <FoundationCard foundation={foundation} user={user} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row>
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
    </Container>
  );
};

export default Foundations;