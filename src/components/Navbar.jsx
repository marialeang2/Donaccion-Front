import React, { useState } from 'react';
import { Navbar as BSNavbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setExpanded(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const closeNavbar = () => {
    setExpanded(false);
  };

  // Determinar dónde debe ir el logo según el tipo de usuario
  const getHomeLink = () => {
    if (user && user.user_type === 'foundation') {
      return '/foundation/dashboard';
    }
    return '/';
  };

  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm" expanded={expanded}>
      <Container>
        <BSNavbar.Brand as={Link} to={getHomeLink()} onClick={closeNavbar}>
          <img 
            src="/images/logo.svg" 
            alt="Logo Don Acción" 
            style={{ width: '35px', height: '35px', marginRight: '2px' }} 
          />
          <strong className="text-primary">Don Acción</strong>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Cambiar "Home" por "Dashboard" para foundations */}
            {user && user.user_type === 'foundation' ? (
              <Nav.Link as={Link} to="/foundation/dashboard" onClick={closeNavbar}>
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/" onClick={closeNavbar}>
                {t('nav.home')}
              </Nav.Link>
            )}
            
            <Nav.Link as={Link} to="/foundations" onClick={closeNavbar}>
              {t('nav.foundations')}
            </Nav.Link>
            <Nav.Link as={Link} to="/opportunities" onClick={closeNavbar}>
              {t('nav.opportunities')}
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeNavbar}>
              {t('nav.about')}
            </Nav.Link>
          </Nav>

          <Nav className="d-flex align-items-center">
            {/* Language Selector */}
            <NavDropdown title={i18n.language === 'es' ? 'ES' : 'EN'} id="language-dropdown">
              <NavDropdown.Item onClick={() => changeLanguage('es')}>
                Español
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('en')}>
                English
              </NavDropdown.Item>
            </NavDropdown>

            {user ? (
              <>
                {/* User Menu */}
                <NavDropdown 
                  title={
                    <span>
                      <i className="fas fa-user-circle me-1"></i>
                      {user.name}
                    </span>
                  } 
                  id="user-dropdown"
                  data-cy="user-menu-dropdown" 
                >
                  <NavDropdown.Item as={Link} to={`/profile/${user.id}`} onClick={closeNavbar}>
                    <i className="fas fa-user me-2"></i>
                    {t('nav.profile')}
                  </NavDropdown.Item>
                  
                  {user.user_type === 'user' && (
                    <>
                      <NavDropdown.Item as={Link} to="/my-participations" onClick={closeNavbar}>
                        <i className="fas fa-hands-helping me-2"></i>
                        {t('nav.myParticipations')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/my-donations" onClick={closeNavbar} data-cy="my-donations-link">
                        <i className="fas fa-donate me-2"></i>
                        {t('nav.myDonations')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/certificates" onClick={closeNavbar}>
                        <i className="fas fa-certificate me-2"></i>
                        {t('nav.certificates')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/favorites" onClick={closeNavbar}>
                        <i className="fas fa-heart me-2"></i>
                        {t('nav.favorites')}
                      </NavDropdown.Item>
                    </>
                  )}
                  
                  {user.user_type === 'foundation' && (
                    <>
                      <NavDropdown.Item as={Link} to="/foundation/dashboard" onClick={closeNavbar}>
                        <i className="fas fa-tachometer-alt me-2"></i>
                        {t('nav.dashboard')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/opportunities/create" onClick={closeNavbar}>
                        <i className="fas fa-plus me-2"></i>
                        {t('nav.createOpportunity')}
                      </NavDropdown.Item>
                      
                      {/* Quitamos las sugerencias para foundations */}
                    </>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/notifications" onClick={closeNavbar}>
                    <i className="fas fa-bell me-2"></i>
                    {t('nav.notifications')}
                  </NavDropdown.Item>
                  
                  {/* Solo usuarios regulares pueden enviar sugerencias */}
                  {user.user_type === 'user' && (
                    <NavDropdown.Item as={Link} to="/suggestions/create" onClick={closeNavbar}>
                      <i className="fas fa-lightbulb me-2"></i>
                      {t('nav.sendSuggestion')}
                    </NavDropdown.Item>
                  )}
                  
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    {t('nav.logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>
                  {t('nav.login')}
                </Nav.Link>
                <Button as={Link} to="/register" variant="primary" size="sm" onClick={closeNavbar}>
                  {t('nav.register')}
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;