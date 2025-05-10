// src/components/layout/SideMenu.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose, initialCategory, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [subMenuAnimation, setSubMenuAnimation] = useState('');
  const [menuAnimation, setMenuAnimation] = useState('');
  const menuRef = useRef(null);

  // Efeito para inicializar a categoria quando o componente é montado ou quando initialCategory muda
  useEffect(() => {
    if (isOpen) {
      setActiveCategory(initialCategory);
      // Garantir que as animações comecem corretamente
      requestAnimationFrame(() => {
        setSubMenuAnimation('slide-in');
        setMenuAnimation('slide-in');
      });
    }
  }, [isOpen, initialCategory]);

  // Função para fechar o menu com animação
  const handleClose = () => {
    setMenuAnimation('slide-out');
    setSubMenuAnimation('slide-out');
    
    // Esperar a animação terminar antes de chamar onClose
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // Função para fechar o menu quando o mouse sai
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

  // Definindo as subcategorias e seus respectivos caminhos de URL
  const categories = {
    mulher: [
      { name: 'TODOS OS ARTIGOS', path: '/mulher/products' },
      { name: 'CAMISAS', path: '/mulher/camisas' },
      { name: 'T-SHIRTS', path: '/mulher/tshirt' },
      { name: 'JEANS', path: '/mulher/jeans' },
      { name: 'CALÇAS', path: '/mulher/calcas' },
      { name: 'CASACOS', path: '/mulher/casacos' },
      { name: 'SAPATOS', path: '/mulher/sapatos' },
      { name: 'VESTIDOS', path: '/mulher/vestidos' },
      { name: 'ACESSÓRIOS', path: '/mulher/acessorios' },
      { name: 'MALHA', path: '/mulher/malha' }
    ],
    homem: [
      { name: 'TODOS OS ARTIGOS', path: '/homem/products' },
      { name: 'CAMISAS', path: '/homem/camisas' },
      { name: 'T-SHIRTS', path: '/homem/tshirtM' },
      { name: 'JEANS', path: '/homem/jeans' },
      { name: 'CALÇAS', path: '/homem/calcas' },
      { name: 'CASACOS', path: '/homem/casacos' },
      { name: 'SAPATOS', path: '/homem/sapatos' },
      { name: 'SWEATSHIRTS', path: '/homem/sweatshirts' },
      { name: 'FATOS', path: '/homem/fatos' },
      { name: 'ACESSÓRIOS', path: '/homem/acessorios' }
    ],
    beauty: [
      { name: 'TODOS OS ARTIGOS', path: '/beauty/products' },
      { name: 'MAKEUP', path: '/beauty/makeup' },
      { name: 'PERFUMES', path: '/beauty/perfumes' },
      { name: 'SKINCARE', path: '/beauty/skincare' }
    ]
  };

  // Se o menu não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  return (
    <div 
      className="side-menu-wrapper" 
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <div className={`side-menu ${menuAnimation}`}>
        {/* Menu de navegação do topo (sem X) */}
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
          {/* Subcategorias */}
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