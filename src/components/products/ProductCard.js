// src/components/products/ProductCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  
  const favorited = isFavorite(product.id);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
        
        <div className="product-actions">
          <button
            className={`favorite-btn ${favorited ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product);
            }}
            aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <i className={favorited ? 'fas fa-heart' : 'far fa-heart'}></i>
          </button>
          
          <button
            className="add-to-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            aria-label="Adicionar ao carrinho"
          >
            <i className="fas fa-shopping-bag"></i>
          </button>
        </div>
      </Link>
      
      <div className="product-info">
        <div className="product-category">
          {product.category} {product.subcategory && `• ${product.subcategory}`}
        </div>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-price">
          {product.oldPrice && (
            <span className="old-price">{product.oldPrice.toFixed(2)} €</span>
          )}
          <span className="current-price">{product.price.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;