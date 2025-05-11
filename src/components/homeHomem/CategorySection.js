import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySectionHomem.css';

import camisaImg from '../../assets/images/categories/Camisa-Homem.jpg'; 
import tshirtImg from '../../assets/images/categories/Tshirt-Homem.jpg';
import casacoImg from '../../assets/images/categories/Casaco-Homem.jpg';
import jeansImg from '../../assets/images/categories/Jeans-Homem.jpg';
import calcasImg from '../../assets/images/categories/Calcas-Homem.jpg';

const CategorySectionHomem = () => {
  const categories = [
    { id: 1, name: 'CAMISA', image: camisaImg, link: '/homem/camisas' },
    { id: 2, name: 'T-SHIRT', image: tshirtImg, link: '/homem/tshirtM' },
    { id: 3, name: 'CASACO', image: casacoImg, link: '/homem/casacos' },
    { id: 4, name: 'JEANS', image: jeansImg, link: '/homem/jeans' },
    { id: 5, name: 'CALÇAS', image: calcasImg, link: '/homem/calcas' }
  ];

  return (
    <section className="categories-section-homem">
      <div className="pack-bags-section">
        <h2 className="bags-title">PACK YOUR BAGS</h2>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <Link
            to={category.link}
            className="category-item"
            key={category.id}
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySectionHomem;
