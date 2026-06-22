import { useReviews } from '../hooks/useReviews';
import CardPedido from '../components/CardPedido';
import { USUARIO_ID } from '../App';
import '../styles/PaginaInicial.css';

function PaginaInicial() {
  const { usuario, pedidosComProduto, loading, erro } = useReviews(USUARIO_ID);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando seus pedidos…</p>
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

  const totalAvaliados = pedidosComProduto.filter((p) => p.avaliacao).length;
  const bonusAcumulado = totalAvaliados * 5;

  return (
    <div className="pagina-inicial">
      {/* Header da página */}
      <header className="pagina-inicial__header">
        <div className="pagina-inicial__logo">
          <span className="logo-falkon">FALKON</span>
          <span className="logo-tag">// community</span>
        </div>
        <div className="pagina-inicial__usuario">
          <div className="usuario-info">
            <span className="usuario-info__nivel">{usuario?.nivel?.toUpperCase()}</span>
            <span className="usuario-info__nome">{usuario?.nome}</span>
          </div>
        </div>
      </header>

      {/* Big numbers — saldo em destaque */}
      <section className="pagina-inicial__bignumbers">
        <div className="bignum">
          <span className="bignum__valor">
            R$ {usuario?.carteira_saldo?.toFixed(2).replace('.', ',')}
          </span>
          <span className="bignum__label">saldo na carteira</span>
        </div>
        <div className="bignum bignum--secundario">
          <span className="bignum__valor">{pedidosComProduto.length}</span>
          <span className="bignum__label">compras realizadas</span>
        </div>
        <div className="bignum bignum--secundario">
          <span className="bignum__valor bignum__valor--bonus">
            +R$ {bonusAcumulado.toFixed(2).replace('.', ',')}
          </span>
          <span className="bignum__label">bônus ganhos em reviews</span>
        </div>
      </section>

      {/* CTA de incentivo */}
      <section className="pagina-inicial__cta">
        <p className="cta-texto">
          Avalie seus produtos e ganhe{' '}
          <strong className="cta-bonus">R$ 5,00</strong> por avaliação direto na sua carteira.
        </p>
      </section>

      {/* Lista de pedidos */}
      <section className="pagina-inicial__lista">
        <h2 className="lista-titulo">Suas compras</h2>
        {pedidosComProduto.length === 0 ? (
          <p className="lista-vazia">Nenhuma compra encontrada.</p>
        ) : (
          <div className="lista-grid">
            {pedidosComProduto.map((pedido) => (
              <CardPedido key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PaginaInicial;
