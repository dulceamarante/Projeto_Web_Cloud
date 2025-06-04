import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ProductCard from '../products/ProductCard';
import './TopProducts.css';

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  // Encontrar produtos do backend
  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar produtos');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  const getTopSellingWomenProducts = (count) => {
    const womenProducts = products.filter(product =>
      product.gender?.toLowerCase() === 'mulher'
    );
    const sorted = [...womenProducts].sort((a, b) => b.popularity - a.popularity);
    return sorted.slice(0, count);
  };

  const topProducts = getTopSellingWomenProducts(5);

  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant?.size || 'único'}) adicionado!`);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!topProducts.length) return <div className="no-products">Sem produtos para mulher</div>;

  return (
    <section className="top-products-section">
      <h2 className="section-title">TOP SELLERS MULHER</h2>

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
