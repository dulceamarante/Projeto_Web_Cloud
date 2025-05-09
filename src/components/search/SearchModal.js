import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import ProductCard from '../products/ProductCard';
import './SearchModal.css';

export default function SearchModal({ onClose, onCategoryClick }) {
  const { products } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };

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

  // Esta função permite que eventos de clique passem para o SideMenu
  const handleSearchAreaClick = (e) => {
    // Se o clique for em um elemento do header ou SideMenu, não fazer nada
    // Isso permite que esses cliques sejam capturados por esses componentes
    if (
      e.target.closest('.header-item') || 
      e.target.closest('.side-menu') || 
      e.target.closest('.side-menu-wrapper')
    ) {
      return;
    }
  };

  const suggested = [...products]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 5);

  return (
    <div 
      className={`search-modal-overlay ${fadeOut ? 'fade-out' : ''}`}
      onClick={handleSearchAreaClick} // Permite clicar "através" para o SideMenu
    >
      <button className="close-modal" onClick={handleClose}>×</button>
      <div className="search-page">
        {/* Removidas as categorias MULHER, HOMEM e BEAUTY */}
        
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
                  product={{
                    ...p,
                    isFavorite: isFavorite(p.id)
                  }}
                  toggleFavorite={() => toggleFavorite(p)}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && showNoResults && (
          <div className="no-results">
            <h2>Nenhum artigo encontrado para "{searchQuery}"</h2>
            <p>Tente outros termos ou explore sugestões abaixo.</p>
          </div>
        )}

        <div className="interest-section">
          <h2 className="section-title">TALVEZ LHE INTERESSE</h2>
          <div className="products-grid">
            {suggested.map(p => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  isFavorite: isFavorite(p.id)
                }}
                toggleFavorite={() => toggleFavorite(p)}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}