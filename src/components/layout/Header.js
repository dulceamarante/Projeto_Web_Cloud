import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchModal from '../search/SearchModal';
import FavoritesPopOver from './FavoritesPopOver';
import CartPopOver from './CartPopOver';
import SideMenu from './SideMenu';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiHeart, 
  FiShoppingBag 
} from 'react-icons/fi';
import './Header.css';

const Header = () => {
  // Estados locais para controlar interações do utilizador
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Contextos globais de favoritos e carrinho
  const { favorites } = useContext(FavoritesContext);
  const { cart, getCartItemCount } = useContext(CartContext);
  const cartItemCount = getCartItemCount ? getCartItemCount() : cart?.length || 0;

  // Atualiza estado de mobile consoante o tamanho do ecrã
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fecha modais/menus com a tecla Escape
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') {
        if (cartOpen) setCartOpen(false);
        else if (favOpen) setFavOpen(false);
        else if (searchOpen) setSearchOpen(false);
        else if (menuOpen) closeMenuWithAnimation();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen, searchOpen, favOpen, cartOpen]);

  // Categorias e respetivas rotas
  const categories = ['mulher', 'homem', 'beauty'];
  const categoryPages = {
    mulher: '/',
    homem: '/homem',
    beauty: '/beauty'
  };

  // Ações ao passar o rato (apenas em desktop)
  const handleCategoryHover = cat => {
    if (!isMobile) {
      setActiveCategory(cat);
      setMenuOpen(true);
    }
  };

  // Ações ao clicar em categorias
  const handleCategoryClick = cat => {
    setActiveCategory(cat);
    setMenuOpen(true);
  };

  // Ações ao clicar numa categoria a partir da pesquisa
  const handleSearchCategoryClick = (category) => {
    setActiveCategory(category);
    setMenuOpen(true);
  };

  // Fecha o menu lateral com animação
  const closeMenuWithAnimation = () => {
    const sidemenusRef = document.querySelectorAll('.side-menu');
    const subcategoriesRef = document.querySelectorAll('.subcategories-container');
    const overlayRef = document.querySelectorAll('.side-menu-overlay');

    sidemenusRef.forEach(menu => {
      if (menu.classList.contains('slide-in')) {
        menu.classList.replace('slide-in', 'slide-out');
      }
    });

    subcategoriesRef.forEach(sub => {
      if (sub.classList.contains('slide-in')) {
        sub.classList.replace('slide-in', 'slide-out');
      }
    });

    overlayRef.forEach(overlay => {
      if (overlay.classList.contains('fade-in')) {
        overlay.classList.replace('fade-in', 'fade-out');
      }
    });

    setTimeout(() => {
      setMenuOpen(false);
    }, 800);
  };

  return (
    <>
      {/* Cabeçalho principal */}
      <header className="header">
        <div className="header-left">
          {isMobile ? (
            // Botão do menu (hamburger) para mobile
            <button 
              className="mobile-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menu"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          ) : (
            // Navegação de categorias para desktop
            <ul className="desktop-nav">
              {categories.map(cat => (
                <li key={cat} className="header-item">
                  <Link
                    to={categoryPages[cat]}
                    className={menuOpen && activeCategory === cat ? 'active' : ''}
                    onMouseEnter={() => handleCategoryHover(cat)}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat.toUpperCase()}
                  </Link>
                </li>
              ))}
              {menuOpen && (
                <li className="header-item close-button-container">
                  <button
                    className="close-menu-button"
                    onClick={closeMenuWithAnimation}
                    aria-label="Fechar menu"
                  >
                    ×
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Logotipo ao centro */}
        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>

        {/* Ícones ou links à direita (pesquisa, favoritos, carrinho) */}
        <div className="header-right">
          {isMobile ? (
            <>
              <button 
                className="icon-button"
                onClick={() => setSearchOpen(true)}
                aria-label="Pesquisar"
              >
                <FiSearch size={20} />
              </button>
              <button 
                className="icon-button"
                onClick={() => { setFavOpen(!favOpen); if (cartOpen) setCartOpen(false); }}
                aria-label="Favoritos"
              >
                <FiHeart size={20} />
                {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
              </button>
              <button 
                className="icon-button"
                onClick={() => { setCartOpen(!cartOpen); if (favOpen) setFavOpen(false); }}
                aria-label="Carrinho"
              >
                <FiShoppingBag size={20} />
                {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
              </button>
            </>
          ) : (
            <>
              <a href="#" onClick={e => { e.preventDefault(); setSearchOpen(true); }}>PESQUISAR</a>
              <a href="#" onClick={e => { e.preventDefault(); setFavOpen(!favOpen); if (cartOpen) setCartOpen(false); }}>FAVORITOS ({favorites.length})</a>
              <a href="#" onClick={e => { e.preventDefault(); setCartOpen(!cartOpen); if (favOpen) setFavOpen(false); }}>CARRINHO ({cartItemCount})</a>
            </>
          )}
        </div>
      </header>

      {/* Menu lateral mobile */}
      {isMobile && menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenuWithAnimation}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-categories">
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={categoryPages[cat]}
                  className="mobile-category-link"
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveCategory(cat);
                  }}
                >
                  <span>{cat.toUpperCase()}</span>
                  <svg 
                    className="category-arrow" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu lateral de categorias (desktop) */}
      <SideMenu
        isOpen={menuOpen && !isMobile}
        onClose={closeMenuWithAnimation}
        initialCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Modais para pesquisa, favoritos e carrinho */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onCategoryClick={handleSearchCategoryClick} />}
      {favOpen && <FavoritesPopOver onClose={() => setFavOpen(false)} />}
      {cartOpen && <CartPopOver onClose={() => setCartOpen(false)} />}
    </>
  );
};

export default Header;
