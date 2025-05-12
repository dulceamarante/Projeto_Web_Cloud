// CategorySection.js

// Importação do React
import React from 'react';
// Importação do Link do React Router
import { Link } from 'react-router-dom';
// Importação do ficheiro CSS local
import './CategorySection.css';

// Definição do componente funcional CategorySection
const CategorySection = () => {
  // Array com os dados das categorias
  const categories = [
    {
      id: 1,                                           // Identificador único
      name: 'VESTIDOS',                               // Nome da categoria
      image: "/assets/images/categories/vestido.png", // Caminho da imagem
      link: '/products?category=vestidos'             // Link com parâmetro de consulta
    },
    {
      id: 2,
      name: 'SAIAS',
      image: "/assets/images/categories/saias.png",
      link: '/products?category=saias'
    },
    {
      id: 3,
      name: 'T-SHIRTS',
      image: "/assets/images/categories/tshirt.png",
      link: '/products?category=tshirts'
    },
    {
      id: 4,
      name: 'CASACOS',
      image: "/assets/images/categories/casaco.png",
      link: '/products?category=coats'
    },
    {
      id: 5,
      name: 'JEANS',
      image: "/assets/images/categories/jeans.png",
      link: '/products?category=jeans'
    }
  ];

  return (
    // Secção principal das categorias
    <section className="categories-section">
      {/* Secção do título "PACK YOUR BAGS" */}
      <div className="pack-bags-section">
        <h2 className="bags-title">PACK YOR BAGS</h2>
      </div>
      
      {/* Grelha com as categorias */}
      <div className="categories-grid">
        {/* Mapeamento das categorias para criar links */}
        {categories.map(category => (
          <Link 
            to={category.link}           // Destino do link com parâmetros
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
export default CategorySection;