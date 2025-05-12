// Importações de dependências e contextos
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import ProductCard from '../products/ProductCard';
import './SearchModal.css';

// Componente modal para pesquisa de produtos
export default function SearchModal({ onClose, onCategoryClick }) {
  // Contextos
  const { products } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { cart } = useContext(CartContext);

  // Estados
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [interestedProducts, setInterestedProducts] = useState([]);

  const navigate = useNavigate();

  // Simula o adicionar ao carrinho
  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };

  // Sugestões baseadas no carrinho (semelhança por categoria, subcategoria, género)
  const calculateCartBasedSuggestions = () => {
    let selectedProducts = [];

    if (cart && cart.length > 0) {
      const cartItems = cart.map(item => item.id);
      const cartCategories = [...new Set(cart.map(item => item.category))];
      const cartSubcategories = [...new Set(cart.map(item => item.subcategory).filter(Boolean))];
      const cartGenders = [...new Set(cart.map(item => item.gender))];

      const similar = products.filter(product => {
        if (cartItems.includes(product.id)) return false;

        let similarity = 0;
        if (cartCategories.includes(product.category)) similarity += 5;
        if (cartSubcategories.includes(product.subcategory)) similarity += 3;
        if (cartGenders.includes(product.gender)) similarity += 2;

        return similarity > 0;
      });

      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (cartCategories.includes(a.category) ? 5 : 0) +
                      (cartGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (cartCategories.includes(b.category) ? 5 : 0) +
                      (cartGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });

      if (sortedSimilar.length >= 5) {
        selectedProducts = sortedSimilar.slice(0, 5);
      } else {
        const popularProducts = products
          .filter(p => !cartItems.includes(p.id) && !sortedSimilar.includes(p))
          .sort((a, b) => b.popularity - a.popularity);
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 5);
      }
    } else {
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5);
    }

    return selectedProducts;
  };

  // Sugestões com base no que foi pesquisado
  const calculateSearchBasedSuggestions = (query) => {
    if (!query.trim()) return calculateCartBasedSuggestions();

    let dominantCategories = [], dominantGenders = [], dominantSubcategories = [];

    // Identifica padrões nos resultados da pesquisa
    if (searchResults.length > 0) {
      const categoryCount = {}, genderCount = {}, subcategoryCount = {};
      searchResults.forEach(result => {
        categoryCount[result.category] = (categoryCount[result.category] || 0) + 1;
        if (result.gender) genderCount[result.gender] = (genderCount[result.gender] || 0) + 1;
        if (result.subcategory) subcategoryCount[result.subcategory] = (subcategoryCount[result.subcategory] || 0) + 1;
      });

      dominantCategories = Object.entries(categoryCount).sort(([,a],[,b]) => b - a).map(([cat]) => cat);
      dominantGenders = Object.entries(genderCount).sort(([,a],[,b]) => b - a).map(([g]) => g);
      dominantSubcategories = Object.entries(subcategoryCount).sort(([,a],[,b]) => b - a).map(([sc]) => sc);
    }

    // Prepara os termos da pesquisa
    const queryTerms = query.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .filter(term => term.length > 1);

    if (queryTerms.length === 0 && dominantCategories.length === 0) {
      return calculateCartBasedSuggestions();
    }

    const searchResultIds = searchResults.map(r => r.id);

    const scoredProducts = products
      .filter(product => !searchResultIds.includes(product.id))
      .map(product => {
        let score = 0;
        const productText = {
          name: product.name.toLowerCase(),
          description: (product.description || '').toLowerCase(),
          category: product.category.toLowerCase(),
          subcategory: (product.subcategory || '').toLowerCase(),
          gender: product.gender.toLowerCase(),
          tags: ((product.tags || []).join(' ')).toLowerCase(),
        };

        // Pontuação por correspondência com dominantes
        if (dominantCategories.includes(product.category)) {
          score += dominantCategories[0] === product.category ? 15 : 10;
        }
        if (dominantSubcategories.includes(product.subcategory)) {
          score += dominantSubcategories[0] === product.subcategory ? 12 : 8;
        }
        if (dominantGenders.includes(product.gender)) {
          score += 5;
        }

        // Pontuação por termos da pesquisa
        queryTerms.forEach(term => {
          if (productText.name.includes(term)) score += 6;
          if (productText.category.includes(term)) score += 4;
          if (productText.subcategory.includes(term)) score += 3;
          if (productText.gender.includes(term)) score += 2;
          if (productText.tags.includes(term)) score += 2;
          if (productText.description.includes(term)) score += 1;
        });

        if (score > 0) score += Math.min(product.popularity / 1000, 2);

        return { ...product, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredProducts.length < 2
      ? calculateCartBasedSuggestions()
      : scoredProducts.slice(0, 5);
  };

  // Atualiza as sugestões sempre que os dados mudam
  useEffect(() => {
    const suggestions = calculateSearchBasedSuggestions(searchQuery);
    setInterestedProducts(suggestions);
  }, [searchQuery, searchResults, cart, products]);

  // Atualiza os resultados de pesquisa quando o utilizador escreve
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const base = filterCategory
      ? products.filter(p => p.category.toLowerCase() === filterCategory)
      : products;

    const results = base.filter(p =>
      [p.name, p.description, p.category]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }, [searchQuery, filterCategory, products]);

  // Handlers
  const handleSearch = e => {
    e.preventDefault();
    setShowNoResults(true);
  };

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 300);
  };

  const handleSearchAreaClick = e => {
    if (
      e.target.closest('.header-item') ||
      e.target.closest('.side-menu') ||
      e.target.closest('.side-menu-wrapper')
    ) return;
  };

  const handleProductClick = productId => {
    handleClose();
    setTimeout(() => navigate(`/product/${productId}`), 300);
  };

  const getSectionTitle = () => {
    if (searchQuery.trim()) return 'PRODUTOS RELACIONADOS';
    return cart && cart.length > 0 ? 'TALVEZ LHE INTERESSE' : 'PRODUTOS POPULARES';
  };

  // Render
  return (
    <div
      className={`search-modal-overlay ${fadeOut ? 'fade-out' : ''}`}
      onClick={handleSearchAreaClick}
    >
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
                <div
                  key={p.id}
                  className="clickable-card"
                  onClick={() => handleProductClick(p.id)}
                >
                  <ProductCard
                    product={{ ...p, isFavorite: isFavorite(p.id) }}
                    toggleFavorite={() => toggleFavorite(p)}
                    addToCart={addToCart}
                  />
                </div>
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
          <h2 className="section-title">{getSectionTitle()}</h2>
          <div className="products-grid">
            {interestedProducts.map(p => (
              <div
                key={p.id}
                className="clickable-card"
                onClick={() => handleProductClick(p.id)}
              >
                <ProductCard
                  product={{ ...p, isFavorite: isFavorite(p.id) }}
                  toggleFavorite={() => toggleFavorite(p)}
                  addToCart={addToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
