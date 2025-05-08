import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'VESTIDOS',
      image: "/assets/images/categories/vestido.png",
      link: '/products?category=vestidos'
    },
    {
      id: 2,
      name: 'SAPATOS',
      image: "/assets/images/categories/sapatos.png",
      link: '/products?category=sapatos'
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
    <section className="categories-section">

<div className="pack-bags-section">
        <h2 className="bags-title">PACK YOR BAGS</h2>
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

export default CategorySection;