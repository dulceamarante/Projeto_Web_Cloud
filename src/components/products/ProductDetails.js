import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';
import './ProductDetails.css';

export default function ProductDetails({ products }) {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  const [animateHeart, setAnimateHeart] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const favBtnRef = useRef(null);

  const product = products.find(p => String(p.id) === id);
  const isProductFavorite = isFavorite(product?.id);

  const handleToggleFavorite = e => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product);
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1200);
  };

  const prev = () => {
    setCurrentImage(i =>
      i === 0 ? (product.images?.length || 1) - 1 : i - 1
    );
  };

  const next = () => {
    setCurrentImage(i =>
      i === (product.images?.length || 1) - 1 ? 0 : i + 1
    );
  };

  useEffect(() => {
    if (animateHeart) {
      const timer = setTimeout(() => {
        setAnimateHeart(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [animateHeart]);

  const renderStars = rating => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} color="#ffc107" />)}
        {hasHalf && <FaStarHalfAlt color="#ffc107" />}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} color="#ffc107" />)}
      </>
    );
  };

  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-details-page">
      <div className="product-image-column">
        <div className="image-wrapper">
          <img
            src={product.images?.[currentImage] || product.image}
            alt={product.name}
            className="product-detail-image"
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
        </div>
      </div>

      <div className="product-info-column">
        <h1 className="product-title">{product.name}</h1>
            <div className="rating">
            Rating: 
            <span className="rating-value">{product.rating}</span>
            <span className="stars">{renderStars(product.rating)}</span>
            </div>
                    <p className="product-description">{product.description}</p>

        {product.oldPrice && (
          <p className="old-price">Antes: <span>{product.oldPrice.toFixed(2)} €</span></p>
        )}
        <p className="price">{product.price.toFixed(2)} €</p>

        {product.variants?.length > 0 && (
          <select className="size-select">
            <option value="">Tamanho</option>
            {product.variants.map((v, index) => (
              <option key={index} value={v.size}>{v.size}</option>
            ))}
          </select>
        )}

        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product, 1)}
          >
            Adicionar ao cesto
          </button>

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
