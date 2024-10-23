import React, { useState } from 'react';
import './Register.css';

const Register: React.FC = () => {
  const [nombreApellido, setNombreApellido] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de registro
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <h3>Registrarse</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombreApellido" className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                id="nombreApellido"
                value={nombreApellido}
                onChange={(e) => setNombreApellido(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="numeroTelefono" className="form-label">Número de Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="numeroTelefono"
                value={numeroTelefono}
                onChange={(e) => setNumeroTelefono(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
