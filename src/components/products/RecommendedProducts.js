
import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from './ProductCard'; 
import './RecommendedProducts.css';


export default function RecommendedProducts({
  title = "VIU RECENTEMENTE",
  limit = 5
}) {
  const { getRecentlyViewedProducts } = useContext(ProductContext);
  

  const products = getRecentlyViewedProducts ? getRecentlyViewedProducts(limit) : [];
  

  const hasProducts = products && products.length > 0;
  
  return (
    <section className="recommended-products-section">
      <h2>{title}</h2>
      
      {hasProducts ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="no-products-message">
          <p>Ainda não viu nenhum artigo</p>
          <p className="suggestion">Explore a nossa loja e descubra artigos!</p>
        </div>
      )}
    </section>
  );
}