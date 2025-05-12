import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './FavoritesPopOver.css';

// Componente que representa o popover (janela sobreposta) do carrinho de compras
const CartPopOver = ({ onClose }) => {
  const { cart, removeFromCart, moveToFavorites } = useContext(CartContext);
  const { addToFavorites, favorites } = useContext(FavoritesContext);
  const [isExiting, setIsExiting] = useState(false); // Estado para animação de saída

  // Função para fechar o popover com animação
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Aguarda a animação terminar antes de fechar
  };

  // Fecha o popover ao pressionar a tecla ESC
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  // Calcula o subtotal dos itens no carrinho
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const total = subtotal; // Total é igual ao subtotal neste caso (sem taxas adicionais)

  // Verifica se um item já está nos favoritos
  const isInFavorites = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };

  // Move um item do carrinho para os favoritos
  const handleMoveToFavorites = (item) => {
    moveToFavorites(item, addToFavorites);
  };

  return (
    <div className="favorites-popover-overlay" onClick={handleClose}>
      <div 
        className={`favorites-popover ${isExiting ? 'slide-out' : ''}`} 
        onClick={e => e.stopPropagation()} // Impede o fecho ao clicar dentro do popover
      >
        <div className="favorites-header">
          <h2>CARRINHO ({cart.length})</h2>
          <button className="close-favorites" onClick={handleClose}>×</button>
        </div>
        
        <div className="favorites-content">
          {cart.length > 0 ? (
            <>
              {/* Lista de itens no carrinho */}
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
                        {/* Ícones de ação: guardar nos favoritos ou remover */}
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
              
              {/* Resumo de valores do carrinho */}
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
              
              {/* Ações finais: ir para o carrinho ou finalizar a compra */}
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
            // Mensagem quando o carrinho está vazio
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
