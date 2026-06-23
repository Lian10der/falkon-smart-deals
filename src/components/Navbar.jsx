import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">Falkon</Link>
        </div>

        <div className="navbar-links">
          <Link to="/produtos">Produtos</Link>
          {user && <Link to="/">Minhas Compras</Link>}
          {isAdmin && <Link to="/admin/usuarios">Admin</Link>}
        </div>

        <div className="navbar-right">
          {user ? (
            <>
              <span className="navbar-user">{user.nome}</span>
              <button className="navbar-logout" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-entrar">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

