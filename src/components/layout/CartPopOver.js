// src/components/layout/CartPopOver.js
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTrash, FaHeart } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './CartPopOver.css';

const CartPopOver = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { addToFavorites } = useContext(FavoritesContext);
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
  
  // Mover para favoritos
  const moveToFavorites = (item) => {
    // Remover tamanho e quantidade para adicionar aos favoritos
    const { quantity, selectedSize, ...productWithoutCartDetails } = item;
    addToFavorites(productWithoutCartDetails);
    removeFromCart(item.id, item.selectedSize);
  };
  
  // Calcular o total
  const subtotal = getCartTotal();
  const total = subtotal;
  
  return (
    <div className="cart-popover-overlay" onClick={handleClose}>
      <div 
        className={`cart-popover ${isExiting ? 'slide-out' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="cart-header">
          <h2>CESTA ({cart.length})</h2>
          <button className="close-cart" onClick={handleClose}>×</button>
        </div>
        
        <div className="cart-content">
          {cart.length > 0 ? (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedSize}`} className="cart-item">
                    <div className="item-info-container">
                      <div className="item-image">
                        <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-meta">
                          <p>Quantidade: 
                            <select 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.selectedSize)}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </p>
                          {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                        </div>
                        <div className="item-price">
                          {item.price.toFixed(2)} €
                        </div>
                        <div className="item-actions">
                          <button 
                            className="action-button favorite"
                            onClick={() => moveToFavorites(item)}
                          >
                            <FaHeart className="heart-icon" />
                            <span>Mover para favoritos</span>
                          </button>
                          <button 
                            className="action-button remove"
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
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
              
              <div className="cart-actions">
                <Link to="/cart" className="btn-secondary" onClick={handleClose}>
                  VER CESTA
                </Link>
                <Link to="/checkout" className="btn-primary" onClick={handleClose}>
                  INICIAR UM PEDIDO
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <p>Ainda não tem produtos na cesta</p>
              <Link to="/" className="continue-shopping" onClick={handleClose}>
                CONTINUAR A COMPRAR
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPopOver;