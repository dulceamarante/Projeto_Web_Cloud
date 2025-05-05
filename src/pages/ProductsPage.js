import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import './ProductsPage.css';

const ProductsPage = () => {
  const location = useLocation();
  const { filteredProducts, updateFilters, loading } = useContext(ProductContext);
  
  useEffect(() => {
    // Extrair filtros da URL se existirem
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const search = queryParams.get('search');
    
    // Aplicar filtros
    if (category || search) {
      updateFilters({
        category: category || '',
        search: search || ''
      });
    }
  }, [location.search, updateFilters]);

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Produtos</h1>
          <span className="products-count">
            {filteredProducts.length} produtos encontrados
          </span>
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <a href={`/product/${product.id}`} className="product-image">
                <img src={product.image} alt={product.name} />
              </a>
              
              <div className="product-info">
                <div className="product-category">
                  {product.category} {product.subcategory && `• ${product.subcategory}`}
                </div>
                <a href={`/product/${product.id}`} className="product-name">
                  {product.name}
                </a>
                <div className="product-price">
                  {product.price.toFixed(2)} €
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;