// Importações do React e do contexto de produtos
import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from './ProductCard'; 
import './RecommendedProducts.css';

// Componente que mostra produtos recentemente visualizados
export default function RecommendedProducts({
  title = "VIU RECENTEMENTE", // Título padrão
  limit = 5                   // Número máximo de produtos a mostrar
}) {
  // Acede à função que obtém os produtos visualizados recentemente
  const { getRecentlyViewedProducts } = useContext(ProductContext);
  
  // Obtém os produtos, limitado pelo valor passado como prop
  const products = getRecentlyViewedProducts ? getRecentlyViewedProducts(limit) : [];
  
  // Verifica se há produtos para mostrar
  const hasProducts = products && products.length > 0;
  
  return (
    <section className="recommended-products-section">
      {/* Título da secção */}
      <h2>{title}</h2>
      
      {/* Mostra os produtos se existirem */}
      {hasProducts ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} // Passa o produto como prop
            />
          ))}
        </div>
      ) : (
        // Caso não existam produtos visualizados recentemente
        <div className="no-products-message">
          <p>Ainda não viu nenhum artigo</p>
          <p className="suggestion">Explore a nossa loja e descubra artigos!</p>
        </div>
      )}
    </section>
  );
}
