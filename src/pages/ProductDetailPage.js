import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Componente funcional que representa a página de detalhe de um produto
const ProductDetailPage = () => {
  // useParams permite aceder ao parâmetro dinâmico "id" definido na rota
  const { id } = useParams();

  // useNavigate permite navegar programaticamente entre páginas
  const navigate = useNavigate();

  return (
    <div>
      <h1>Página do Produto {id}</h1>

      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

// Exportação do componente para que possa ser usado no sistema de rotas
export default ProductDetailPage;
