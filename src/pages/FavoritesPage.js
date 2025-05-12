
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/products/ProductCard';
import { FaTrash, FaTimes } from 'react-icons/fa';
import products from '../data/products.json'; 
import './FavoritesPage.css';

// Componente principal da página de favoritos
export default function FavoritesPage() {
  // Funções e dados do contexto de favoritos
  const { favorites, toggleFavorite, removeFromFavorites, clearFavorites } = useContext(FavoritesContext);

  // Funções relacionadas com os produtos
  const { getTopSellingProducts } = useContext(ProductContext);

  // Função para adicionar artigos ao carrinho 
  const { addToCart } = useContext(CartContext);
  
  // Estado para controlar se o modo de seleção está ativo
  const [selectMode, setSelectMode] = useState(false);
  // Estado para controlar os produtos a serem removidos (para efeitos de animação)
  const [removingItems, setRemovingItems] = useState([]);
  // Estado que guarda os produtos sugeridos com base nos favoritos
  const [similarProducts, setSimilarProducts] = useState([]);
  
  // Efeito para alterar o título da página
  useEffect(() => {
    document.title = 'Meus Favoritos | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  
  // Efeito que atualiza os produtos sugeridos sempre que os favoritos mudam
  useEffect(() => {
    let selectedProducts = [];
    
    if (favorites && favorites.length > 0) {
      // Obtenção de dados dos artigos favoritos
      const favoriteItems = favorites.map(item => item.id);
      const favoriteCategories = [...new Set(favorites.map(item => item.category))];
      const favoriteSubcategories = [...new Set(favorites.map(item => item.subcategory).filter(Boolean))];
      const favoriteGenders = [...new Set(favorites.map(item => item.gender))];

      // Filtra produtos semelhantes com base na categoria, subcategoria e género
      const similar = products.filter(product => {
        if (favoriteItems.includes(product.id)) return false;

        let similarity = 0;

        if (favoriteCategories.includes(product.category)) similarity += 5;
        if (favoriteSubcategories.includes(product.subcategory)) similarity += 3;
        if (favoriteGenders.includes(product.gender)) similarity += 2;

        return similarity > 0;
      });

      // Ordena os produtos semelhantes por relevância e popularidade
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (favoriteCategories.includes(a.category) ? 5 : 0) +
                      (favoriteGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (favoriteCategories.includes(b.category) ? 5 : 0) +
                      (favoriteGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });

      // Seleciona os 15 produtos mais relevantes
      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {
        // Se forem poucos semelhantes, completa com os mais populares
        const popularProducts = products
          .filter(product => !favoriteItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);

        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {
      // Se não houver favoritos, mostra apenas os produtos mais populares
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15);
    }

    // Atualiza o estado com os produtos sugeridos
    setSimilarProducts(selectedProducts);
  }, [favorites]);

  // Alterna o modo de seleção
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
  };

  // Função para remover um produto dos favoritos com animação
  const handleRemoveProduct = (product) => {
    setRemovingItems(prev => [...prev, product.id]);

    setTimeout(() => {
      removeFromFavorites(product.id);
      setRemovingItems(prev => prev.filter(id => id !== product.id));
    }, 400); // tempo da animação antes de remover
  };

  // Adiciona propriedade ao produto favorito para passar ao componente ProductCard
  const prepareFavoriteForCard = (product) => {
    return {
      ...product,
      isFavorite: true
    };
  };

  // Verifica se um produto sugerido já é favorito
  const prepareSuggestionForCard = (product) => {
    return {
      ...product,
      isFavorite: favorites.some(fav => fav.id === product.id)
    };
  };

  return (
    <div className="favorites-page">
      {/* Cabeçalho com título e botões de ação */}
      <header className="favorites-header">
        <div className="titles">
          <h1>OS MEUS ARTIGOS PREFERIDOS</h1>
          <p>Estes são os artigos de que mais gosta.</p>
          <hr className="single-line" />
        </div>
        <div className="actions">
          {/* Alterna entre modo normal e modo de seleção */}
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

      {/* Lista de favoritos */}
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
        // Mensagem para quando não há favoritos
        <div className="empty-favorites">
          <p>Ainda não tem nenhum artigo favorito.</p>
          <Link to="/" className="shop-now-btn">VOLTAR PARA A LOJA</Link>
        </div>
      )}
      
      {/* Secção de sugestões de produtos semelhantes */}
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
