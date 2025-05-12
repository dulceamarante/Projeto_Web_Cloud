import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import ShoppingCartIcon from '../../assets/images/icons/shopping-cart.png';
import './FavoritesPopOver.css';

// Componente que representa o popover (janela sobreposta) dos favoritos
const FavoritesPopOver = ({ onClose }) => {
  const { favorites, removeFromFavorites, moveToCart } = useContext(FavoritesContext); // Contexto dos favoritos
  const { addToCart, cart } = useContext(CartContext); // Contexto do carrinho
  const [isExiting, setIsExiting] = useState(false); // Estado para animação de saída
  
  // Função para fechar o popover com animação
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(); // Fecha o popover após a animação
    }, 300); // Aguardar o tempo da animação antes de fechar
  };

  // Fecha o popover quando a tecla ESC é pressionada
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey); // Remove o listener ao desmontar o componente
  }, []);

  // Calcula o subtotal dos itens nos favoritos
  const subtotal = favorites.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal; // O total é igual ao subtotal neste caso

  // Função para mover um item dos favoritos para o carrinho
  const handleMoveToCart = (item) => {
    moveToCart(item, addToCart, true); // Mover o item para o carrinho
  };

  // Verifica se um item já está no carrinho
  const isInCart = (itemId) => {
    return cart.some(item => item.id === itemId);
  };
  
  return (
    <div className="favorites-popover-overlay" onClick={handleClose}>
      <div 
        className={`favorites-popover ${isExiting ? 'slide-out' : ''}`} 
        onClick={e => e.stopPropagation()} // Impede o fechamento ao clicar dentro do popover
      >
        <div className="favorites-header">
          <h2>FAVORITOS ({favorites.length})</h2>
          <button className="close-favorites" onClick={handleClose}>×</button>
        </div>
        
        <div className="favorites-content">
          {favorites.length > 0 ? (
            <>
              {/* Lista de itens nos favoritos */}
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
                          <p>Quantidade: 1</p> {/* Assumimos sempre 1 unidade nos favoritos */}
                        </div>
                        <div className="item-price">
                          {item.price.toFixed(2)} €
                        </div>
                        <div className="item-icons">
                          {/* Ícone para mover para o carrinho */}
                          <button 
                            className={`icon-button cart ${isInCart(item.id) ? 'active' : ''}`}
                            onClick={() => handleMoveToCart(item)}
                            title="Comprar mais tarde"
                          >
                            <img src={ShoppingCartIcon} alt="Carrinho" className="cart-icon" />
                          </button>
                          {/* Ícone para remover dos favoritos */}
                          <button 
                            className="icon-button remove"
                            onClick={() => removeFromFavorites(item.id)}
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
              
              {/* Resumo de valores dos favoritos */}
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
              
              {/* Ações finais: ver favoritos ou iniciar um pedido */}
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
            // Mensagem quando não há favoritos
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
