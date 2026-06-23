import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeCategoria from '../components/BadgeCategoria';
import '../styles/Produtos.css';

function Produtos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      setErro(null);
      try {
        const res = await fetch('http://localhost:3001/produtos');
        if (!res.ok) throw new Error('Falha ao carregar produtos.');
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const filtered = produtos.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando produtos…</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="erro-state">
        <p>⚠️ {erro}</p>
        <small>Verifique se o json-server está rodando na porta 3001.</small>
      </div>
    );
  }

  return (
    <div className="produtos-page container">
      <div className="produtos-header">
        <h1>Catálogo de Produtos</h1>
        <input
          className="input-field produtos-search"
          type="text"
          placeholder="Buscar produto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="produtos-grid">
        {filtered.length === 0 ? (
          <p className="produtos-grid--vazio">Nenhum produto encontrado.</p>
        ) : (
          filtered.map((produto) => (
            <div
              key={produto.id}
              className="produto-card"
              onClick={() => navigate(`/produto/${produto.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/produto/${produto.id}`);
              }}
            >
              <img
                className="produto-card__img"
                src={produto.imagem}
                alt={produto.nome}
                loading="lazy"
              />
              <div className="produto-card__body">
                <span className="produto-card__categoria">
                  <BadgeCategoria categoria={produto.categoria} />
                </span>
                <span className="produto-card__nome">{produto.nome}</span>
                <div className="produto-card__footer">
                  <span className="produto-card__preco">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="produto-card__nota">
                    ★ {produto.nota?.toFixed(1) || '—'}
                  </span>
                  <span
                    className={`produto-card__estoque ${
                      (produto.estoque ?? 0) > 0
                        ? 'produto-card__estoque--disponivel'
                        : 'produto-card__estoque--esgotado'
                    }`}
                  >
                    {(produto.estoque ?? 0) > 0 ? 'Disponível' : 'Esgotado'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Produtos;

