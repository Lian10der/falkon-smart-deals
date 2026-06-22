import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import StarRating from '../components/StarRating';
import BadgeCategoria from '../components/BadgeCategoria';
import { USUARIO_ID } from '../App';
import '../styles/PaginaAvaliacao.css';

function PaginaAvaliacao() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const { usuario, pedidosComProduto, loading, erro, enviarAvaliacao } = useReviews(USUARIO_ID);

  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  const pedido = pedidosComProduto.find((p) => p.id === pedidoId);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Carregando produto…</p>
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="erro-state">
        <p>⚠️ {erro || 'Pedido não encontrado.'}</p>
        <button onClick={() => navigate('/')}>← Voltar</button>
      </div>
    );
  }

  const { produto, avaliacao } = pedido;

  // Se já avaliou, mostra tela de confirmação
  if (avaliacao) {
    return (
      <div className="pagina-avaliacao pagina-avaliacao--ja-avaliado">
        <header className="pag-aval__header">
          <button className="btn-voltar" onClick={() => navigate('/')}>← Voltar</button>
          <span className="logo-falkon-sm">FALKON</span>
        </header>
        <div className="ja-avaliado-msg">
          <span className="check-grande">✓</span>
          <h2>Você já avaliou este produto!</h2>
          <p>Sua nota: <strong>{avaliacao.nota}/5</strong></p>
          <p className="ja-avaliado-comentario">"{avaliacao.comentario}"</p>
          <button className="btn-voltar-lista" onClick={() => navigate('/')}>Ver outras compras</button>
        </div>
      </div>
    );
  }

  const handleEnviar = async () => {
    if (notaSelecionada === 0) {
      setErroEnvio('Selecione uma nota antes de enviar.');
      return;
    }
    if (comentario.trim().length < 10) {
      setErroEnvio('Escreva um comentário com pelo menos 10 caracteres.');
      return;
    }

    setEnviando(true);
    setErroEnvio(null);
    try {
      await enviarAvaliacao({
        pedidoId: pedido.id,
        produtoId: produto.id,
        nota: notaSelecionada,
        comentario: comentario.trim(),
      });
      setSucesso(true);
    } catch (err) {
      setErroEnvio('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Tela de sucesso pós-envio
  if (sucesso) {
    return (
      <div className="pagina-avaliacao pagina-avaliacao--sucesso">
        <div className="sucesso-container">
          <div className="sucesso-icone">⚡</div>
          <h2 className="sucesso-titulo">Avaliação enviada!</h2>
          <p className="sucesso-bonus">
            <strong>+R$ 5,00</strong> creditados na sua carteira
          </p>
          <p className="sucesso-saldo">
            Novo saldo:{' '}
            <strong>R$ {usuario?.carteira_saldo?.toFixed(2).replace('.', ',')}</strong>
          </p>
          <button className="btn-voltar-lista" onClick={() => navigate('/')}>
            ← Voltar às compras
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-avaliacao">
      <header className="pag-aval__header">
        <button className="btn-voltar" onClick={() => navigate('/')}>← Voltar</button>
        <span className="logo-falkon-sm">FALKON</span>
      </header>

      <div className="pag-aval__conteudo">
        {/* Detalhes do produto */}
        <section className="produto-detalhe">
          <BadgeCategoria categoria={produto.categoria} />
          <h1 className="produto-detalhe__nome">{produto.nome}</h1>
          <p className="produto-detalhe__descricao">{produto.descricao}</p>

          <div className="produto-detalhe__meta">
            <div className="produto-detalhe__nota-comunidade">
              <span className="meta-label">Nota da comunidade</span>
              <div className="meta-nota-row">
                <StarRating nota={produto.nota} tamanho="medio" />
                <span className="meta-nota-num">{produto.nota.toFixed(1)}</span>
              </div>
            </div>
            <div className="produto-detalhe__preco">
              <span className="meta-label">Valor pago</span>
              <span className="meta-preco">
                R$ {pedido.valor_pago.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </section>

        {/* Formulário de avaliação */}
        <section className="formulario-avaliacao">
          <h2 className="form-titulo">Sua avaliação</h2>
          <p className="form-bonus-aviso">
            🎯 Envie sua review e ganhe <strong>R$ 5,00</strong> na carteira
          </p>

          <div className="form-grupo">
            <label className="form-label">Nota</label>
            <div className="form-estrelas">
              <StarRating
                nota={notaSelecionada}
                onSelect={setNotaSelecionada}
                interativo
                tamanho="grande"
              />
              {notaSelecionada > 0 && (
                <span className="nota-label-texto">
                  {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][notaSelecionada]}
                </span>
              )}
            </div>
          </div>

          <div className="form-grupo">
            <label className="form-label" htmlFor="comentario">
              Comentário técnico
            </label>
            <textarea
              id="comentario"
              className="form-textarea"
              placeholder="Compartilhe sua experiência com outros devs e gamers…"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={5}
              maxLength={500}
            />
            <span className="form-contador">{comentario.length}/500</span>
          </div>

          {erroEnvio && <p className="form-erro">⚠️ {erroEnvio}</p>}

          <button
            className="btn-enviar"
            onClick={handleEnviar}
            disabled={enviando}
          >
            {enviando ? 'Enviando…' : 'Enviar avaliação e receber R$ 5,00'}
          </button>
        </section>
      </div>
    </div>
  );
}

export default PaginaAvaliacao;
