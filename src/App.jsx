import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Foundation Pages
import Foundations from './pages/Foundations';
import FoundationDetail from './pages/FoundationDetail';
import FoundationDashboard from './pages/FoundationDashboard';
import FoundationSetup from './pages/FoundationSetup';

// Opportunity Pages
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import CreateOpportunity from './pages/CreateOpportunity';
import EditOpportunity from './pages/EditOpportunity';
import ManageParticipants from './pages/ManageParticipants';

// User Pages
import Profile from './pages/Profile';
import MyParticipations from './pages/MyParticipations';
import MyDonations from './pages/MyDonations';
import Certificates from './pages/Certificates';
import Favorites from './pages/Favorites';

// Notification & Communication Pages
import Notifications from './pages/Notifications';
import CreateSuggestion from './pages/CreateSuggestion';
import SuggestionsReceived from './pages/SuggestionsReceived';

// Transaction Pages
import Donate from './pages/Donate';

// Other Pages
import Reports from './pages/Reports';

const App = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // If user is foundation, check if setup is complete
        if (parsedUser.user_type === 'foundation') {
          try {
            const response = await fetch(`http://localhost:3001/api/foundations/user/${parsedUser.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const foundation = await response.json();
              localStorage.setItem('foundationInfo', JSON.stringify(foundation));
            }
          } catch (err) {
            console.error('Error fetching foundation info:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('foundationInfo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('foundationInfo');
  };

  // Protected Route Components
  const ProtectedRoute = ({ children, requiredType = null }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (requiredType && user.user_type !== requiredType) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const FoundationSetupCheck = ({ children }) => {
    const foundationInfo = JSON.parse(localStorage.getItem('foundationInfo') || '{}');
    
    if (user?.user_type === 'foundation' && (!foundationInfo.legal_name || !foundationInfo.address)) {
      return <Navigate to="/foundation/setup" />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/foundations" element={<Foundations user={user} />} />
            <Route path="/foundations/:id" element={<FoundationDetail user={user} />} />
            <Route path="/opportunities" element={<Opportunities user={user} />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail user={user} />} />

            {/* Authentication Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login onLogin={handleLogin} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected User Routes */}
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-participations" 
              element={
                <ProtectedRoute requiredType="user">
                  <MyParticipations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-donations" 
              element={
                <ProtectedRoute requiredType="user">
                  <MyDonations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificates" 
              element={
                <ProtectedRoute requiredType="user">
                  <Certificates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute requiredType="user">
                  <Favorites />
                </ProtectedRoute>
              } 
            />

            {/* Foundation Routes */}
            <Route 
              path="/foundation/setup" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/foundation/dashboard" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <FoundationDashboard />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities/create" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <CreateOpportunity />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities/edit/:id" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <EditOpportunity />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities/:id/participants" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <ManageParticipants />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <Reports />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/suggestions/received" 
              element={
                <ProtectedRoute requiredType="foundation">
                  <FoundationSetupCheck>
                    <SuggestionsReceived />
                  </FoundationSetupCheck>
                </ProtectedRoute>
              } 
            />

            {/* Shared Protected Routes */}
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/suggestions/create" 
              element={
                <ProtectedRoute>
                  <CreateSuggestion />
                </ProtectedRoute>
              } 
            />

            {/* Transaction Routes */}
            <Route 
              path="/donate/:foundationId" 
              element={
                <ProtectedRoute requiredType="user">
                  <Donate />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;