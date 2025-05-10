import React, { useState, useContext, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import SearchModal from '../search/SearchModal'; 
import FavoritesPopOver from './FavoritesPopOver'; 
import CartPopOver from './CartPopOver'; // Importando o CartPopOver
import SideMenu from './SideMenu'; 
import { FavoritesContext } from '../../contexts/FavoritesContext'; 
import { CartContext } from '../../contexts/CartContext'; // Importando o CartContext
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // Estado para controlar a visibilidade do CartPopOver
  
  const { favorites } = useContext(FavoritesContext);
  const { cart, getCartItemCount } = useContext(CartContext); // Usando o CartContext
  
  // Calcular a quantidade total de itens no carrinho
  const cartItemCount = getCartItemCount ? getCartItemCount() : cart?.length || 0;
  
  // Fecha modais/popovers com Esc
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') {
        // Fechamos na ordem inversa de prioridade
        if (cartOpen) {
          setCartOpen(false);
        } else if (favOpen) {
          setFavOpen(false);
        } else if (searchOpen) {
          setSearchOpen(false);
        } else if (menuOpen) {
          closeMenuWithAnimation();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen, searchOpen, favOpen, cartOpen]);
  
  const categories = ['mulher', 'homem', 'beauty'];
  
  const handleCategoryHover = cat => {
    // Permitir hover mesmo com o modal de pesquisa aberto
    setActiveCategory(cat);
    setMenuOpen(true);
  };
  
  const handleCategoryClick = (e, cat) => {
    e.preventDefault();
    setActiveCategory(cat);
    setMenuOpen(true);
  };
  
  // Função para permitir que o SearchModal abra o SideMenu
  const handleSearchCategoryClick = (category) => {
    setActiveCategory(category);
    setMenuOpen(true);
  };
  
  // Função para fechar o menu com animação
  const closeMenuWithAnimation = () => {
    // Referência ao SideMenu para fechar com animação
    const sidemenusRef = document.querySelectorAll('.side-menu');
    const subcategoriesRef = document.querySelectorAll('.subcategories-container');
    const overlayRef = document.querySelectorAll('.side-menu-overlay');
    
    // Aplicar classes de animação de saída
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
    
    // Aguardar o fim da animação antes de fechar
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
          <a href="#" onClick={e => { e.preventDefault(); setSearchOpen(true); }}>
            PESQUISAR
          </a>
          <Link to="/login">INICIAR SESSÃO</Link>
          <a href="#" onClick={e => { 
            e.preventDefault(); 
            setFavOpen(o => !o); 
            if (cartOpen) setCartOpen(false); // Fecha o carrinho se estiver aberto
          }}>
            FAVORITOS ({favorites.length})
          </a>
          <a href="#" onClick={e => { 
            e.preventDefault(); 
            setCartOpen(o => !o);
            if (favOpen) setFavOpen(false); // Fecha os favoritos se estiverem abertos
          }}>
            CARRINHO ({cartItemCount})
          </a>
        </div>
      </header>
      
      {/* O SideMenu é renderizado independentemente do SearchModal */}
      <SideMenu
        isOpen={menuOpen}
        onClose={closeMenuWithAnimation}
        initialCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* SearchModal agora pode interagir com o SideMenu */}
      {searchOpen && (
        <SearchModal 
          onClose={() => setSearchOpen(false)} 
          onCategoryClick={handleSearchCategoryClick}
        />
      )}
      
      {favOpen && <FavoritesPopOver onClose={() => setFavOpen(false)} />}
      
      {/* Renderiza o CartPopOver quando cartOpen for true */}
      {cartOpen && <CartPopOver onClose={() => setCartOpen(false)} />}
    </>
  );
};

export default Header;