// src/pages/FavoritesPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext'; // Importando CartContext
import ProductCard from '../components/products/ProductCard';
import { FaTrash, FaTimes } from 'react-icons/fa';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, removeFromFavorites, clearFavorites } = useContext(FavoritesContext);
  const { getTopSellingProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext); // Adicionando acesso ao CartContext
  
  const [selectMode, setSelectMode] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);
  
  // always fetch 5 suggestions
  const suggestedProducts = getTopSellingProducts(5);
  
  // update document title
  useEffect(() => {
    document.title = 'Meus Favoritos | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  
  // Toggle select mode with animation
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
  };
  
  // Função para remover um produto com animação
  const handleRemoveProduct = (product) => {
    // Adicionar o ID do produto à lista de itens sendo removidos
    setRemovingItems(prev => [...prev, product.id]);
    
    // Aguardar a animação terminar antes de remover do estado
    setTimeout(() => {
      removeFromFavorites(product.id); // CORRIGIDO: Passar o ID em vez do produto completo
      setRemovingItems(prev => prev.filter(id => id !== product.id));
    }, 400); // Duração da animação
  };

  // Função para adicionar ao carrinho diretamente dos favoritos
  const handleAddToCart = (productId, variant) => {
    const product = favorites.find(fav => fav.id === productId);
    if (product) {
      addToCart(product, 1, variant?.size || null);
    }
  };

  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <div className="titles">
          <h1>OS MEUS ARTIGOS PREFERIDOS</h1>
          <p>Estes são os artigos de que mais gosta.</p>
          <hr className="single-line" />
        </div>
        <div className="actions">
          {!selectMode ? (
            <button
              className="select-btn"
              onClick={toggleSelectMode}
            >
              SELECIONAR
            </button>
          ) : (
            <div className="selection-controls">
              <button className="icon-btn trash-all" onClick={clearFavorites}>
                <FaTrash />
              </button>
              <button className="icon-btn close" onClick={toggleSelectMode}>
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Seção de favoritos - só aparece se houver favoritos */}
      {favorites.length > 0 ? (
        <section className="favorites-grid">
          {favorites.map(prod => (
            <div 
              key={prod.id} 
              className={`favorites-item ${removingItems.includes(prod.id) ? 'fade-out' : 'fade-in'}`}
            >
              <ProductCard
                product={{ ...prod, isFavorite: true }}
                toggleFavorite={() => toggleFavorite(prod)}
                addToCart={handleAddToCart} // Usando a função para adicionar ao carrinho
                showTrash={!selectMode} // Mostrar lixeira apenas no modo normal
                removeFromFavorites={handleRemoveProduct} // Usar a função com animação
              />
            </div>
          ))}
        </section>
      ) : (
        <div className="empty-favorites">
          <p>Ainda não tem nenhum artigo favorito.</p>
          <Link to="/" className="shop-now-btn">VOLTAR PARA A LOJA</Link>
        </div>
      )}
      
      {/* A seção de sugestões SEMPRE aparece */}
      <section className="suggestions-section">
        <h2>TALVEZ LHE INTERESSE</h2>
        <div className="suggestions-grid">
          {suggestedProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={{ 
                ...prod, 
                isFavorite: favorites.some(fav => fav.id === prod.id) 
              }}
              toggleFavorite={() => toggleFavorite(prod)}
              addToCart={handleAddToCart} // Usando a mesma função para adicionar ao carrinho
            />
          ))}
        </div>
      </section>
    </div>
  );
}