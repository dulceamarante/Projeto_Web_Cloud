// src/components/products/ProductCard.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import { useNotification } from '../ui/NotificationSystem';
import './ProductCard.css';
import { Link } from 'react-router-dom';

export default function ProductCard({
  product,
  toggleFavorite: externalToggleFavorite,
  addToCart: externalAddToCart, // Fallback, mas normalmente não usado
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [hover, setHover] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [animateSize, setAnimateSize] = useState(false);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart: contextAddToCart } = useContext(CartContext);
  const favBtnRef = useRef(null);
  const location = useLocation();
  const notification = useNotification();

  // Verificar se estamos na página do carrinho
  const isOnCartPage = location.pathname === '/cart';
  
  // Verificar se é favorito (usando a prop product.isFavorite como prioridade)
  const isProductFavorite = product.isFavorite !== undefined ? product.isFavorite : isFavorite(product.id);
  
  const prev = e => {
    e.stopPropagation();
    setCurrentImage(i =>
      i === 0 ? (product.images?.length || 1) - 1 : i - 1
    );
  };

  const next = e => {
    e.stopPropagation();
    setCurrentImage(i =>
      i === (product.images?.length || 1) - 1 ? 0 : i + 1
    );
  };

  const handleToggleFavorite = e => {
    e.stopPropagation();
    e.preventDefault();
    
    // Usar a função externa se fornecida, senão usar a do context
    if (externalToggleFavorite) {
      externalToggleFavorite();
    } else {
      toggleFavorite(product);
    }
    
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1200);
  };

  const handleSizeSelect = (e, productId, variant) => {
    e.stopPropagation();
    setSelectedSize(variant.size);
    setAnimateSize(true);
    
    setTimeout(() => {
      // Sempre usar o context addToCart primeiro
      if (contextAddToCart) {
        contextAddToCart(product, 1, variant.size);
        
        // Mostrar notificação baseada na página atual
        if (isOnCartPage) {
          // Na página do carrinho: notificação simples SEM botão "Ver Carrinho"
          notification.showToast('Produto adicionado ao carrinho!');
        } else {
          // Outras páginas: notificação COM botão "Ver Carrinho"
          notification.showToast(
            'Produto adicionado ao carrinho!',
            'VER CARRINHO',
            () => {
              window.location.href = '/cart';
            }
          );
        }
      } else if (externalAddToCart) {
        // Fallback para a função externa
        externalAddToCart(productId, variant);
        
        // Mesmo comportamento para fallback
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
      
      setTimeout(() => {
        setAnimateSize(false);
      }, 600);
    }, 300);
  };

  useEffect(() => {
    if (animateHeart) {
      const timer = setTimeout(() => {
        setAnimateHeart(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [animateHeart]);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="product-image-container">
        {/* Imagem com Link */}
        <Link to={`/product/${product.id}`} className="product-card-link">
          <img
            src={product.images?.[currentImage] || product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>

        {/* Setas de navegação fora do Link */}
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

        {/* Tamanhos em hover */}
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

      {/* Info do produto + botão de favorito */}
      <div className="product-info">
        <div className="title-heart">
          <div className="product-info-left">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price-container">
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