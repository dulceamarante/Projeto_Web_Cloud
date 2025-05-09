// src/pages/CartPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { ProductContext } from '../contexts/ProductContext';
import { FaTrash, FaTimes, FaHeart } from 'react-icons/fa';
import { FavoritesContext } from '../contexts/FavoritesContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
  const { getTopSellingProducts } = useContext(ProductContext);
  const { addToFavorites } = useContext(FavoritesContext);
  
  const [selectMode, setSelectMode] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);
  
  // always fetch 5 suggestions
  const suggestedProducts = getTopSellingProducts(5);
  
  // update document title
  useEffect(() => {
    document.title = 'Minha Cesta | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  
  // Toggle select mode with animation
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
  };
  
  // Função para remover um produto com animação
  const handleRemoveProduct = (item) => {
    // Adicionar o ID do produto à lista de itens sendo removidos
    const itemKey = `${item.id}-${item.selectedSize}`;
    setRemovingItems(prev => [...prev, itemKey]);
    
    // Aguardar a animação terminar antes de remover do estado
    setTimeout(() => {
      removeFromCart(item.id, item.selectedSize);
      setRemovingItems(prev => prev.filter(key => key !== itemKey));
    }, 400); // Duração da animação
  };

  // Função para mover um item para favoritos
  const moveToFavorites = (item) => {
    addToFavorites(item);
    handleRemoveProduct(item);
  };

  // Calcular total
  const subtotal = getCartTotal();
  const total = subtotal;

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="titles">
          <h1>A MINHA CESTA</h1>
          <p>Estes são os produtos da sua cesta</p>
          <hr className="single-line" />
        </div>
        <div className="actions">
          {!selectMode ? (
            <button
              className="select-btn"
              onClick={toggleSelectMode}
            >
              SELECIONAR
            </button>
          ) : (
            <div className="selection-controls">
              <button className="icon-btn trash-all" onClick={clearCart}>
                <FaTrash />
              </button>
              <button className="icon-btn close" onClick={toggleSelectMode}>
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Seção do carrinho - só aparece se houver itens */}
      {cart.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items-section">
            {cart.map(item => {
              const itemKey = `${item.id}-${item.selectedSize}`;
              return (
                <div 
                  key={itemKey} 
                  className={`cart-item ${removingItems.includes(itemKey) ? 'fade-out' : 'fade-in'}`}
                >
                  <div className="item-image">
                    <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      {item.selectedSize && <p>Tamanho: {item.selectedSize}</p>}
                    </div>
                    <div className="item-price">
                      {item.price.toFixed(2)} €
                    </div>
                  </div>
                  <div className="item-quantity">
                    <label>Quantidade:</label>
                    <select 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.selectedSize)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="item-total">
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="action-button favorite"
                      onClick={() => moveToFavorites(item)}
                    >
                      <FaHeart />
                    </button>
                    <button 
                      className="action-button remove"
                      onClick={() => handleRemoveProduct(item)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary-section">
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
              <Link to="/" className="btn-secondary">
                CONTINUAR A COMPRAR
              </Link>
              <Link to="/checkout" className="btn-primary">
                FINALIZAR COMPRA
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message">
          <p>Ainda não tem produtos na cesta</p>
          <Link to="/" className="shop-now-btn">VOLTAR PARA A LOJA</Link>
        </div>
      )}
      
      {/* A seção de sugestões SEMPRE aparece */}
      <section className="suggestions-section">
        <h2>TALVEZ LHE INTERESSE</h2>
        <div className="suggestions-grid">
          {suggestedProducts.map(product => (
            <div key={product.id} className="suggestion-card">
              <img src={product.image || (product.images && product.images[0])} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price.toFixed(2)} €</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => updateQuantity(product.id, 1)}
              >
                ADICIONAR
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}