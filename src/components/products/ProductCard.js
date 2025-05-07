import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaHeart } from 'react-icons/fa';
import './ProductCard.css';

export default function ProductCard({
  product,
  addToCart,
  toggleFavorite,
  isFavorite
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [hover, setHover] = useState(false);

  const prev = e => {
    e.stopPropagation();
    setCurrentImage(i => (i === 0 ? product.images.length - 1 : i - 1));
  };
  const next = e => {
    e.stopPropagation();
    setCurrentImage(i => (i === product.images.length - 1 ? 0 : i + 1));
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="product-image-container">
        <img
          src={product.images[currentImage]}
          alt={product.name}
          className="product-image"
        />
        <button className="nav-arrow left" onClick={prev}><FaChevronLeft /></button>
        <button className="nav-arrow right" onClick={next}><FaChevronRight /></button>
        {hover && (
          <div className="size-overlay">
            {product.variants.map(v => (
              <button
                key={v.size}
                className="size-btn"
                disabled={v.stock === 0}
                onClick={() => addToCart(product.id, v)}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="title-heart">
          <h3 className="product-name">{product.name}</h3>
          <button className="fav-btn" onClick={toggleFavorite}>
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="product-price-container">
          {product.oldPrice && (
            <span className="original-price">{product.oldPrice.toFixed(2)} €</span>
          )}
          {product.oldPrice && (
            <span className="discount-badge">
              –
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              %
            </span>
          )}
          <span className="final-price">{product.price.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}
