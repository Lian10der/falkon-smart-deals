import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminUsuarios.css';

function AdminUsuarios() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', senha: '', nivel: 'comum'});

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
    carregarUsuarios();
  }, [user, isAdmin, navigate]);

  const carregarUsuarios = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('http://localhost:3001/usuarios');
      if (!res.ok) throw new Error('Erro ao carregar usuários.');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (id === user.id) {
      alert('Você não pode excluir seu próprio usuário.');
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await fetch(`http://localhost:3001/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erro ao excluir usuário.');
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const body = { ...form };
      if (!body.senha) delete body.senha;
      const res = await fetch(`http://localhost:3001/usuarios/${editando}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Erro ao salvar.');
      setEditando(null);
      await carregarUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const iniciarEdicao = (u) => {
    setEditando(u.id);
    setForm({ nome: u.nome, email: u.email, senha: '', nivel: u.nivel,  });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando usuários…</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="erro-state">
        <p>⚠️ {erro}</p>
        <button className="btn btn-secondary" onClick={carregarUsuarios}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="admin-page container">
      <h1>Administração de Usuários</h1>

      <table className="admin-tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Nível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              {editando === u.id ? (
                <>
                  <td>{u.id}</td>
                  <td>
                    <input
                      className="input-field input-sm"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="input-field input-sm"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      className="input-field input-sm"
                      value={form.nivel}
                      onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                    >
                      <option value="comum">comum</option>
                      <option value="vip">vip</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="admin-acoes">
                    <button className="btn btn-primary btn-sm" onClick={handleSalvarEdicao}>Salvar</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditando(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td><span className={`admin-nivel admin-nivel--${u.nivel}`}>{u.nivel}</span></td>
                  <td className="admin-acoes">
                    <button className="btn btn-primary btn-sm" onClick={() => iniciarEdicao(u)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleExcluir(u.id)}>Excluir</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
