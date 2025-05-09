// src/components/layout/TopProducts.js
import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ProductCard from '../products/ProductCard';
import './TopProducts.css';

export default function TopProducts() {
  const { getTopSellingProducts, loading } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const topProducts = getTopSellingProducts(5);
  
  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!topProducts.length) return <div className="no-products">Sem produtos</div>;

  return (
    <section className="top-products-section">
      {/* Título da secção */}
      <h2 className="section-title">TOP SELLERS</h2>

      {/* Grid de produtos */}
      <div className="products-grid">
        {topProducts.map(prod => (
          <ProductCard
            key={prod.id}
            product={{
              ...prod,
              isFavorite: isFavorite(prod.id)
            }}
            toggleFavorite={() => toggleFavorite(prod)}
            addToCart={addToCart}
          />
        ))}
      </div>

      {/* Seção de responsabilidade */}
      <div className="responsibility-section">
        <div className="responsibility-content">
          <h2 className="responsibility-title">VESTIR COM CONSCIÊNCIA</h2>
          <button className="outline-button">DESCUBRA MAIS</button>
        </div>
      </div>
    </section>
  );
}