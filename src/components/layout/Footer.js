import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotification } from '../ui/NotificationSystem';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showSuccess } = useNotification();
  const location = useLocation();

  // Scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Aqui você pode adicionar a lógica para enviar o email para o backend
      showSuccess("Newsletter subscrita!");
      setEmail(''); // Limpar o campo
    }
  };

  // Handler para links internos - garantir scroll to top
  const handleInternalLink = () => {
    // Pequeno delay para garantir que o React Router atualize primeiro
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  };

  return (
    <footer className="footer">
      <div className="newsletter-section">
        <p>RECEBA PROMOÇÕES EXCLUSIVAS, VENDAS PRIVADAS E AS ÚLTIMAS NOVIDADES</p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscrever</button>
        </form>
        <p className="privacy-policy">
          Ao subscrever me confirmo que li a <a href="https://static.zara.net/static/pdfs/PT/privacy-policy/privacy-policy-pt_PT-20241203.pdf?_sp=08f24917-08a6-47e9-817f-f216de982508.1747047478307" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.
        </p>
      </div>
      
      <div className="country-selector">
        <span>PORTUGAL</span>
      </div>
      
      <div className="social-links">
        <a href="https://www.instagram.com/bershkacollection" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
        <a href="https://www.facebook.com/Bershka" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
        <a href="https://www.youtube.com/user/bershka" target="_blank" rel="noopener noreferrer">YOUTUBE</a>
        <a href="https://www.tiktok.com/@bershka" target="_blank" rel="noopener noreferrer">TIKTOK</a>
        <a href="https://open.spotify.com/user/bershka" target="_blank" rel="noopener noreferrer">SPOTIFY</a>
        <a href="https://www.pinterest.com/bershka" target="_blank" rel="noopener noreferrer">PINTEREST</a>
        <a href="https://www.linkedin.com/company/bershka" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
      </div>
      
      <div className="footer-links">
        <div className="footer-column">
          <h3>AJUDA</h3>
          <ul>
            <li><Link to="/cart" onClick={handleInternalLink}>AS MINHAS COMPRAS</Link></li>
            <li><a href="https://www.deco.proteste.pt/familia-consumo/orcamento-familiar/noticias/devolucoes-trocas-produtos" target="_blank" rel="noopener noreferrer">DEVOLUÇÕES</a></li>
            <li><Link to="/responsibility" onClick={handleInternalLink}>EMPRESA</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>TRABALHE NA LOJA</h3>
          <ul>
            <li><Link to="/responsibility" onClick={handleInternalLink}>IMPRENSA</Link></li>
            <li><Link to="/" onClick={handleInternalLink}>SHOPSTORE OUTLET</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>SITE MAP</h3>
          <ul>
            <li><Link to="/responsibility" onClick={handleInternalLink}>RESPONSABILIDADE</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;