import React, { useState } from 'react';
import './Register.css';

const Register: React.FC = () => {
  const [nombreApellido, setNombreApellido] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Para mostrar/ocultar contraseña
  const [errorFechaNacimiento, setErrorFechaNacimiento] = useState('');
  const [errorNombreApellido, setErrorNombreApellido] = useState('');
  const [errorNombreUsuario, setErrorNombreUsuario] = useState('');
  const [errorNumeroTelefono, setErrorNumeroTelefono] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el usuario tenga más de 18 años
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (age < 18 || (age === 18 && monthDifference < 0)) {
      setErrorFechaNacimiento('Debes tener al menos 18 años para registrarte.');
      return; // Detiene el envío si no cumple la condición
    }

    // Validar campos de nombre, usuario y número de teléfono
    if (nombreApellido.trim() === '') {
      setErrorNombreApellido('El nombre completo es requerido.');
      return;
    } else {
      setErrorNombreApellido('');
    }

    if (nombreUsuario.trim() === '') {
      setErrorNombreUsuario('El nombre de usuario es requerido.');
      return;
    } else {
      setErrorNombreUsuario('');
    }

    if (numeroTelefono.trim() === '' || isNaN(Number(numeroTelefono))) {
      setErrorNumeroTelefono('El número de teléfono es requerido y debe ser numérico.');
      return;
    } else {
      setErrorNumeroTelefono('');
    }

    // Si todas las validaciones son válidas, resetea el error de fecha
    setErrorFechaNacimiento('');

    // Lógica de registro aquí
    console.log('Registro exitoso');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNombreApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) { // Acepta solo letras y espacios
      setNombreApellido(value);
    }
  };

  const handleNombreUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z]*$/.test(value)) { // Acepta solo letras
      setNombreUsuario(value);
    }
  };

  const handleNumeroTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Acepta solo números
      setNumeroTelefono(value);
    }
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
                onChange={handleNombreApellidoChange}
                required
              />
              {errorNombreApellido && <small className="text-danger">{errorNombreApellido}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="numeroTelefono" className="form-label">Número de Teléfono</label>
              <input
                type="text"
                className="form-control"
                id="numeroTelefono"
                value={numeroTelefono}
                onChange={handleNumeroTelefonoChange}
                required
              />
              {errorNumeroTelefono && <small className="text-danger">{errorNumeroTelefono}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="nombreUsuario" className="form-label">Nombre de Usuario</label>
              <input
                type="text"
                className="form-control"
                id="nombreUsuario"
                value={nombreUsuario}
                onChange={handleNombreUsuarioChange}
                required
              />
              {errorNombreUsuario && <small className="text-danger">{errorNombreUsuario}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                id="fechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
              />
              {errorFechaNacimiento && <small className="text-danger">{errorFechaNacimiento}</small>}
            </div>
            <div className="mb-3 position-relative">
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
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"} // Cambia entre texto y contraseña
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="eye-icon" 
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
              </span>
            </div>
            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
