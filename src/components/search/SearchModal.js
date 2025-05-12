import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { CartContext } from '../../contexts/CartContext';
import ProductCard from '../products/ProductCard';
import './SearchModal.css';

export default function SearchModal({ onClose, onCategoryClick }) {
  const { products } = useContext(ProductContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { cart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [interestedProducts, setInterestedProducts] = useState([]);

  const navigate = useNavigate();

  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };

  // Função para calcular produtos similares baseado no carrinho
  const calculateCartBasedSuggestions = () => {
    let selectedProducts = [];

    if (cart && cart.length > 0) {
      // Extrair informações dos produtos no carrinho
      const cartItems = cart.map(item => item.id);
      const cartCategories = [...new Set(cart.map(item => item.category))];
      const cartSubcategories = [...new Set(cart.map(item => item.subcategory).filter(Boolean))];
      const cartGenders = [...new Set(cart.map(item => item.gender))];

      // Filtrar produtos similares
      const similar = products.filter(product => {
        // Não incluir produtos que já estão no carrinho
        if (cartItems.includes(product.id)) return false;

        // Calcular pontuação de similaridade
        let similarity = 0;

        // Mesma categoria = +5 pontos
        if (cartCategories.includes(product.category)) {
          similarity += 5;
        }

        // Mesma subcategoria = +3 pontos
        if (cartSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }

        // Mesmo gênero = +2 pontos
        if (cartGenders.includes(product.gender)) {
          similarity += 2;
        }

        return similarity > 0;
      });

      // Ordenar por similaridade e popularidade
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (cartCategories.includes(a.category) ? 5 : 0) +
                      (cartGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (cartCategories.includes(b.category) ? 5 : 0) +
                      (cartGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });

      // Se temos produtos similares suficientes, usar eles
      if (sortedSimilar.length >= 5) {
        selectedProducts = sortedSimilar.slice(0, 5);
      } else {
        // Se não temos suficientes, misturar com produtos populares
        const popularProducts = products
          .filter(product => !cartItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
        
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 5);
      }
    } else {
      // Se o carrinho estiver vazio, mostrar produtos populares
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5);
    }

    return selectedProducts;
  };

  // Função melhorada para calcular produtos relacionados com a busca
  const calculateSearchBasedSuggestions = (query) => {
    if (!query.trim()) {
      return calculateCartBasedSuggestions();
    }

    // Se temos resultados de busca, analisar suas categorias predominantes
    let dominantCategories = [];
    let dominantGenders = [];
    let dominantSubcategories = [];

    if (searchResults.length > 0) {
      // Analisar categorias dos resultados da busca
      const categoryCount = {};
      const genderCount = {};
      const subcategoryCount = {};

      searchResults.forEach(result => {
        // Contar categorias
        categoryCount[result.category] = (categoryCount[result.category] || 0) + 1;
        
        // Contar gêneros
        if (result.gender) {
          genderCount[result.gender] = (genderCount[result.gender] || 0) + 1;
        }
        
        // Contar subcategorias
        if (result.subcategory) {
          subcategoryCount[result.subcategory] = (subcategoryCount[result.subcategory] || 0) + 1;
        }
      });

      // Ordenar por frequência e pegar as mais comuns
      dominantCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .map(([category]) => category);
      
      dominantGenders = Object.entries(genderCount)
        .sort(([,a], [,b]) => b - a)
        .map(([gender]) => gender);
      
      dominantSubcategories = Object.entries(subcategoryCount)
        .sort(([,a], [,b]) => b - a)
        .map(([subcategory]) => subcategory);
    }

    // Normalizar e dividir a query em termos
    const queryTerms = query.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .filter(term => term.length > 1);

    if (queryTerms.length === 0 && dominantCategories.length === 0) {
      return calculateCartBasedSuggestions();
    }

    // IDs dos produtos que já aparecem nos resultados de busca
    const searchResultIds = searchResults.map(r => r.id);

    // Calcular relevância dos produtos baseado na query E nas categorias dos resultados
    const scoredProducts = products
      .filter(product => !searchResultIds.includes(product.id))
      .map(product => {
        let score = 0;
        
        // Criar texto pesquisável do produto
        const productText = {
          name: product.name.toLowerCase(),
          description: (product.description || '').toLowerCase(),
          category: product.category.toLowerCase(),
          subcategory: (product.subcategory || '').toLowerCase(),
          gender: product.gender.toLowerCase(),
          tags: ((product.tags || []).join(' ')).toLowerCase(),
          all: [
            product.name,
            product.description || '',
            product.category,
            product.subcategory || '',
            product.gender,
            ...(product.tags || [])
          ].join(' ').toLowerCase()
        };

        // ALTA PRIORIDADE: Mesma categoria que os resultados da busca
        if (dominantCategories.length > 0) {
          if (dominantCategories[0] === product.category) {
            score += 15; // Muito importante!
          } else if (dominantCategories.includes(product.category)) {
            score += 10;
          }
        }

        // ALTA PRIORIDADE: Mesma subcategoria que os resultados
        if (dominantSubcategories.length > 0) {
          if (dominantSubcategories[0] === product.subcategory) {
            score += 12;
          } else if (dominantSubcategories.includes(product.subcategory)) {
            score += 8;
          }
        }

        // MÉDIA PRIORIDADE: Mesmo gênero
        if (dominantGenders.length > 0) {
          if (dominantGenders.includes(product.gender)) {
            score += 5;
          }
        }

        // BAIXA PRIORIDADE: Pontuação para termos específicos da query
        queryTerms.forEach(term => {
          // Match exato no nome = 6 pontos
          if (productText.name.includes(term)) {
            score += 6;
          }
          
          // Match na categoria = 4 pontos
          if (productText.category.includes(term)) {
            score += 4;
          }
          
          // Match na subcategoria = 3 pontos
          if (productText.subcategory.includes(term)) {
            score += 3;
          }
          
          // Match no gênero = 2 pontos
          if (productText.gender.includes(term)) {
            score += 2;
          }
          
          // Match nas tags = 2 pontos
          if (productText.tags.includes(term)) {
            score += 2;
          }
          
          // Match na descrição = 1 ponto
          if (productText.description.includes(term)) {
            score += 1;
          }
        });

        // Bonus por popularidade (máximo +2 pontos)
        if (score > 0) {
          score += Math.min(product.popularity / 1000, 2);
        }

        return { ...product, score };
      })
      .filter(product => product.score > 0)
      .sort((a, b) => b.score - a.score);

    // Se não encontrou produtos relacionados suficientes, usar sugestões baseadas no carrinho
    if (scoredProducts.length < 2) {
      return calculateCartBasedSuggestions();
    }

    // Pegar os 5 melhores produtos relacionados
    return scoredProducts.slice(0, 5);
  };

  // Effect para calcular produtos de interesse baseado na query e carrinho
  useEffect(() => {
    const suggestions = calculateSearchBasedSuggestions(searchQuery);
    setInterestedProducts(suggestions);
  }, [searchQuery, searchResults, cart, products]);

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

  const handleSearch = e => {
    e.preventDefault();
    setShowNoResults(true);
  };

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 300);
  };

  const handleSearchAreaClick = (e) => {
    if (
      e.target.closest('.header-item') ||
      e.target.closest('.side-menu') ||
      e.target.closest('.side-menu-wrapper')
    ) {
      return;
    }
  };

  const handleProductClick = (productId) => {
    handleClose(); // fade out + fechar modal
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 300); // espera a animação terminar
  };

  // Determinar o título da seção baseado no contexto
  const getSectionTitle = () => {
    if (searchQuery.trim()) {
      return 'PRODUTOS RELACIONADOS';
    }
    return cart && cart.length > 0 ? 'TALVEZ LHE INTERESSE' : 'PRODUTOS POPULARES';
  };

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