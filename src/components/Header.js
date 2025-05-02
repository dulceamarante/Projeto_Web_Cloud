import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/icons/logo-01.png'; // ✅ mantém só este

function Header() {
  return (
    <header className="header-v4">
      <div className="container-menu-desktop">
        {/* Topbar (opcional) */}
        <div className="top-bar">
          <div className="content-topbar flex-sb-m h-full container">
            <div className="left-top-bar"> Bem-vindo à Cozastore! </div>
            <div className="right-top-bar flex-w h-full">
              <a href="#" className="flex-c-m trans-04 p-lr-25"> Ajuda </a>
              <a href="#" className="flex-c-m trans-04 p-lr-25"> Minha Conta </a>
            </div>
          </div>
        </div>

        {/* Menu principal */}
        <div className="wrap-menu-desktop">
          <nav className="limiter-menu-desktop container">
            <Link to="/" className="logo">
              <img src={logo} alt="Cozastore" />
            </Link>

            <div className="menu-desktop">
              <ul className="main-menu">
                <li><Link to="/">Início</Link></li>
                <li><Link to="/produtos">Produtos</Link></li>
                <li><Link to="/favoritos">Favoritos</Link></li>
                <li><Link to="/carrinho">Carrinho</Link></li>
              </ul>
            </div>

            {/* Ícones */}
            <div className="wrap-icon-header flex-w flex-r-m">
              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti" data-notify="0">
                <Link to="/favoritos"><i className="zmdi zmdi-favorite-outline"></i></Link>
              </div>

              <div className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti" data-notify="0">
                <Link to="/carrinho"><i className="zmdi zmdi-shopping-cart"></i></Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
