import React from 'react';
import { Link } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = ({ products }) => {
  return (
    <div className="products-grid">
      {products.map((product) => {
        // Verificar se há preço antigo para calcular desconto
        const hasDiscount = product.oldPrice && product.oldPrice > product.price;
        const discountPercentage = hasDiscount 
          ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
          : 0;

        return (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image" 
                />
                <button className="add-button">+</button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-container">
                  {hasDiscount && (
                    <>
                      <span className="original-price">{product.oldPrice.toFixed(2)} EUR</span>
                      <span className="discount-badge">{discountPercentage}%</span>
                    </>
                  )}
                  <span className="final-price">
                    {product.price.toFixed(2)} EUR
                  </span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;