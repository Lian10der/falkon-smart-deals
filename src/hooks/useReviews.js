import { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:3001';
const BONUS_AVALIACAO = 5.00;

/**
 * Custom Hook: useReviews
 * Centraliza toda a lógica de negócio do Portal de Reviews:
 * - Busca pedidos do usuário com produto associado
 * - Busca dados do usuário (saldo da carteira)
 * - Envia avaliação e credita bônus de R$5,00 automaticamente
 */
export function useReviews(usuarioId) {
  const [usuario, setUsuario] = useState(null);
  const [pedidosComProduto, setPedidosComProduto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarDados = useCallback(async () => {
    if (!usuarioId) {
      setLoading(false);
      setUsuario(null);
      setPedidosComProduto([]);
      return;
    }
    setLoading(true);
    setErro(null);
    try {
      const [usuarioRes, pedidosRes, produtosRes, avaliacoesRes] = await Promise.all([
        fetch(`${API}/usuarios/${usuarioId}`),
        fetch(`${API}/pedidos?usuarioId=${usuarioId}`),
        fetch(`${API}/produtos`),
        fetch(`${API}/avaliacoes`),
      ]);

      if (!usuarioRes.ok) throw new Error('Usuário não encontrado.');

      const usuarioData = await usuarioRes.json();
      const pedidosData = await pedidosRes.json();
      const produtosData = await produtosRes.json();
      const avaliacoesData = await avaliacoesRes.json();

      // Mescla pedidos com produto e verifica se já foi avaliado
      const pedidosEnriquecidos = pedidosData.map((pedido) => {
        const produto = produtosData.find((p) => p.id === pedido.produtoId);
        const avaliacao = avaliacoesData.find(
          (a) => a.pedidoId === pedido.id && a.usuarioId === usuarioId
        );
        return { ...pedido, produto, avaliacao: avaliacao || null };
      });

      setUsuario(usuarioData);
      setPedidosComProduto(pedidosEnriquecidos);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  /**
   * Envia avaliação para o banco e credita R$5,00 no saldo do usuário.
   * Retorna { sucesso: true } ou lança erro.
   */
  const enviarAvaliacao = useCallback(
    async ({ pedidoId, produtoId, nota, comentario }) => {
      // 1. Grava a avaliação no banco
      const avaliacaoRes = await fetch(`${API}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          produtoId,
          usuarioId,
          nota,
          comentario,
          data: new Date().toISOString().split('T')[0],
        }),
      });
      if (!avaliacaoRes.ok) throw new Error('Falha ao gravar avaliação.');

      // 2. Atualiza o saldo do usuário com o bônus
      const novoSaldo = (usuario?.carteira_saldo || 0) + BONUS_AVALIACAO;
      const saldoRes = await fetch(`${API}/usuarios/${usuarioId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carteira_saldo: novoSaldo }),
      });
      if (!saldoRes.ok) throw new Error('Falha ao creditar bônus.');

      // Recarrega os dados para refletir as mudanças
      await carregarDados();
      return { sucesso: true };
    },
    [usuario, usuarioId, carregarDados]
  );

  return { usuario, pedidosComProduto, loading, erro, enviarAvaliacao, recarregar: carregarDados };
}
