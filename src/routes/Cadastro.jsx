import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { cadastro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await cadastro(nome, email, senha);
      navigate('/login', { state: { success: 'Conta criada com sucesso! Faça login.' } });
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="cadastro-card">
        <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              className="input-field"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="input-field"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha"
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button
            type="submit"
            className="login-btn btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="login-footer">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}