import React from 'react';
import Banner from '../components/homeHomem/Banner'; // Componente do banner principal para a página Homem
import TopProducts from '../components/homeHomem/TopProducts'; // Componente com os produtos mais populares ou recomendados para homem
import CategorySection from '../components/homeHomem/CategorySection'; // Componente com as categorias disponíveis para homem

// Componente funcional que representa a página inicial da secção "Homem"
const HomePage = () => {
  return (
    <div className="home-page">
      <Banner /> 
      <CategorySection /> 
      <TopProducts /> 
    </div>
  );
};


export default HomePage;
