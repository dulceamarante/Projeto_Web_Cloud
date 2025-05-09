// src/components/products/ProductCard.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext'; // Importar CartContext
import './ProductCard.css';

export default function ProductCard({
  product,
  addToCart, // Esta prop será usada apenas como fallback
  showTrash = false,
  removeFromFavorites,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [hover, setHover] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [animateSize, setAnimateSize] = useState(false);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart: contextAddToCart } = useContext(CartContext); // Usar addToCart do contexto
  const favBtnRef = useRef(null);

  const isProductFavorite = isFavorite(product.id);

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
    toggleFavorite(product);
    
    // Adicionar animação de pulsar
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1200);
  };

  const handleSizeSelect = (e, productId, variant) => {
    e.stopPropagation();
    
    // Animação de seleção
    setSelectedSize(variant.size);
    setAnimateSize(true);
    
    // Reset após um tempo para permitir que a animação ocorra novamente
    setTimeout(() => {
      // Tentar usar addToCart do contexto primeiro, se disponível
      if (contextAddToCart) {
        contextAddToCart(product, 1, variant.size);
      } else if (addToCart) {
        // Fallback para a prop
        addToCart(productId, variant);
      }
      
      // Resetar animação após um tempo
      setTimeout(() => {
        setAnimateSize(false);
      }, 600);
    }, 300);
  };

  // Efeito para remover a classe de animação após a animação terminar
  useEffect(() => {
    if (animateHeart) {
      const timer = setTimeout(() => {
        setAnimateHeart(false);
      }, 1200); // Duração da animação
      
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
        <img
          src={product.images?.[currentImage] || product.image}
          alt={product.name}
          className="product-image"
        />

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
        
        {/* Ícone de lixeira */}
        {showTrash && removeFromFavorites && (
          <button
            className="trash-button"
            onClick={e => {
              e.stopPropagation();
              removeFromFavorites(product);
            }}
            aria-label="Remover dos favoritos"
          >
            <FaTrash />
          </button>
        )}
      </div>

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