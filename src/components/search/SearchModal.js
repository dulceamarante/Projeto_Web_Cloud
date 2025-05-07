import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import ProductCard from '../products/ProductCard';
import './SearchModal.css';

export default function SearchModal({ onClose }) {
  const { products, addToCart, toggleFavorite } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const base = filterCategory
      ? products.filter(p => p.category.toLowerCase() === filterCategory)
      : products;
    setSearchResults(
      base.filter(p =>
        [p.name, p.description, p.category]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, filterCategory, products]);

  const handleSearch = e => {
    e.preventDefault();
    setShowNoResults(true);
  };

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 300);
  };

  const suggested = [...products]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 5);

  return (
    <div className={`search-modal-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <button className="close-modal" onClick={handleClose}>×</button>
      <div className="search-page">
        <div className="search-header">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="O QUE PROCURA?"
              className="search-input"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowNoResults(false);
              }}
              autoFocus
            />
          </form>
        </div>

        {searchQuery && searchResults.length > 0 && (
          <div className="results-section">
            <h2 className="section-title">RESULTADOS DA PESQUISA</h2>
            <div className="products-grid">
              {searchResults.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  addToCart={addToCart}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && showNoResults && (
          <div className="no-results">
            <h2>Nenhum artigo encontrado para “{searchQuery}”</h2>
            <p>Tente outros termos ou explore sugestões abaixo.</p>
          </div>
        )}

        <div className="interest-section">
          <h2 className="section-title">TALVEZ LHE INTERESSE</h2>
          <div className="products-grid">
            {suggested.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
