import React, { useState, useContext, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import SearchModal from '../search/SearchModal'; 
import FavoritesPopOver from './FavoritesPopOver'; 
import SideMenu from './SideMenu'; 
import { FavoritesContext } from '../../contexts/FavoritesContext'; 
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const { favorites } = useContext(FavoritesContext);
  
  // Fecha modais/popovers com Esc
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
  
  const categories = ['mulher', 'homem', 'beauty'];
  
  const handleCategoryHover = cat => {
    setActiveCategory(cat);
    setMenuOpen(true);
  };
  
  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    setActiveCategory(cat);
    setMenuOpen(true);
  };
  
  return (
    <>
      <header className="header">
        <ul className="header-left">
          {categories.map(cat => (
            <li key={cat} className="header-item">
              <a
                href="#"
                className={menuOpen && activeCategory === cat ? 'active' : ''}
                onClick={e => handleCategoryClick(e, cat)}
                onMouseEnter={() => handleCategoryHover(cat)}
              >
                {cat.toUpperCase()}
              </a>
            </li>
          ))}
          {menuOpen && (
            <li className="header-item close-button-container">
              <button 
                className="close-menu-button"
                onClick={() => {
                  // Referência ao SideMenu para fechar com animação
                  const sidemenusRef = document.querySelectorAll('.side-menu');
                  const subcategoriesRef = document.querySelectorAll('.subcategories-container');
                  const overlayRef = document.querySelectorAll('.side-menu-overlay');
                  
                  // Aplicar classes de animação de saída
                  sidemenusRef.forEach(menu => menu.classList.replace('slide-in', 'slide-out'));
                  subcategoriesRef.forEach(sub => sub.classList.replace('slide-in', 'slide-out'));
                  overlayRef.forEach(overlay => overlay.classList.replace('fade-in', 'fade-out'));
                  
                  // Aguardar o fim da animação antes de fechar
                  setTimeout(() => {
                    setMenuOpen(false);
                  }, 800);
                }}
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
          <a href="#" onClick={e => { e.preventDefault(); setSearchOpen(true); }}>
            PESQUISAR
          </a>
          <Link to="/login">INICIAR SESSÃO</Link>
          <a href="#" onClick={e => { e.preventDefault(); setFavOpen(o => !o); }}>
            FAVORITOS ({favorites.length})
          </a>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>
      
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        initialCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {favOpen && <FavoritesPopOver onClose={() => setFavOpen(false)} />}
    </>
  );
};

export default Header;