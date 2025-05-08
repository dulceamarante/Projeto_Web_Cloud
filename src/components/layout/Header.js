// src/components/layout/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchModal from '../search/SearchModal';
import FavoritesPopOver from './FavoritesPopOver';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [subMenuAnimation, setSubMenuAnimation] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const { favorites } = useContext(FavoritesContext);

  // Fecha qualquer pop‐over/modal ao carregar Esc
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setFavOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const toggleSubcategory = category => {
    if (activeCategory === category) return;
    setSubMenuAnimation('slide-out');
    setTimeout(() => {
      setActiveCategory(category);
      setSubMenuAnimation('slide-in');
    }, 300);
  };

  const categories = {
    mulher: ['CAMISAS','T-SHIRTS','JEANS','CALÇAS','CASACOS','SAPATOS','VESTIDOS','ACESSÓRIOS','MALHA'],
    homem:  ['CAMISAS','T-SHIRTS','JEANS','CALÇAS','CASACOS','SAPATOS','SWEATSHIRTS','FATOS','ACESSÓRIOS'],
    beauty: ['MAKEUP','PERFUMES','SKINCARE']
  };

  return (
    <>
      <header className="header">
        {/* Left: categorias principais */}
        <div className="header-left">
          {Object.keys(categories).map(cat => (
            <a
              href="#"
              key={cat}
              onClick={e => {
                e.preventDefault();
                setMenuOpen(true);
                setActiveCategory(cat);
              }}
            >
              {cat.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Center: logo */}
        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>

        {/* Right: pesquisar, sessão, favoritos e cesta */}
        <div className="header-right">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setSearchOpen(true);
            }}
          >
            PESQUISAR
          </a>
          <Link to="/login">INICIAR SESSÃO</Link>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setFavOpen(o => !o);
            }}
          >
            FAVORITOS ({favorites.length})
          </a>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>

      {/* Menu lateral de categorias */}
      {menuOpen && (
        <div className="side-menu-wrapper">
          <div className="side-menu">
            <button
              className="close-menu-button"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
            <div className="main-categories">
              {Object.keys(categories).map(cat => (
                <a
                  href="#"
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    toggleSubcategory(cat);
                  }}
                >
                  {cat.toUpperCase()}
                </a>
              ))}
            </div>
            <div className={`subcategories-container ${subMenuAnimation}`}>
              <ul className="category-list">
                {categories[activeCategory].map((sub, i) => (
                  <li key={i}>
                    <Link
                      to={`/products?category=${sub.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="side-menu-overlay"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}

      {/* Modal de pesquisa */}
      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} />
      )}

      {/* Pop-over de favoritos */}
      {favOpen && (
        <FavoritesPopOver onClose={() => setFavOpen(false)} />
      )}
    </>
  );
};

export default Header;
