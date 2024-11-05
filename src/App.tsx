import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar1 from './components/Navbar';
/* import Navbar from './components/NavBar'; */
import Login from './components/Login';
import Register from './components/Register';
import FileGrid from './components/File/FileGrid'; // Cambiado a FileGrid
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
     <div className='container cs-height'>
     <Navbar1/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<FileGrid />} /> {/* Cambiado a FileGrid */}
      </Routes>
     </div>
    </Router>
  );
};

export default App;
