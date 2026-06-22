import '../styles/BadgeCategoria.css';

const labelMap = {
  perifericos: 'Periféricos',
  monitores: 'Monitores',
  geek: 'Geek',
  livros: 'Livros',
};

/**
 * Componente reutilizável: BadgeCategoria
 * Exibe o rótulo da categoria do produto com cor temática.
 */
function BadgeCategoria({ categoria }) {
  return (
    <span className={`badge-categoria badge-categoria--${categoria}`}>
      {labelMap[categoria] || categoria}
    </span>
  );
}

export default BadgeCategoria;
