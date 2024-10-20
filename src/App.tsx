import React from 'react';
import Navbar from './components/NavBar';
import File from './components/File'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App: React.FC = () => {
  return (
    <div>
      <Navbar /> {/* menu */}
      <File /> {/* Componente File */}
    </div>
  );
};

export default App;
