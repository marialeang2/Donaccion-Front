import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Reports = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    totalDonations: 0,
    totalUsers: 0,
    totalOpportunities: 0,
    donationsByCategory: [],
    donationsByDay: [],
    participantsByOpportunity: [],
    monthlyGrowth: []
  });

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const foundationInfo = JSON.parse(localStorage.getItem('foundationInfo'));
      const token = localStorage.getItem('token');

      if (!userData || userData.user_type !== 'foundation' || !foundationInfo) {
        throw new Error('Access denied');
      }

      // Fetch general reports
      const reportsResponse = await fetch('http://localhost:3001/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (reportsResponse.ok) {
        const generalData = await reportsResponse.json();
        setReportData(prev => ({ ...prev, ...generalData }));
      }

      // Fetch donations by category
      const categoryResponse = await fetch('http://localhost:3001/api/reports/donations-by-category', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setReportData(prev => ({ ...prev, donationsByCategory: categoryData }));
      }

      // Fetch donations by day
      const dailyResponse = await fetch('http://localhost:3001/api/reports/donations-by-day', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        setReportData(prev => ({ ...prev, donationsByDay: dailyData }));
      }

      // Fetch foundation-specific data
      const foundationDonations = await fetch(`http://localhost:3001/api/donations/foundation/${foundationInfo.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (foundationDonations.ok) {
        const donationsData = await foundationDonations.json();
        
        // Process monthly growth
        const monthlyGrowth = processMonthlyGrowth(donationsData);
        setReportData(prev => ({ ...prev, monthlyGrowth }));
      }

      // Fetch opportunities and participants
      const opportunitiesResponse = await fetch(`http://localhost:3001/api/opportunities/foundation/${foundationInfo.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (opportunitiesResponse.ok) {
        const opportunitiesData = await opportunitiesResponse.json();
        
        // Get participants for each opportunity
        const participantsByOpportunity = await Promise.all(
          opportunitiesData.map(async (opp) => {
            try {
              const participantsResponse = await fetch(`http://localhost:3001/api/participation-requests/social-action/${opp.id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              if (participantsResponse.ok) {
                const participants = await participantsResponse.json();
                return {
                  name: opp.title || opp.description?.substring(0, 30) + '...',
                  participants: participants.length,
                  accepted: participants.filter(p => p.status === 'accepted').length
                };
              }
            } catch (err) {
              console.error('Error fetching participants:', err);
            }
            return {
              name: opp.title || opp.description?.substring(0, 30) + '...',
              participants: 0,
              accepted: 0
            };
          })
        );

        setReportData(prev => ({ ...prev, participantsByOpportunity }));
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const processMonthlyGrowth = (donations) => {
    const monthlyData = {};
    
    donations.forEach(donation => {
      const date = new Date(donation.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, amount: 0, count: 0 };
      }
      
      monthlyData[monthKey].amount += donation.amount;
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) return <LoadingSpinner message={t('reports.loading')} />;
  if (error) return <ErrorMessage error={error} onRetry={fetchReportData} />;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>{t('reports.title')}</h1>
          <p className="text-muted">{t('reports.subtitle')}</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary" onClick={fetchReportData}>
            <i className="fas fa-sync-alt me-2"></i>
            {t('reports.refresh')}
          </Button>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-primary mb-3">
                <i className="fas fa-donate fa-2x"></i>
              </div>
              <h3 className="text-primary">${reportData.totalDonations?.toLocaleString() || 0}</h3>
              <p className="text-muted mb-0">{t('reports.totalDonations')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-success mb-3">
                <i className="fas fa-hands-helping fa-2x"></i>
              </div>
              <h3 className="text-success">{reportData.totalOpportunities || 0}</h3>
              <p className="text-muted mb-0">{t('reports.totalOpportunities')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-info mb-3">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="text-info">{reportData.participantsByOpportunity?.reduce((sum, opp) => sum + opp.participants, 0) || 0}</h3>
              <p className="text-muted mb-0">{t('reports.totalParticipants')}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="text-warning mb-3">
                <i className="fas fa-certificate fa-2x"></i>
              </div>
              <h3 className="text-warning">{reportData.participantsByOpportunity?.reduce((sum, opp) => sum + opp.accepted, 0) || 0}</h3>
              <p className="text-muted mb-0">{t('reports.certificatesIssued')}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Tabs defaultActiveKey="donations" className="mb-4">
        <Tab eventKey="donations" title={t('reports.tabs.donations')}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{t('reports.donationsByCategory')}</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.donationsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {reportData.donationsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{t('reports.donationsByDay')}</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.donationsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="participation" title={t('reports.tabs.participation')}>
          <Row>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{t('reports.participantsByOpportunity')}</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.participantsByOpportunity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="participants" fill="#8884d8" name={t('reports.totalApplications')} />
                      <Bar dataKey="accepted" fill="#82ca9d" name={t('reports.acceptedApplications')} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{t('reports.monthlyGrowth')}</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" name={t('reports.donationAmount')} />
                      <Line type="monotone" dataKey="count" stroke="#82ca9d" name={t('reports.donationCount')} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Reports;