import '../styles/StarRating.css';

/**
 * Componente reutilizável: StarRating
 * Modo display: apenas exibe estrelas preenchidas baseado na nota.
 * Modo interativo: permite ao usuário selecionar uma nota de 1 a 5.
 */
function StarRating({ nota, onSelect, interativo = false, tamanho = 'medio' }) {
  const estrelas = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating star-rating--${tamanho}`} aria-label={`Nota: ${nota} de 5`}>
      {estrelas.map((valor) => {
        const preenchida = valor <= Math.round(nota);
        const parcial = !interativo && valor - 0.5 <= nota && nota < valor;

        return (
          <button
            key={valor}
            type="button"
            className={`star ${preenchida ? 'star--on' : ''} ${parcial ? 'star--parcial' : ''}`}
            onClick={interativo ? () => onSelect(valor) : undefined}
            disabled={!interativo}
            aria-label={`${valor} estrela${valor > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
