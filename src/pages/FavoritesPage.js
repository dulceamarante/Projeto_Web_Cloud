// src/pages/FavoritesPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/products/ProductCard';
import { FaTrash, FaTimes } from 'react-icons/fa';
import products from '../data/products.json'; // Importar diretamente como no SimilarProducts
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, removeFromFavorites, clearFavorites } = useContext(FavoritesContext);
  const { getTopSellingProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  
  const [selectMode, setSelectMode] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  
  // update document title
  useEffect(() => {
    document.title = 'Meus Favoritos | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  
  // Lógica igual à do SimilarProducts, mas baseada nos favoritos
  useEffect(() => {
    let selectedProducts = [];
         
    if (favorites && favorites.length > 0) {
      // Extrair informações dos produtos nos favoritos (igual ao carrinho)
      const favoriteItems = favorites.map(item => item.id);
      const favoriteCategories = [...new Set(favorites.map(item => item.category))];
      const favoriteSubcategories = [...new Set(favorites.map(item => item.subcategory).filter(Boolean))];
      const favoriteGenders = [...new Set(favorites.map(item => item.gender))];
       
      // Filtrar produtos similares
      const similar = products.filter(product => {
        // Não incluir produtos que já estão nos favoritos
        if (favoriteItems.includes(product.id)) return false;
         
        // Calcular pontuação de similaridade
        let similarity = 0;
         
        // Mesma categoria = +5 pontos
        if (favoriteCategories.includes(product.category)) {
          similarity += 5;
        }
         
        // Mesma subcategoria = +3 pontos
        if (favoriteSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }
         
        // Mesmo gênero = +2 pontos
        if (favoriteGenders.includes(product.gender)) {
          similarity += 2;
        }
         
        return similarity > 0;
      });
       
      // Ordenar por similaridade e popularidade
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (favoriteCategories.includes(a.category) ? 5 : 0) +
                      (favoriteGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (favoriteCategories.includes(b.category) ? 5 : 0) +
                      (favoriteGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });
       
      // Se temos produtos similares suficientes, usar eles
      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {
        // Se não temos suficientes, misturar com produtos populares
        const popularProducts = products
          .filter(product => !favoriteItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
                 
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {
      // Se os favoritos estiverem vazios, mostrar produtos populares
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15);
    }
     
    setSimilarProducts(selectedProducts);
  }, [favorites]);
  
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
      removeFromFavorites(product.id);
      setRemovingItems(prev => prev.filter(id => id !== product.id));
    }, 400);
  };

  // Preparar os dados uniformemente
  const prepareFavoriteForCard = (product) => {
    return {
      ...product,
      isFavorite: true // Garantir que todos os favoritos têm esta flag
    };
  };

  const prepareSuggestionForCard = (product) => {
    return {
      ...product,
      isFavorite: favorites.some(fav => fav.id === product.id) // Verificar se já é favorito
    };
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
                product={prepareFavoriteForCard(prod)}
                toggleFavorite={() => toggleFavorite(prod)}
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
      
      {/* A seção de sugestões SEMPRE aparece - igual ao SimilarProducts */}
      {similarProducts && similarProducts.length > 0 && (
        <section className="similar-products-section">
          <h2>TALVEZ LHE INTERESSE</h2>
          <div className="similar-products-grid">
            {similarProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={prepareSuggestionForCard(product)}
                toggleFavorite={() => toggleFavorite(product)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}