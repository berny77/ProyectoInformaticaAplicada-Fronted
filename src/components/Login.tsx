import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Creación del cuerpo de la solicitud
    const loginData = {
      email: username,
      password: password
    };

    try {
      // Realizamos la solicitud POST al backend
      const response = await fetch('https://localhost:7001/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        // Si la respuesta es exitosa, redirigimos al usuario
        console.log('Usuario autenticado con éxito');
        navigate('/inicio'); // Redirige a la página de inicio
      } else {
        // Si la respuesta no es 200 OK, mostrar alerta de usuario no encontrado
        alert('Usuario no encontrado o credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Hubo un error al intentar iniciar sesión');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cambia el estado de visibilidad
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <h3>Iniciar Sesión</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'} // Cambia el tipo de entrada según el estado
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span 
                className="toggle-password" 
                onClick={togglePasswordVisibility} 
                style={{ cursor: 'pointer', position: 'absolute', right: '20px', top: '30px' }} // Ajustar posición si es necesario
              >
                {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
              </span>
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
