
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './FavoritesPopOver.css';

const CartPopOver = ({ onClose }) => {
  const { cart, removeFromCart, moveToFavorites } = useContext(CartContext);
  const { addToFavorites, favorites } = useContext(FavoritesContext);
  const [isExiting, setIsExiting] = useState(false);
  

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);
  

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = subtotal;


  const isInFavorites = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };
  

  const handleMoveToFavorites = (item) => {
    moveToFavorites(item, addToFavorites);
  };
  
  return (
    <div className="favorites-popover-overlay" onClick={handleClose}>
      <div 
        className={`favorites-popover ${isExiting ? 'slide-out' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="favorites-header">
          <h2>CARRINHO ({cart.length})</h2>
          <button className="close-favorites" onClick={handleClose}>×</button>
        </div>
        
        <div className="favorites-content">
          {cart.length > 0 ? (
            <>
              <div className="favorites-items">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize || 'default'}`} className="favorites-item">
                    <div className="item-info-container">
                      <div className="item-image">
                        <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-meta">
                          <p>Quantidade: {item.quantity || 1}</p>
                          {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                        </div>
                        <div className="item-price">
                          {item.price.toFixed(2)} €
                        </div>
                        <div className="item-icons">
                          <button 
                            className={`icon-button heart-icon ${isInFavorites(item.id) ? 'active' : ''}`}
                            onClick={() => handleMoveToFavorites(item)}
                            title="Guardar nos favoritos"
                          >
                            <FaHeart />
                          </button>
                          <button 
                            className="icon-button remove"
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            title="Eliminar"
                          >
                            <FaTrash />
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
                <Link to="/cart" className="btn-secondary" onClick={handleClose}>
                  VER CARRINHO
                </Link>
                <Link to="#" className="btn-primary" onClick={handleClose}>
                  FINALIZAR COMPRA
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-favorites">
              <p>O seu carrinho está vazio</p>
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

export default CartPopOver;