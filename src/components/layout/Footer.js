import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="newsletter-section">
        <p>RECEBA PROMOÇÕES EXCLUSIVAS, VENDAS PRIVADAS E AS ÚLTIMAS NOVIDADES</p>
        <div className="newsletter-form">
          <input type="email" placeholder="E-mail" />
          <button>Subscrever</button>
        </div>
        <p className="privacy-policy">
          Ao subscrever me confirmo que li a <Link to="/privacy">Política de Privacidade</Link>.
        </p>
      </div>
      
      <div className="country-selector">
        <span>PORTUGAL</span>
      </div>
      
      <div className="social-links">
        <a href="#" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
        <a href="#" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
        <a href="#" target="_blank" rel="noopener noreferrer">YOUTUBE</a>
        <a href="#" target="_blank" rel="noopener noreferrer">TIKTOK</a>
        <a href="#" target="_blank" rel="noopener noreferrer">SPOTIFY</a>
        <a href="#" target="_blank" rel="noopener noreferrer">PINTEREST</a>
        <a href="#" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
      </div>
      
      <div className="footer-links">
        <div className="footer-column">
          <h3>AJUDA</h3>
          <ul>
            <li><Link to="/myaccount">AS MINHAS COMPRAS</Link></li>
            <li><Link to="/returns">DEVOLUÇÕES</Link></li>
            <li><Link to="/company">EMPRESA</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>TRABALHE NA LOJA</h3>
          <ul>
            <li><Link to="/press">IMPRENSA</Link></li>
            <li><Link to="/outlet">SHOPSTORE OUTLET</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>SITE MAP</h3>
          <ul>
            <li><Link to="/responsibility">RESPONSABILIDADE</Link></li>
            <li><Link to="/franchise">CARTÃO FIDELIZAÇÃO</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>DIAS ESPECIAIS</h3>
          <ul>
            <li><Link to="/club">CLUBE LIKES YOU</Link></li>
            <li><Link to="/lojas">LOJAS</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;