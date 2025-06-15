import { useState } from 'react';
import { Navbar, Nav, Container, Offcanvas, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiMenu,
  FiX,
  FiTruck
} from 'react-icons/fi';

const CustomNavbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  // Navigation items
  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: FiHome,
      badge: null
    },
    {
      path: '/clients',
      label: 'Clients',
      icon: FiUsers,
      badge: null
    },
    {
      path: '/devis',
      label: 'Devis',
      icon: FiFileText,
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <Navbar 
        bg="white" 
        variant="light" 
        expand="lg" 
        className="shadow-sm border-bottom sticky-top"
        style={{ zIndex: 1030 }}
      >
        <Container fluid className="px-3 px-lg-4">
          {/* Brand */}
          <Navbar.Brand 
            as={Link} 
            to="/" 
            className="d-flex align-items-center fw-bold text-primary text-decoration-none"
          >
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
              <FiTruck className="text-primary" size={20} />
            </div>
            <span className="d-none d-sm-inline">DevisDem</span>
          </Navbar.Brand>

          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline-secondary d-lg-none border-0"
            onClick={handleShowSidebar}
            aria-label="Menu"
          >
            <FiMenu size={20} />
          </button>

          {/* Desktop Navigation */}
          <Navbar.Collapse className="d-none d-lg-flex">
            <Nav className="me-auto">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`
                      nav-link-custom mx-1 px-3 py-2 rounded-lg d-flex align-items-center position-relative
                      ${isActive 
                        ? 'bg-primary bg-opacity-10 text-primary fw-medium' 
                        : 'text-secondary hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent size={18} className="me-2" />
                    {item.label}
                    {item.badge && (
                      <Badge 
                        bg="danger" 
                        className="ms-2 position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* Desktop Actions */}
            <Nav className="align-items-center">
              <div className="d-flex align-items-center gap-3">
  
                
                {/* User Avatar */}
                <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                  <span className="text-primary fw-bold">AD</span>
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={showSidebar} 
        onHide={handleCloseSidebar} 
        placement="start"
        className="w-75"
      >
        <Offcanvas.Header className="border-bottom">
          <Offcanvas.Title className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
              <FiTruck className="text-primary" size={20} />
            </div>
            DevisDem
          </Offcanvas.Title>
          <button
            className="btn btn-outline-secondary border-0 ms-auto"
            onClick={handleCloseSidebar}
          >
            <FiX size={20} />
          </button>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="p-0">
          {/* User Profile Section */}
          <div className="p-3 bg-light border-bottom">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <span className="text-primary fw-bold fs-5">AD</span>
              </div>
              <div>
                <div className="fw-semibold">Admin Demo</div>
                <small className="text-muted">admin@devisdem.com</small>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="py-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleCloseSidebar}
                  className={`
                    d-flex align-items-center px-4 py-3 text-decoration-none position-relative
                    ${isActive 
                      ? 'bg-primary bg-opacity-10 text-primary border-end border-primary border-3' 
                      : 'text-dark hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent size={20} className="me-3" />
                  <span className="fw-medium">{item.label}</span>
                  {item.badge && (
                    <Badge bg="danger" className="ms-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer */}
          <div className="mt-auto p-3 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">Version 1.0.0</small>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary">
                  Aide
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomNavbar;