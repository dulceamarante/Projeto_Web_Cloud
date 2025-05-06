import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import './SearchPage.css';

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  
  // Usando o contexto de produtos
  const { products } = useContext(ProductContext);

  useEffect(() => {
    // Realizar pesquisa inicial se houver uma query
    if (initialQuery && products && products.length > 0) {
      handleSearch();
    }
  }, [initialQuery, products]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Filtrar produtos com base na consulta
    const results = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };

  // Selecionar produtos populares para a seção "TALVEZ LHE INTERESSE"
  const suggestedProducts = products && products.length > 0 
    ? [...products]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
    : [];

  return (
    <div className="search-page">
      {/* Menu de navegação superior */}
      <div className="category-nav">
        <Link to="/products?category=mulher">MULHER</Link>
        <Link to="/products?category=homem">HOMEM</Link>
        <Link to="/products?category=criancas">CRIANÇAS</Link>
        <Link to="/products?category=home">HOME</Link>
      </div>

      {/* Campo de pesquisa centralizado */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O QUE PROCURA?"
            className="search-input"
            autoFocus
            onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          />
        </form>
      </div>

      {/* Seção de resultados da pesquisa */}
      {searchQuery && searchResults.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">RESULTADOS DA PESQUISA</h2>
          <div className="products-grid">
            {searchResults.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image" 
                    />
                    <button className="add-button">+</button>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price-container">
                      {product.oldPrice ? (
                        <>
                          <span className="original-price">{product.oldPrice.toFixed(2)} EUR</span>
                          <span className="discount-badge">
                            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                          </span>
                          <span className="final-price">{product.price.toFixed(2)} EUR</span>
                        </>
                      ) : (
                        <span className="final-price">{product.price.toFixed(2)} EUR</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {searchQuery && searchResults.length === 0 && (
        <div className="no-results">
          <h2>Nenhum resultado encontrado para "{searchQuery}"</h2>
          <p>Tente outros termos ou navegue por nossas categorias.</p>
        </div>
      )}

      {/* Seção "TALVEZ LHE INTERESSE" */}
      <div className="interest-section">
        <h2 className="section-title">TALVEZ LHE INTERESSE</h2>
        <div className="products-grid">
          {suggestedProducts.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image" 
                  />
                  <button className="add-button">+</button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-container">
                    {product.oldPrice ? (
                      <>
                        <span className="original-price">{product.oldPrice.toFixed(2)} EUR</span>
                        <span className="discount-badge">
                          -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                        </span>
                        <span className="final-price">{product.price.toFixed(2)} EUR</span>
                      </>
                    ) : (
                      <span className="final-price">{product.price.toFixed(2)} EUR</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;