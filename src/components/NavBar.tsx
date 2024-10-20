import React from 'react';
import './Navbar.css'; // Asegúrate de importar el archivo CSS

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Inicio</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNavAltMarkup" 
          aria-controls="navbarNavAltMarkup" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link active" aria-current="page" href="#home">Apartado 1</a>
            <a className="nav-link" href="#about">Apartado 2</a>
            <a className="nav-link" href="#services">Apartado 3</a>
          </div>
          <div className="ms-auto">
            <button className="btn btn-outline-success" type="button">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
