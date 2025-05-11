// src/pages/ProductDetails.js
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import './ProductDetails.css';

export default function ProductDetails({ products }) {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const product = products.find(p => String(p.id) === id);

  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-details-page">
      <div className="product-image-column">
        <img src={product.images?.[0] || product.image} alt={product.name} />
      </div>

      <div className="product-info-column">
        <h1 className="product-title">{product.name}</h1>
        <div className="rating">Rating: <span className="rating-value">{product.rating}</span></div>
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

        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product, 1)}
        >
          Adicionar ao cesto
        </button>

      </div>
    </div>
  );
}
