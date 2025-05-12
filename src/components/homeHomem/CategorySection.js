// CategorySection.js

// Importação do React
import React from 'react';
// Importação do Link do React Router
import { Link } from 'react-router-dom';
// Importação do ficheiro CSS específico para categorias de homem
import './CategorySectionHomem.css';

// Importação das imagens usando import estático
import camisaImg from '../../assets/images/categories/Camisa-Homem.jpg'; 
import tshirtImg from '../../assets/images/categories/Tshirt-Homem.jpg';
import casacoImg from '../../assets/images/categories/Casaco-Homem.jpg';
import jeansImg from '../../assets/images/categories/Jeans-Homem.jpg';
import calcasImg from '../../assets/images/categories/Calcas-Homem.jpg';

// Definição do componente funcional CategorySectionHomem
const CategorySectionHomem = () => {
  // Array com os dados das categorias para homem
  const categories = [
    { id: 1, name: 'CAMISA', image: camisaImg, link: '/homem/camisas' },        // Categoria de camisas
    { id: 2, name: 'T-SHIRT', image: tshirtImg, link: '/homem/tshirt' },        // Categoria de t-shirts
    { id: 3, name: 'CASACO', image: casacoImg, link: '/homem/casacos' },        // Categoria de casacos
    { id: 4, name: 'JEANS', image: jeansImg, link: '/homem/jeans' },            // Categoria de jeans
    { id: 5, name: 'CALÇAS', image: calcasImg, link: '/homem/calcas' }          // Categoria de calças
  ];

  return (
    // Secção principal das categorias de homem
    <section className="categories-section-homem">
      {/* Secção do título "PACK YOUR BAGS" */}
      <div className="pack-bags-section">
        <h2 className="bags-title">PACK YOUR BAGS</h2>
      </div>

      {/* Grelha com as categorias */}
      <div className="categories-grid">
        {/* Mapeamento das categorias para criar links */}
        {categories.map(category => (
          <Link
            to={category.link}           // Destino do link
            className="category-item"    // Classe CSS aplicada
            key={category.id}           // Chave única para o React
          >
            {/* Contentor da imagem */}
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            {/* Título da categoria */}
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

// Exportação do componente
export default CategorySectionHomem;