import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BadgeCategoria from '../components/BadgeCategoria';
import { loadPurchasedProductIds, savePurchasedProductIds } from '../utils/purchasesState';
import '../styles/MinhasCompras.css';

const API = 'http://localhost:3001';

function MinhasCompras() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState(null);

  const purchasedIds = useMemo(() => {
    return user ? loadPurchasedProductIds(user.id) : [];
  }, [user]);

  const purchasedSet = useMemo(() => new Set(purchasedIds.map(String)), [purchasedIds]);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoadingProdutos(true);
      setErroProdutos(null);
      try {
        const res = await fetch(`${API}/produtos`);
        if (!res.ok) throw new Error('Falha ao carregar produtos.');
        const data = await res.json();
        setProdutos(data);
      } catch (e) {
        setErroProdutos(e.message || 'Erro ao carregar produtos.');
      } finally {
        setLoadingProdutos(false);
      }
    };

    fetchProdutos();
  }, []);

  const meusProdutos = useMemo(() => {
    if (!purchasedSet.size) return [];
    return produtos.filter((p) => purchasedSet.has(String(p.id)));
  }, [produtos, purchasedSet]);

  const remover = (produtoId) => {
    if (!user) return;
    const next = purchasedIds.filter((id) => String(id) !== String(produtoId));
    savePurchasedProductIds(user.id, next);
    // força re-render por meio de estado simples
    setProdutos((prev) => [...prev]);
  };

  if (!user) {
    return (
      <div className="erro-state" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Faça login para ver suas compras</p>
        <Link to="/login" className="btn btn-primary">Entrar</Link>
        <Link to="/cadastro" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Criar conta</Link>
      </div>
    );
  }

  if (loadingProdutos) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando seus produtos…</p>
      </div>
    );
  }

  if (erroProdutos) {
    return (
      <div className="erro-state">
        <p>⚠️ {erroProdutos}</p>
        <small>Verifique se o json-server está rodando na porta 3001.</small>
      </div>
    );
  }

  return (
    <div className="minhas-compras-page container">
      <div className="minhas-compras-header">
        <h1>Minhas Compras</h1>
        {purchasedIds.length > 0 ? (
          <span className="minhas-compras-count">{purchasedIds.length} item(ns)</span>
        ) : (
          <span className="minhas-compras-count minhas-compras-count--vazio">Nenhuma compra salva</span>
        )}
      </div>

      {meusProdutos.length === 0 ? (
        <div className="minhas-compras-empty">
          <p>Adicione produtos na página <Link to="/produtos">Produtos</Link>.</p>
        </div>
      ) : (
        <div className="minhas-compras-grid">
          {meusProdutos.map((produto) => (
            <div key={produto.id} className="minhas-compras-card">
              <img className="minhas-compras-card__img" src={produto.imagem} alt={produto.nome} loading="lazy" />
              <div className="minhas-compras-card__body">
                <div className="minhas-compras-card__top">
                  <BadgeCategoria categoria={produto.categoria} />
                </div>
                <div className="minhas-compras-card__nome">{produto.nome}</div>
                <div className="minhas-compras-card__meta">
                  <span className="minhas-compras-card__preco">R$ {produto.preco?.toFixed(2).replace('.', ',')}</span>
                  <span className="minhas-compras-card__nota">★ {produto.nota?.toFixed(1) || '—'}</span>
                </div>
                <div className="minhas-compras-card__actions">
                  <Link to={`/produto/${produto.id}`} className="btn btn-secondary">Ver</Link>
                  <button className="btn btn-danger" onClick={() => remover(produto.id)}>Remover</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MinhasCompras;

