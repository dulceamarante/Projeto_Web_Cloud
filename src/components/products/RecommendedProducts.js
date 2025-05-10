// src/components/products/RecommendedProducts.js
import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from './ProductCard'; // Importa o ProductCard existente
import './RecommendedProducts.css';

/**
 * Componente para exibir produtos vistos recentemente
 * Sempre exibe a seção, mesmo quando não há produtos
 */
export default function RecommendedProducts({
  title = "VIU RECENTEMENTE",
  limit = 5
}) {
  const { getRecentlyViewedProducts } = useContext(ProductContext);
  
  // Obter produtos vistos recentemente
  const products = getRecentlyViewedProducts ? getRecentlyViewedProducts(limit) : [];
  
  // Verificar se há produtos para mostrar
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