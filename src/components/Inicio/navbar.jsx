import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Biblioteca
        </Link>

        <div className={`menu-icon ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li key="nav-autores" className="nav-item">
            <Link to="/autores" className="nav-link" onClick={closeMenu}>
              Autores
            </Link>
          </li>
          <li key="nav-libros" className="nav-item">
            <Link to="/libros" className="nav-link" onClick={closeMenu}>
              Libros
            </Link>
          </li>
          <li key="nav-editoriales" className="nav-item">
            <Link to="/editoriales" className="nav-link" onClick={closeMenu}>
              Editoriales
            </Link>
          </li>
          <li key="nav-reservas" className="nav-item">
            <Link to="/reservas" className="nav-link" onClick={closeMenu}>
              Reservas
            </Link>
          </li>
          <li key="nav-lectores" className="nav-item">
            <Link to="/lectores" className="nav-link" onClick={closeMenu}>
              Lectores
            </Link>
          </li>
          <li key="nav-multas" className="nav-item">
            <Link to="/multas" className="nav-link" onClick={closeMenu}>
              Multas
            </Link>
          </li>
          <li key="nav-prestamos" className="nav-item">
            <Link to="/prestamos" className="nav-link" onClick={closeMenu}>
              Préstamos
            </Link>
          </li>
          <li key="nav-categorias" className="nav-item">
            <Link to="/categorias" className="nav-link" onClick={closeMenu}>
              Categorias
            </Link>
          </li>
          <li key="nav-historial" className="nav-item">
            <Link to="/historial" className="nav-link" onClick={closeMenu}>
              Historial
            </Link>
          </li>
          <li key="nav-usuarios" className="nav-item">
            <Link to="/usuarios" className="nav-link" onClick={closeMenu}>
              Usuarios
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;