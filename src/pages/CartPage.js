// Importações necessárias do React, contextos, ícones e componentes adicionais
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { FaHeart, FaTrash } from 'react-icons/fa';
import SimilarProducts from '../components/products/SimilarProducts';
import './CartPage.css';

// Componente principal da página do carrinho
export default function CartPage() {
  // Aceder às funções e dados do contexto do carrinho
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  // Aceder à função para adicionar favoritos
  const { addToFavorites } = useContext(FavoritesContext);

  // Estado para controlar o ícone do coração animado
  const [activeHearts, setActiveHearts] = useState({});
  
  // Efeito para definir o título da página ao carregar e limpar ao sair
  useEffect(() => {
    document.title = 'O meu Carrinho | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  
  // Função para remover um produto do carrinho
  const handleRemoveProduct = (item) => {
    removeFromCart(item.id, item.selectedSize);
  };

  // Função para mover um produto para os favoritos
  const moveToFavorites = (item) => {
    // Ativa o ícone de coração com animação
    setActiveHearts(prev => ({...prev, [item.id]: true}));

    // Remove dados específicos do carrinho antes de adicionar aos favoritos
    const { quantity, selectedSize, addedAt, ...productWithoutCartDetails } = item;

    // Adiciona aos favoritos e remove do carrinho
    addToFavorites(productWithoutCartDetails);
    removeFromCart(item.id, item.selectedSize);

    // Desativa o ícone do coração após meio segundo
    setTimeout(() => {
      setActiveHearts(prev => ({...prev, [item.id]: false}));
    }, 500);
  };

  // Aumenta a quantidade de um item no carrinho
  const incrementQuantity = (item) => {
    updateQuantity(item.id, item.quantity + 1, item.selectedSize);
  };

  // Diminui a quantidade de um item, se for superior a 1
  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1, item.selectedSize);
    }
  };

  // Cálculo do subtotal e total (neste caso, envio é gratuito)
  const subtotal = getCartTotal();
  const shipping = 0; 
  const total = subtotal;

  // JSX que representa a interface do carrinho
  return (
    <div className="cart-page">
      {/* Cabeçalho do carrinho */}
      <div className="cart-header">
        <h1 className="cart-title">CARRINHO</h1>
        <p className="cart-subtitle">Estes são os artigos que mais quer comprar.</p>
      </div>
      
      {/* Se o carrinho tiver artigos */}
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
                  {/* Imagem do artigo */}
                  <div className="item-image">
                    <img src={item.image || (item.images && item.images[0])} alt={item.name} />
                  </div>
                  
                  {/* Detalhes do artigo */}
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-size">Tamanho: {item.selectedSize}</p>
                    <p className="item-price">{item.price.toFixed(2)} €</p>
                    
                    {/* Controlos de quantidade */}
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
                  
                  {/* Ações: adicionar aos favoritos ou remover */}
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
          
          {/* Resumo da compra */}
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
            
            {/* Botões de navegação */}
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
        // Caso o carrinho esteja vazio
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
