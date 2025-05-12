
import React from 'react';
import Banner from '../components/homeBeauty/Banner'; // Componente do banner principal para a área de beauty
import TopProducts from '../components/homeBeauty/TopProducts'; // Componente com os produtos mais populares ou recomendados da secção de beleza
import CategorySection from '../components/homeBeauty/CategorySection'; // Não tá a ser usado

// Componente funcional para a página inicial da secção de beauty
const HomePage = () => {
  return (
    <div className="home-page">
      <Banner /> {/* Mostra o banner principal da página de beauty */}
      <TopProducts /> {/* Mostra os produtos em destaque ou mais vendidos na secção de beauty */}
      {/* CategorySection está importado, mas não está incluído aqui. Se não for necessário, pode ser removido. */}
    </div>
  );
};


export default HomePage;
