import React from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ category, onClose }) => {
  // Definição das subcategorias para cada categoria principal
  const subcategories = {
    mulher: [
      { name: 'VESTIDOS', path: '/products?category=vestidos' },
      { name: 'T-SHIRTS', path: '/products?category=t-shirts' },
      { name: 'JEANS', path: '/products?category=jeans' },
      { name: 'CALÇAS', path: '/products?category=calcas' },
      { name: 'SAIAS', path: '/products?category=saias' },
      { name: 'CAMISAS', path: '/products?category=camisas' },
      { name: 'CASACOS', path: '/products?category=casacos' },
      { name: 'SAPATOS', path: '/products?category=sapatos' },
      { name: 'ACESSÓRIOS', path: '/products?category=acessorios' },
      { name: 'PERFUMES', path: '/products?category=perfumes' }
    ],
    homem: [
      { name: 'CAMISAS', path: '/products?category=camisas-homem' },
      { name: 'T-SHIRTS', path: '/products?category=t-shirts-homem' },
      { name: 'JEANS', path: '/products?category=jeans-homem' },
      { name: 'CALÇAS', path: '/products?category=calcas-homem' },
      { name: 'CASACOS', path: '/products?category=casacos-homem' },
      { name: 'SAPATOS', path: '/products?category=sapatos-homem' },
      { name: 'ACESSÓRIOS', path: '/products?category=acessorios-homem' },
      { name: 'PERFUMES', path: '/products?category=perfumes-homem' }
    ],
    beauty: [
      { name: 'MAKEUP', path: '/products?category=makeup' },
      { name: 'SKINCARE', path: '/products?category=skincare' },
      { name: 'CABELO', path: '/products?category=cabelo' },
      { name: 'PERFUMES', path: '/products?category=perfumes-beauty' }
    ],
    
  };

  return (
    <div className="side-menu-overlay">
      <div className="side-menu">
        <div className="side-menu-header">
          <h2>{category.toUpperCase()}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <ul className="side-menu-items">
          {subcategories[category].map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                onClick={onClose}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;