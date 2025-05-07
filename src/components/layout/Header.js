import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import SearchModal from '../search/SearchModal';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [subMenuAnimation, setSubMenuAnimation] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = {
    mulher: ['CAMISAS', 'T-SHIRTS', 'JEANS', 'CALÇAS', 'CASACOS', 'SAPATOS', 'VESTIDOS', 'ACESSÓRIOS', 'MALHA'],
    homem: ['CAMISAS', 'T-SHIRTS', 'JEANS', 'CALÇAS', 'CASACOS', 'SAPATOS', 'SWEATSHIRTS', 'FATOS', 'ACESSÓRIOS'],
    beauty: ['MAKEUP', 'PERFUMES', 'SKINCARE']
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSubcategory = (category) => {
    if (activeCategory === category) return;
    setSubMenuAnimation('slide-out');
    setTimeout(() => {
      setActiveCategory(category);
      setSubMenuAnimation('slide-in');
    }, 300);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(true); setActiveCategory('mulher'); }}>MULHER</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(true); setActiveCategory('homem'); }}>HOMEM</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(true); setActiveCategory('beauty'); }}>BEAUTY</a>
        </div>

        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>

        <div className="header-right">
          <a href="#" onClick={(e) => { e.preventDefault(); setSearchOpen(true); }}>PESQUISAR</a>
          <Link to="/login">INICIAR SESSÃO</Link>
          <Link to="/favorites">FAVORITOS (0)</Link>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>

      {/* Menu lateral de categorias */}
      {menuOpen && (
        <div className="side-menu-wrapper">
          <div className="side-menu">
            <button className="close-menu-button" onClick={() => setMenuOpen(false)}>×</button>
            <div className="main-categories">
              {Object.keys(categories).map((cat) => (
                <a
                  href="#"
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); toggleSubcategory(cat); }}
                >
                  {cat.toUpperCase()}
                </a>
              ))}
            </div>
            <div className={`subcategories-container ${subMenuAnimation}`}>
              <ul className="category-list">
                {categories[activeCategory].map((item, index) => (
                  <li key={index}>
                    <Link to={`/products?category=${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="side-menu-overlay" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* Modal de Pesquisa */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Header;
