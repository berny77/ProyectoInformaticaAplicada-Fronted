import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './Register.css';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorFechaNacimiento, setErrorFechaNacimiento] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorApellido, setErrorApellido] = useState('');
  const [errorNombreUsuario, setErrorNombreUsuario] = useState('');

  const navigate = useNavigate(); // Crear la función de navegación

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (age < 18 || (age === 18 && monthDifference < 0)) {
      setErrorFechaNacimiento('Debes tener al menos 18 años para registrarte.');
      return;
    }

    if (nombre.trim() === '') {
      setErrorNombre('El nombre es requerido.');
      return;
    } else {
      setErrorNombre('');
    }

    if (apellido.trim() === '') {
      setErrorApellido('El apellido es requerido.');
      return;
    } else {
      setErrorApellido('');
    }

    if (nombreUsuario.trim() === '') {
      setErrorNombreUsuario('El nombre de usuario es requerido.');
      return;
    } else {
      setErrorNombreUsuario('');
    }

    setErrorFechaNacimiento('');

    // Aquí creamos el objeto que enviaremos al backend
    const userData = {
      userN: nombreUsuario,
      name: nombre,
      lastName: apellido,
      email: email,
      dateOfBirth: new Date(fechaNacimiento).toISOString(),
      password: password
    };

    try {
      const response = await fetch('https://localhost:7001/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        console.log('Registro exitoso');
        // Redirigir al usuario al login
        navigate('/login');
      } else {
        console.error('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error de red al intentar registrar el usuario:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) { // Acepta solo letras y espacios
      setNombre(value);
    }
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) { // Acepta solo letras y espacios
      setApellido(value);
    }
  };

  const handleNombreUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z]*$/.test(value)) { // Acepta solo letras
      setNombreUsuario(value);
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
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={handleNombreChange}
                required
              />
              {errorNombre && <small className="text-danger">{errorNombre}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={apellido}
                onChange={handleApellidoChange}
                required
              />
              {errorApellido && <small className="text-danger">{errorApellido}</small>}
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
