import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaInicial from './routes/PaginaInicial';
import PaginaAvaliacao from './routes/PaginaAvaliacao';

// Usuário logado fixo para simulação (Bruno Souza, que tem pedidos entregues)
export const USUARIO_ID = '2';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/avaliar/:pedidoId" element={<PaginaAvaliacao />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
