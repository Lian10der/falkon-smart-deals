import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('falkon_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('falkon_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, senha) => {
    const response = await fetch(
      `http://localhost:3001/usuarios?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
    );
    if (!response.ok) throw new Error('Erro ao conectar ao servidor');

    const usuarios = await response.json();
    if (usuarios.length === 0) throw new Error('Email ou senha inválidos');

    const userData = usuarios[0];
    localStorage.setItem('falkon_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('falkon_user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const cadastro = useCallback(async (nome, email, senha) => {
    const response = await fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senha,
        nivel: 'comum',
        carteira_saldo: 0,
      }),
    });

    if (!response.ok) throw new Error('Erro ao cadastrar usuário');

    return await response.json();
  }, []);

  const isAdmin = user?.nivel === 'admin';

  const value = {
    user,
    loading,
    login,
    logout,
    cadastro,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;