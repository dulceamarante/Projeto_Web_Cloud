import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      id: 1,
      name: 'DRESSES',
      image: '/assets/images/categories/vestido.jpg',
      link: '/products?category=vestidos'
    },
    {
      id: 2,
      name: 'SHOES',
      image: '/assets/images/categories/sapatos.jpg',
      link: '/products?category=sapatos'
    },
    {
      id: 3,
      name: 'T-SHIRTS',
      image: '/assets/images/categories/tshirt.jpg',
      link: '/products?category=tshirts'
    },
    {
      id: 4,
      name: 'COATS',
      image: '/assets/images/categories/coat.jpg',
      link: '/products?category=coats'
    },
    {
      id: 5,
      name: 'JEANS',
      image: '/assets/images/categories/jeans.jpg',
      link: '/products?category=jeans'
    }
  ];

  return (
    <section className="categories-section">
      <div className="responsibility-section">
        <div className="responsibility-content">
          <h2>OUR SENSE OF RESPONSIBILITY</h2>
          <button className="outline-button">DISCOVER MORE</button>
        </div>
      </div>
      
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

export default CategorySection;