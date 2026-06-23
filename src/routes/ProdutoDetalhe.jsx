import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BadgeCategoria from '../components/BadgeCategoria';
import '../styles/ProdutoDetalhe.css';

function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro(null);
      try {
        const [prodRes, avalRes] = await Promise.all([
          fetch(`http://localhost:3001/produtos/${id}`),
          fetch(`http://localhost:3001/avaliacoes?produtoId=${id}`),
        ]);

        if (!prodRes.ok) throw new Error('Produto não encontrado.');

        const produtoData = await prodRes.json();
        const avaliacoesData = await avalRes.json();

        // Buscar nome dos usuários das avaliações
        const userIds = [...new Set(avaliacoesData.map((a) => a.usuarioId))];
        const usuariosMap = {};

        if (userIds.length > 0) {
          const usuariosRes = await Promise.all(
            userIds.map((uid) =>
              fetch(`http://localhost:3001/usuarios/${uid}`).then((r) => r.json())
            )
          );
          usuariosRes.forEach((u) => {
            usuariosMap[u.id] = u.nome;
          });
        }

        const avaliacoesComNome = avaliacoesData.map((a) => ({
          ...a,
          usuarioNome: usuariosMap[a.usuarioId] || 'Usuário',
        }));

        setProduto(produtoData);
        setAvaliacoes(avaliacoesComNome);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando produto…</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="erro-state">
        <p>⚠️ {erro || 'Produto não encontrado.'}</p>
        <Link to="/produtos" className="btn btn-secondary">← Voltar ao catálogo</Link>
      </div>
    );
  }

  const formatarData = (dataStr) => {
    try {
      return new Date(dataStr + 'T12:00:00').toLocaleDateString('pt-BR');
    } catch {
      return dataStr;
    }
  };

  return (
    <div className="produto-detalhe container">
      <Link to="/produtos" className="produto-detalhe__voltar">← Voltar ao catálogo</Link>

      <div className="produto-detalhe__grid">
        <div>
          <img
            className="produto-detalhe__img"
            src={produto.imagem}
            alt={produto.nome}
          />
        </div>
        <div className="produto-detalhe__info">
          <BadgeCategoria categoria={produto.categoria} />
          <h1 className="produto-detalhe__nome">{produto.nome}</h1>
          <p className="produto-detalhe__descricao">{produto.descricao}</p>
          <span className="produto-detalhe__preco">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
          <div className="produto-detalhe__meta">
            <div className="produto-detalhe__nota">
              <span className="produto-detalhe__nota-num">★ {produto.nota?.toFixed(1) || '—'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                ({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
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

      <section className="avaliacoes-section">
        <h2>Avaliações dos clientes</h2>
        {avaliacoes.length === 0 ? (
          <p className="avaliacoes-vazias">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        ) : (
          <div className="avaliacoes-lista">
            {avaliacoes.map((aval) => (
              <div key={aval.id} className="avaliacao-card">
                <div className="avaliacao-card__header">
                  <span className="avaliacao-card__usuario">{aval.usuarioNome}</span>
                  <span className="avaliacao-card__data">{formatarData(aval.data)}</span>
                </div>
                <div className="avaliacao-card__estrelas">
                  {'★'.repeat(aval.nota)}{'☆'.repeat(5 - aval.nota)}
                  <span className="avaliacao-card__nota-num"> {aval.nota}/5</span>
                </div>
                <p className="avaliacao-card__comentario">"{aval.comentario}"</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProdutoDetalhe;

