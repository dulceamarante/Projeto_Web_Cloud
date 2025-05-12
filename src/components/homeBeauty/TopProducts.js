
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ProductCard from '../products/ProductCard';
import './TopProducts.css';

export default function TopProducts() {
  const { products, loading } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
 

  const getTopSellingWomenProducts = (count) => {

    const womenProducts = products.filter(product => 
      product.gender?.toLowerCase() === 'beauty'
    );
    

    const sorted = [...womenProducts].sort((a, b) => b.popularity - a.popularity);
    

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

      <h2 className="section-title">TOP SELLERS BEAUTY</h2>
     

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