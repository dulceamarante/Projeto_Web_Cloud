// src/pages/ProductDetailPage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Página do Produto {id}</h1>
      <button onClick={() => navigate(-1)}>Voltar</button>
      {/* Adicione aqui o conteúdo da página de detalhe do produto */}
    </div>
  );
};

export default ProductDetailPage;