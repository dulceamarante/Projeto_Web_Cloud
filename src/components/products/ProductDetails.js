import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { useNotification } from '../ui/NotificationSystem';
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
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { showToast, showError } = useNotification();

  const [animateHeart, setAnimateHeart] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
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

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = () => {
    // Se o produto tem variantes (tamanhos), verificar se foi selecionado
    if (product.variants && product.variants.length > 0 && !selectedSize) {
      showError("Por favor, selecione um tamanho antes de adicionar ao carrinho.", 3000);
      return;
    }

    // Adicionar ao carrinho
    addToCart(product, 1, selectedSize);
    
    // Mostrar notificação de sucesso com botão funcional VER CARRINHO
    showToast(
      "PRODUTO ADICIONADO AO CARRINHO",
      "VER CARRINHO",
      () => {
        navigate('/cart');
      }
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

  function renderStars(rating) {
    const validRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

    return (
      <>
        {[...Array(validRating)].map((_, i) => (
          <FaStar key={i} color="#ffc107" />
        ))}
        {[...Array(5 - validRating)].map((_, i) => (
          <FaRegStar key={i + validRating} color="#ccc" />
        ))}
      </>
    );
  }

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
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-value"> {product.rating}</span>
        </div>
        <p className="product-description">{product.description}</p>

        {product.oldPrice && (
          <p className="old-price">Antes: <span>{product.oldPrice.toFixed(2)} €</span></p>
        )}
        <p className="price">{product.price.toFixed(2)} €</p>

        {product.variants?.length > 0 && (
          <select 
            className="size-select"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="">Tamanho</option>
            {product.variants.map((v, index) => (
              <option key={index} value={v.size}>{v.size}</option>
            ))}
          </select>
        )}

        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
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