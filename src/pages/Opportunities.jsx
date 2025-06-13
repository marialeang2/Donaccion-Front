import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import OpportunityCard from '../components/OpportunityCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const Opportunities = ({ user }) => {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/opportunities');
      if (!response.ok) {
        throw new Error(t('opportunities.fetchError'));
      }
      
      const data = await response.json();
      
      // Enrich opportunities with foundation data and ratings
      const enrichedOpportunities = await Promise.all(
        data.map(async (opportunity) => {
          try {
            // Fetch foundation info
            const foundationResponse = await fetch(`http://localhost:3001/api/foundations/${opportunity.foundation_id}`);
            if (foundationResponse.ok) {
              opportunity.foundation = await foundationResponse.json();
            }

            // Fetch average rating
            const ratingResponse = await fetch(`http://localhost:3001/api/ratings/opportunity/${opportunity.id}/average`);
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              opportunity.averageRating = ratingData.average_rating || 0;
            }

            return opportunity;
          } catch (err) {
            console.error('Error enriching opportunity:', err);
            return opportunity;
          }
        })
      );
      
      setOpportunities(enrichedOpportunities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const filterOpportunities = useCallback(() => {
    let filtered = [...opportunities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opportunity =>
        opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.foundation?.legal_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      const now = new Date();
      filtered = filtered.filter(opportunity => {
        const startDate = new Date(opportunity.start_date);
        const endDate = new Date(opportunity.end_date);
        
        switch (filters.status) {
          case 'active':
            return now >= startDate && now <= endDate;
          case 'upcoming':
            return now < startDate;
          case 'ended':
            return now > endDate;
          default:
            return true;
        }
      });
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(opportunity =>
        opportunity.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        opportunity.foundation?.address?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(opportunity =>
        new Date(opportunity.start_date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(opportunity =>
        new Date(opportunity.end_date) <= new Date(filters.endDate)
      );
    }

    setFilteredOpportunities(filtered);
    setCurrentPage(1);
  }, [opportunities, searchTerm, filters]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities, searchTerm, filters, filterOpportunities]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      location: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <LoadingSpinner message={t('opportunities.loading')} />;
  if (error) return <ErrorMessage error={error} onRetry={fetchOpportunities} />;

  return (
    <Container fluid className="py-5">
      <Container>
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold">{t('opportunities.title')}</h1>
            <p className="text-muted">{t('opportunities.subtitle')}</p>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={6}>
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('opportunities.searchPlaceholder')}
            />
          </Col>
          <Col md={6} className="text-end">
            <p className="text-muted mb-0">
              {t('opportunities.showingResults', {
                start: startIndex + 1,
                end: Math.min(startIndex + itemsPerPage, filteredOpportunities.length),
                total: filteredOpportunities.length
              })}
            </p>
          </Col>
        </Row>

        <Row>
          {/* Filters Sidebar */}
          <Col md={3}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Col>

          {/* Opportunities Grid */}
          <Col md={9}>
            {currentOpportunities.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-hands-helping fa-3x text-muted mb-3"></i>
                <h4>{t('opportunities.noResults')}</h4>
                <p className="text-muted">{t('opportunities.tryDifferentSearch')}</p>
              </div>
            ) : (
              <>
                <Row>
                  {currentOpportunities.map((opportunity) => (
                    <Col lg={4} md={6} key={opportunity.id} className="mb-4">
                      <OpportunityCard opportunity={opportunity} user={user} />
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
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Opportunities;