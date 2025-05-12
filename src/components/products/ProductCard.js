// Importações necessárias do React, ícones, contextos, notificações e estilos
import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import { useNotification } from '../ui/NotificationSystem';
import './ProductCard.css';
import { Link } from 'react-router-dom';

// Componente principal do cartão de produto
export default function ProductCard({
  product,                       // Produto individual
  toggleFavorite: externalToggleFavorite,  // Função opcional externa para favoritos
  addToCart: externalAddToCart,           // Função opcional externa para adicionar ao carrinho
}) {
  // Estado da imagem atual no carrossel
  const [currentImage, setCurrentImage] = useState(0);
  const [hover, setHover] = useState(false); // Estado de hover (passar o rato por cima)
  const [animateHeart, setAnimateHeart] = useState(false); // Animação do ícone de favorito
  const [selectedSize, setSelectedSize] = useState(null); // Tamanho selecionado
  const [animateSize, setAnimateSize] = useState(false); // Animação do botão de tamanho
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext); // Contexto de favoritos
  const { addToCart: contextAddToCart } = useContext(CartContext);     // Contexto do carrinho
  const favBtnRef = useRef(null); // Referência ao botão de favorito (não está a ser usada aqui)
  const location = useLocation(); // Localização atual na app (ex. verificar se está no carrinho)
  const notification = useNotification(); // Sistema de notificações personalizado

  // Verifica se está na página do carrinho
  const isOnCartPage = location.pathname === '/cart';

  // Determina se o produto está nos favoritos (internamente ou definido pelo produto)
  const isProductFavorite = product.isFavorite !== undefined ? product.isFavorite : isFavorite(product.id);

  // Função para imagem anterior no carrossel
  const prev = e => {
    e.stopPropagation();
    setCurrentImage(i =>
      i === 0 ? (product.images?.length || 1) - 1 : i - 1
    );
  };

  // Função para próxima imagem no carrossel
  const next = e => {
    e.stopPropagation();
    setCurrentImage(i =>
      i === (product.images?.length || 1) - 1 ? 0 : i + 1
    );
  };

  // Alterna o estado de favorito do produto
  const handleToggleFavorite = e => {
    e.stopPropagation();
    e.preventDefault();

    // Usa a função externa, se existir
    if (externalToggleFavorite) {
      externalToggleFavorite();
    } else {
      toggleFavorite(product);
    }

    // Animação do coração
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1200);
  };

  // Lida com a seleção de tamanho e adiciona ao carrinho
  const handleSizeSelect = (e, productId, variant) => {
    e.stopPropagation();
    setSelectedSize(variant.size);
    setAnimateSize(true);

    setTimeout(() => {
      // Usa a função do contexto se estiver disponível
      if (contextAddToCart) {
        contextAddToCart(product, 1, variant.size);

        // Notificação com ou sem botão extra, dependendo da página
        if (isOnCartPage) {
          notification.showToast('Produto adicionado ao carrinho!');
        } else {
          notification.showToast(
            'Produto adicionado ao carrinho!',
            'VER CARRINHO',
            () => {
              window.location.href = '/cart';
            }
          );
        }

      // Ou usa função externa, se fornecida
      } else if (externalAddToCart) {
        externalAddToCart(productId, variant);

        if (isOnCartPage) {
          notification.showToast('Produto adicionado ao carrinho!');
        } else {
          notification.showToast(
            'Produto adicionado ao carrinho!',
            'VER CARRINHO',
            () => {
              window.location.href = '/cart';
            }
          );
        }
      }

      // Final da animação
      setTimeout(() => {
        setAnimateSize(false);
      }, 600);
    }, 300);
  };

  // Controla o tempo da animação do coração (caso se repita)
  useEffect(() => {
    if (animateHeart) {
      const timer = setTimeout(() => {
        setAnimateHeart(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [animateHeart]);

  // Renderização do componente
  return (
    <div
      className="product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="product-image-container">

        {/* Link para a página do produto */}
        <Link to={`/product/${product.id}`} className="product-card-link">
          <img
            src={product.images?.[currentImage] || product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>

        {/* Setas de navegação se houver várias imagens */}
        {product.images?.length > 1 && (
          <>
            <button className="nav-arrow left" onClick={prev}>
              <FaChevronLeft size={24} />
            </button>
            <button className="nav-arrow right" onClick={next}>
              <FaChevronRight size={24} />
            </button>
          </>
        )}

        {/* Overlay com botões de tamanhos ao passar o rato */}
        {hover && product.variants?.length > 0 && (
          <div className="size-overlay">
            {product.variants.map(v => (
              <button
                key={v.size || 'default'}
                className={`size-btn ${selectedSize === v.size ? 'selected' : ''} ${selectedSize === v.size && animateSize ? 'animate-selection' : ''}`}
                disabled={v.stock === 0}
                onClick={(e) => handleSizeSelect(e, product.id, v)}
              >
                {v.size || 'Único'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informação do produto + botão de favorito */}
      <div className="product-info">
        <div className="title-heart">
          <div className="product-info-left">
            <h3 className="product-name">{product.name}</h3>

            <div className="product-price-container">
              {/* Preço antigo e badge de desconto se aplicável */}
              {product.oldPrice && (
                <span className="original-price">
                  {product.oldPrice.toFixed(2)} €
                </span>
              )}
              {product.oldPrice && (
                <span className="discount-badge">
                  –{Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )}
                  %
                </span>
              )}

              <span className="final-price">{product.price.toFixed(2)} €</span>
            </div>
          </div>

          {/* Botão de adicionar/remover favorito */}
          <button
            ref={favBtnRef}
            className={`fav-btn ${animateHeart ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={
              isProductFavorite
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'
            }
          >
            {isProductFavorite ? (
              <FaHeart style={{ color: '#e41e63', fill: '#e41e63' }} />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
