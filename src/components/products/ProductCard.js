// src/components/products/ProductCard.js
import React, { useState, useContext, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart, FaTrash } from 'react-icons/fa';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './ProductCard.css';

export default function ProductCard({
  product,
  addToCart,
  showTrash = false,
  removeFromFavorites,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [hover, setHover] = useState(false);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

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
  };

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
              <FaChevronLeft />
            </button>
            <button className="nav-arrow right" onClick={next}>
              <FaChevronRight />
            </button>
          </>
        )}

        {hover && product.variants?.length > 0 && (
          <div className="size-overlay">
            {product.variants.map(v => (
              <button
                key={v.size || 'default'}
                className="size-btn"
                disabled={v.stock === 0}
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product.id, v);
                }}
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
            className="fav-btn"
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