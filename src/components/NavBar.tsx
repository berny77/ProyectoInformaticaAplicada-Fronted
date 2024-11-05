import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.scss'


function Navbar1() {
    const navigate = useNavigate();
    const logout = () =>{
        sessionStorage.clear();
        navigate('/login');
    }

    return (
        <div className="container nav-fixed">
            <nav className="navbar navbar-expand-lg ftco_navbar ftco-navbar-light" id="ftco-navbar">
                <div className="container">
                    <a className="navbar-brand" href="index.html">Mis documentos</a>
                    <div className="social-media order-lg-last">
                        <p className="mb-0 d-flex">
                            <a data-action="Login" className="d-flex align-items-center justify-content-center a-icon tooltiplg" onClick={()=> navigate('/login')}><span className="fa fa-arrow-right-to-bracket"><i className="sr-only">Login</i></span></a>
                            <a data-action="Sign up" className="d-flex align-items-center justify-content-center a-icon tooltiplg" onClick={()=> navigate('/register')}><span className="fa fa-user-plus"><i className="sr-only">User register</i></span></a>
                            <a data-action="Log out" className="d-flex align-items-center justify-content-center a-icon tooltiplg" onClick={()=> logout()}><span className="fa fa-power-off"><i className="sr-only">Logout</i></span></a>
                        </p>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="fa fa-bars"></span> Menu
                    </button>
                    <div className="navbar-collapse collapse" id="ftco-nav">
                        <ul className="navbar-nav ml-auto mr-md-3">
                            <li className="nav-item active"><a href="#" className="nav-link">Inicio</a></li>
                            <li className="nav-item"><a href="#" className="nav-link">Archivos Minados</a></li>
                            <li className="nav-item"><a href="#" className="nav-link">Configuracion</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar1