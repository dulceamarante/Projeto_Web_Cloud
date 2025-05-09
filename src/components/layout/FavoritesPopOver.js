// src/components/layout/FavoritesPopOver.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './FavoritesPopOver.css';

const FavoritesPopOver = ({ onClose }) => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const [isExiting, setIsExiting] = useState(false);
  
  // Fechar com animação
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // Fechar com ESC
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);
  
  // Calcular o total
  const subtotal = favorites.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal;
  
  return (
    <div className="favorites-popover-overlay" onClick={handleClose}>
      <div 
        className={`favorites-popover ${isExiting ? 'slide-out' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="favorites-header">
          <h2>FAVORITOS ({favorites.length})</h2>
          <button className="close-favorites" onClick={handleClose}>×</button>
        </div>
        
        <div className="favorites-content">
          {favorites.length > 0 ? (
            <>
              <div className="favorites-items">
                {favorites.map(item => (
                  <div key={item.id} className="favorites-item">
                    <div className="item-info-container">
                      <div className="item-image">
                        <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-meta">
                          <p>Quantidade: 1</p>
                        </div>
                        <div className="item-price">
                          {item.price.toFixed(2)} €
                        </div>
                        <div className="item-actions">
                          <button className="action-button cart">
                            <FaShoppingBag className="shopping-bag-icon" />
                            <span>Comprar mais tarde</span>
                          </button>
                          <button 
                            className="action-button remove"
                            onClick={() => removeFromFavorites(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="favorites-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="summary-row">
                  <span>Envio</span>
                  <span>Grátis</span>
                </div>
                <div className="summary-row total">
                  <span>TOTAL</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="summary-info">
                  Impostos incluídos
                </div>
              </div>
              
              <div className="favorites-actions">
                <Link to="/favorites" className="btn-secondary" onClick={handleClose}>
                  VER FAVORITOS
                </Link>
                <Link to="/checkout" className="btn-primary" onClick={handleClose}>
                  INICIAR UM PEDIDO
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-favorites">
              <p>Ainda não tem favoritos</p>
              <Link to="/" className="continue-shopping" onClick={handleClose}>
                Continuar a comprar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPopOver;