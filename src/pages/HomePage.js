
import React from 'react';
import Banner from '../components/home/Banner'; 
import TopProducts from '../components/home/TopProducts'; 
import CategorySection from '../components/home/CategorySection'; 

// Componente funcional da página inicial
const HomePage = () => {
  return (
    // Estrutura principal da página inicial
    <div className="home-page">
      <Banner /> {/* Mostra o banner de destaque no topo da página */}
      <CategorySection /> {/* Secção com categorias ou destaques de navegação */}
      <TopProducts /> {/* Lista de produtos populares ou recomendados */}
    </div>
  );
};

// Exportação do componente para ser utilizado noutras partes da aplicação
export default HomePage;
