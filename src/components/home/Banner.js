// Banner.js

// Importação do React
import React from 'react';
// Importação do Link do React Router para navegação
import { Link } from 'react-router-dom';
// Importação do ficheiro CSS local
import './Banner.css';

// Definição do componente funcional Banner
const Banner = () => {
  return (
    // Secção principal do banner
    <section className="main-banner">
      {/* Contentor da imagem de fundo */}
      <div className="banner-container">
        {/* Área do conteúdo do banner */}
        <div className="banner-content">
          {/* Link que direciona para a página de produtos de mulher */}
          <Link to="/mulher/products">
            {/* Botão com texto em maiúsculas */}
            <button className="banner-button">TODOS OS PRODUTOS</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Exportação do componente para uso noutros ficheiros
export default Banner;