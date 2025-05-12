
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose, initialCategory, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [subMenuAnimation, setSubMenuAnimation] = useState('');
  const [menuAnimation, setMenuAnimation] = useState('');
  const menuRef = useRef(null);


  useEffect(() => {
    if (isOpen) {
      setActiveCategory(initialCategory);

      requestAnimationFrame(() => {
        setSubMenuAnimation('slide-in');
        setMenuAnimation('slide-in');
      });
    }
  }, [isOpen, initialCategory]);


  const handleClose = () => {
    setMenuAnimation('slide-out');
    setSubMenuAnimation('slide-out');
    

    setTimeout(() => {
      onClose();
    }, 800);
  };


  const handleMouseLeave = () => {
    handleClose();
  };

  const toggleSubcategory = category => {
    if (activeCategory === category) return;
    
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    
    setSubMenuAnimation('slide-out');
    setTimeout(() => {
      setActiveCategory(category);
      setSubMenuAnimation('slide-in');
    }, 800);
  };


  const categories = {
    mulher: [
      { name: 'TODOS OS ARTIGOS', path: '/mulher/products' },
      { name: 'CAMISAS', path: '/mulher/camisas' },
      { name: 'T-SHIRTS', path: '/mulher/tshirt' },
      { name: 'JEANS', path: '/mulher/jeans' },
      { name: 'CALÇAS', path: '/mulher/calcas' },
      { name: 'CASACOS', path: '/mulher/casacos' },
      { name: 'VESTIDOS', path: '/mulher/vestidos' },
      { name: 'SAIAS', path: '/mulher/saias' }
    ],
    homem: [
      { name: 'TODOS OS ARTIGOS', path: '/homem/products' },
      { name: 'CAMISAS', path: '/homem/camisas' },
      { name: 'T-SHIRTS', path: '/homem/tshirt' },
      { name: 'JEANS', path: '/homem/jeans' },
      { name: 'CALÇAS', path: '/homem/calcas' },
      { name: 'CASACOS', path: '/homem/casacos' }
    ],
    beauty: [
      { name: 'TODOS OS ARTIGOS', path: '/beauty/products' },
      { name: 'MAKEUP', path: '/beauty/makeup' },
      { name: 'PERFUMES', path: '/beauty/perfumes' },
      { name: 'SKINCARE', path: '/beauty/skincare' }
    ]
  };


  if (!isOpen) return null;

  return (
    <div 
      className="side-menu-wrapper" 
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <div className={`side-menu ${menuAnimation}`}>

        <div className="nav-top-bar">
          <span 
            className={activeCategory === 'mulher' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('mulher')}
          >
            MULHER
          </span>
          <span 
            className={activeCategory === 'homem' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('homem')}
          >
            HOMEM
          </span>
          <span 
            className={activeCategory === 'beauty' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('beauty')}
          >
            BEAUTY
          </span>
        </div>
        
        <div className="side-menu-content">

          <div className={`subcategories-container ${subMenuAnimation}`}>
            <ul className="category-list">
              {categories[activeCategory].map((sub, i) => (
                <li key={i}>
                  <Link to={sub.path} onClick={handleClose}>
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div 
        className={`side-menu-overlay ${menuAnimation === 'slide-out' ? 'fade-out' : 'fade-in'}`} 
        onClick={handleClose} 
      />
    </div>
  );
};

export default SideMenu;