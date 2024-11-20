import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar1 from './components/NavBar1';
import Login from './components/Login';
import Register from './components/Register';
import FileGrid from './components/File/FileGrid';
import Block from './components/Mine/Block'; 
import Configuration from './components/Configuration/Configuration';
import Activity from './components/Activity/SystemActivity';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar1 />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<FileGrid />} />
        <Route path="/archivos-minados" element={<Block />} /> 
        <Route path="/configuration" element={<Configuration />} /> 
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </Router>
  );
};

export default App;
