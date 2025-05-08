import React, { useContext, useState } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from '../products/ProductCard';
import './TopProducts.css';

export default function TopProducts() {
  const { getTopSellingProducts, loading } = useContext(ProductContext);
  const [favorites, setFavorites] = useState([]);
  
  const topProducts = getTopSellingProducts(5);

  const toggleFavorite = (productId) => {
    setFavorites(favs =>
      favs.includes(productId)
        ? favs.filter(id => id !== productId)
        : [...favs, productId]
    );
  };

  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!topProducts.length) return <div className="no-products">Sem produtos</div>;

  return (
    <section className="top-products-section">
      <div className="top-products-inner">
        <h2 className="section-title">MAIS VENDIDOS</h2>
        <div className="products-grid">
          {topProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={{
                ...prod,
                isFavorite: favorites.includes(prod.id)
              }}
              toggleFavorite={toggleFavorite}
              addToCart={addToCart}
            />
          ))}
        </div>

        <div className="responsibility-section">
          <div className="responsibility-content">
            <h2>VESTIR COM CONSCIÊNCIA</h2>
            <button className="outline-button">DESCUBRA MAIS</button>
          </div>
        </div>
      </div>
    </section>
  );
}
