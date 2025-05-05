// Header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // largura da janela para responsividade
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Alternar menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (activeMenu) setActiveMenu(null);
  };

  // Abrir/fechar menu lateral
  const toggleMenu = (category) => {
    if (activeMenu === category) {
      setActiveMenu(null);
    } else {
      setActiveMenu(category);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  // Fechar menu lateral
  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Definir as subcategorias para cada categoria principal
  const subcategories = {
    mulher: [
      { name: 'VESTIDOS', path: '/products?category=vestidos' },
      { name: 'T-SHIRTS', path: '/products?category=t-shirts' },
      { name: 'JEANS', path: '/products?category=jeans' },
      { name: 'CALÇAS', path: '/products?category=calcas' },
      { name: 'SAIAS', path: '/products?category=saias' },
      { name: 'CAMISAS', path: '/products?category=camisas' },
      { name: 'CASACOS', path: '/products?category=casacos' }
    ],
    homem: [
      { name: 'CAMISAS', path: '/products?category=camisas-homem' },
      { name: 'T-SHIRTS', path: '/products?category=t-shirts-homem' },
      { name: 'JEANS', path: '/products?category=jeans-homem' },
      { name: 'CALÇAS', path: '/products?category=calcas-homem' },
      { name: 'CASACOS', path: '/products?category=casacos-homem' }
    ],
    beauty: [
      { name: 'MAKEUP', path: '/products?category=makeup' },
      { name: 'PERFUMES', path: '/products?category=perfumes' },
      { name: 'SKINCARE', path: '/products?category=skincare' }
    ]
  };

  return (
    <>
      <header className="header">
        {/* Botão de menu hambúrguer  */}
        {windowWidth <= 768 && (
          <button className="hamburger-button" onClick={toggleMobileMenu}>
            <span className="hamburger-icon"></span>
          </button>
        )}
        
        <div className={`header-left ${windowWidth <= 768 ? (mobileMenuOpen ? 'show' : 'hide') : ''}`}>
          <a href="#" onClick={(e) => {e.preventDefault(); toggleMenu('mulher');}}>MULHER</a>
          <a href="#" onClick={(e) => {e.preventDefault(); toggleMenu('homem');}}>HOMEM</a>
          <a href="#" onClick={(e) => {e.preventDefault(); toggleMenu('beauty');}}>BEAUTY</a>
        </div>
        
        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>
        
        <div className={`header-right ${windowWidth <= 768 ? (mobileMenuOpen ? 'show' : 'hide') : ''}`}>
          <Link to="/search">PESQUISAR</Link>
          <Link to="/login">INICIAR SESSÃO</Link>
          <Link to="/favorites">FAVORITOS (0)</Link>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>

      {/* Menu lateral */}
      {activeMenu && (
        <div className="side-menu-wrapper">
          <div className="side-menu">
            <div className="side-menu-header">
              <button className="close-button" onClick={closeMenu}>×</button>
            </div>
            <ul className="side-menu-list">
              {subcategories[activeMenu].map((item, index) => (
                <li key={index}>
                  <Link to={item.path} onClick={closeMenu}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="side-menu-overlay" onClick={closeMenu}></div>
        </div>
      )}
    </>
  );
};

export default Header;