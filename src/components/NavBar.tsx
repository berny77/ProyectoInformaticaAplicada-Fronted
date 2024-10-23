import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <button onClick={() => handleNavigation('/inicio')} className="navbar-brand btn btn-link">
          Inicio
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <button 
            onClick={() => handleNavigation('/login')} 
            className="btn btn-outline-success btn-lg me-3" 
          >
            <i className="bi bi-box-arrow-in-right"></i> Login
          </button>
          <button 
            onClick={() => handleNavigation('/register')} 
            className="btn btn-outline-primary btn-lg"
          >
            <i className="bi bi-person-plus-fill"></i> Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
