// src/components/layout/TopProducts.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ProductCard from '../products/ProductCard';
import './TopProducts.css';

export default function TopProducts() {
  const { products, loading } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
 
  // Filter products to only show women's products and then get top sellers
  const getTopSellingWomenProducts = (count) => {
    // Filter products for women only
    const womenProducts = products.filter(product => 
      product.gender?.toLowerCase() === 'beauty'
    );
    
    // Sort by popularity (highest first)
    const sorted = [...womenProducts].sort((a, b) => b.popularity - a.popularity);
    
    // Return the top N products
    return sorted.slice(0, count);
  };
 
  const topProducts = getTopSellingWomenProducts(5);
 
  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };
 
  if (loading) return <div className="loading">Carregando...</div>;
  if (!topProducts.length) return <div className="no-products">Sem produtos para beauty</div>;
 
  return (
    <section className="top-products-section">
      {/* Título da secção */}
      <h2 className="section-title">TOP SELLERS BEAUTY</h2>
     
      {/* Grid de produtos */}
      <div className="products-grid">
        {topProducts.map(prod => (
          <ProductCard
            key={prod.id}
            product={{
              ...prod,
              isFavorite: isFavorite(prod.id)
            }}
            addToCart={addToCart}
          />
        ))}
      </div>
     
      {/* Seção de responsabilidade */}
      <div className="responsibility-section">
        <div className="responsibility-content">
          <h2 className="responsibility-title">VESTIR COM CONSCIÊNCIA</h2>
          <Link to="/responsibility">
            <button className="outline-button">DESCOBRIR MAIS</button>
          </Link>
        </div>
      </div>
    </section>
  );
}