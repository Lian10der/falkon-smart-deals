import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import BadgeCategoria from './BadgeCategoria';
import '../styles/CardPedido.css';

/**
 * Componente reutilizável: CardPedido
 * Exibe um pedido com produto, nota média, status de avaliação e botão de ação.
 */
function CardPedido({ pedido }) {
  const navigate = useNavigate();
  const { produto, avaliacao, status, data, valor_pago } = pedido;

  if (!produto) return null;

  const jaAvaliou = Boolean(avaliacao);
  const dataFormatada = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR');

  return (
    <article className={`card-pedido ${jaAvaliou ? 'card-pedido--avaliado' : ''}`}>
      <div className="card-pedido__header">
        <BadgeCategoria categoria={produto.categoria} />
        <span className="card-pedido__data">{dataFormatada}</span>
      </div>

      <div className="card-pedido__corpo">
        <h3 className="card-pedido__nome">{produto.nome}</h3>
        <p className="card-pedido__descricao">{produto.descricao}</p>

        <div className="card-pedido__meta">
          <div className="card-pedido__nota-media">
            <span className="card-pedido__nota-label">Nota média</span>
            <StarRating nota={produto.nota} tamanho="pequeno" />
            <span className="card-pedido__nota-num">{produto.nota.toFixed(1)}</span>
          </div>
          <span className="card-pedido__valor">
            R$ {valor_pago.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <div className="card-pedido__rodape">
        {jaAvaliou ? (
          <div className="card-pedido__ja-avaliado">
            <span className="card-pedido__check">✓</span>
            <span>Você avaliou — nota {avaliacao.nota}/5</span>
          </div>
        ) : (
          <button
            className="card-pedido__btn-avaliar"
            onClick={() => navigate(`/avaliar/${pedido.id}`)}
          >
            Avaliar produto · <strong>+R$ 5,00</strong>
          </button>
        )}
      </div>
    </article>
  );
}

export default CardPedido;
