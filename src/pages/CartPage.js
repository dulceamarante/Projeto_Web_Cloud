
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { FaHeart, FaTrash } from 'react-icons/fa';
import SimilarProducts from '../components/products/SimilarProducts';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { addToFavorites } = useContext(FavoritesContext);
  
  const [activeHearts, setActiveHearts] = useState({});
  

  useEffect(() => {
    document.title = 'O meu Carrinho | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  

  const handleRemoveProduct = (item) => {

    removeFromCart(item.id, item.selectedSize);
  };


  const moveToFavorites = (item) => {

    setActiveHearts(prev => ({...prev, [item.id]: true}));

    const { quantity, selectedSize, addedAt, ...productWithoutCartDetails } = item;
    

    addToFavorites(productWithoutCartDetails);
    removeFromCart(item.id, item.selectedSize);
    

    setTimeout(() => {
      setActiveHearts(prev => ({...prev, [item.id]: false}));
    }, 500);
  };
  

  const incrementQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1, item.selectedSize);
  };
  

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.selectedSize);
    }
  };


  const subtotal = getCartTotal();
  const shipping = 0; 
  const total = subtotal;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">CARRINHO</h1>
        <p className="cart-subtitle">Estes são os artigos que mais quer comprar.</p>
      </div>
      
      {cart.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items-section">
            {cart.map(item => {
              const itemKey = `${item.id}-${item.selectedSize || 'default'}`;
              return (
                <div 
                  key={itemKey} 
                  className="cart-item"
                >
                  <div className="item-image">
                    <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-size">Tamanho: {item.selectedSize}</p>
                    <p className="item-price">{item.price.toFixed(2)} €</p>
                    
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn minus"
                        onClick={() => decrementQuantity(item)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn plus"
                        onClick={() => incrementQuantity(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className={`action-icon favorite ${activeHearts[item.id] ? 'active' : ''}`}
                      onClick={() => moveToFavorites(item)}
                      aria-label="Adicionar aos favoritos"
                    >
                      <FaHeart />
                    </button>
                    <button 
                      className="action-icon trash"
                      onClick={() => handleRemoveProduct(item)}
                      aria-label="Remover do carrinho"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="summary-row">
              <span>Envio</span>
              <span>{shipping === 0 ? 'Grátis' : `${shipping.toFixed(2)} €`}</span>
            </div>
            <div className="summary-row total">
              <span>TOTAL</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="taxes-note">
              Impostos incluídos
            </div>
            
            <div className="cart-buttons">
              <Link to="/" className="continue-shopping-btn">
                CONTINUAR A COMPRAR
              </Link>
              <Link to="#" className="checkout-btn">
                FINALIZAR COMPRA
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>O carrinho está vazio.</p>
          <Link to="/" className="shop-now-btn">
            VOLTAR PARA A LOJA
          </Link>
        </div>
      )}
      

      <SimilarProducts />
      

      <div className="footer-spacer"></div>
    </div>
  );
}