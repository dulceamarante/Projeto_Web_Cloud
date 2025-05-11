import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchModal from '../search/SearchModal';
import FavoritesPopOver from './FavoritesPopOver';
import CartPopOver from './CartPopOver';
import SideMenu from './SideMenu';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { favorites } = useContext(FavoritesContext);
  const { cart, getCartItemCount } = useContext(CartContext);
  const cartItemCount = getCartItemCount ? getCartItemCount() : cart?.length || 0;

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

  const categories = ['mulher', 'homem', 'beauty'];

  const categoryPages = {
    mulher: '/',
    homem: '/homem',
    beauty: '/beauty'
  };

  const handleCategoryHover = cat => {
    setActiveCategory(cat);
    setMenuOpen(true);
  };

  const handleSearchCategoryClick = (category) => {
    setActiveCategory(category);
    setMenuOpen(true);
  };

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
      <header className="header">
        <ul className="header-left">
          {categories.map(cat => (
            <li key={cat} className="header-item">
              <Link
                to={categoryPages[cat]}
                className={menuOpen && activeCategory === cat ? 'active' : ''}
                onMouseEnter={() => handleCategoryHover(cat)}
                onClick={() => setActiveCategory(cat)}
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

        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>

        <div className="header-right">
          <a href="#" onClick={e => { e.preventDefault(); setSearchOpen(true); }}>PESQUISAR</a>
          <a href="#" onClick={e => { e.preventDefault(); setFavOpen(o => !o); if (cartOpen) setCartOpen(false); }}>FAVORITOS ({favorites.length})</a>
          <a href="#" onClick={e => { e.preventDefault(); setCartOpen(o => !o); if (favOpen) setFavOpen(false); }}>CARRINHO ({cartItemCount})</a>
        </div>
      </header>

      <SideMenu
        isOpen={menuOpen}
        onClose={closeMenuWithAnimation}
        initialCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onCategoryClick={handleSearchCategoryClick} />}
      {favOpen && <FavoritesPopOver onClose={() => setFavOpen(false)} />}
      {cartOpen && <CartPopOver onClose={() => setCartOpen(false)} />}
    </>
  );
};

export default Header;