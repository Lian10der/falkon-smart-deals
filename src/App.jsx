import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PaginaInicial from './routes/PaginaInicial';
import PaginaAvaliacao from './routes/PaginaAvaliacao';
import Login from './routes/Login';
import Cadastro from './routes/Cadastro';
import Produtos from './routes/Produtos';
import ProdutoDetalhe from './routes/ProdutoDetalhe';
import AdminUsuarios from './routes/AdminUsuarios';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/avaliar/:pedidoId" element={<PaginaAvaliacao />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

