import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import File from './components/File';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<File />} /> {/* Cambié esta línea */}
        
      </Routes>
    </Router>
  );
};

export default App;
