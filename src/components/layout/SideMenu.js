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
      { name: 'CAMISAS', path: '/produtos/mulher/camisas' },
      { name: 'T-SHIRTS', path: '/produtos/mulher/t-shirts' },
      { name: 'JEANS', path: '/produtos/mulher/jeans' },
      { name: 'CALÇAS', path: '/produtos/mulher/calcas' },
      { name: 'CASACOS', path: '/produtos/mulher/casacos' },
      { name: 'SAPATOS', path: '/produtos/mulher/sapatos' },
      { name: 'VESTIDOS', path: '/produtos/mulher/vestidos' },
      { name: 'ACESSÓRIOS', path: '/produtos/mulher/acessorios' },
      { name: 'MALHA', path: '/produtos/mulher/malha' }
    ],
    homem: [
      { name: 'CAMISAS', path: '/produtos/homem/camisas' },
      { name: 'T-SHIRTS', path: '/produtos/homem/t-shirts' },
      { name: 'JEANS', path: '/produtos/homem/jeans' },
      { name: 'CALÇAS', path: '/produtos/homem/calcas' },
      { name: 'CASACOS', path: '/produtos/homem/casacos' },
      { name: 'SAPATOS', path: '/produtos/homem/sapatos' },
      { name: 'SWEATSHIRTS', path: '/produtos/homem/sweatshirts' },
      { name: 'FATOS', path: '/produtos/homem/fatos' },
      { name: 'ACESSÓRIOS', path: '/produtos/homem/acessorios' }
    ],
    beauty: [
      { name: 'MAKEUP', path: '/produtos/beauty/makeup' },
      { name: 'PERFUMES', path: '/produtos/beauty/perfumes' },
      { name: 'SKINCARE', path: '/produtos/beauty/skincare' }
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