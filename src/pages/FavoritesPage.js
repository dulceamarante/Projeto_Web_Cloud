
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/products/ProductCard';
import { FaTrash, FaTimes } from 'react-icons/fa';
import products from '../data/products.json'; 
import './FavoritesPage.css';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, removeFromFavorites, clearFavorites } = useContext(FavoritesContext);
  const { getTopSellingProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  
  const [selectMode, setSelectMode] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  

  useEffect(() => {
    document.title = 'Meus Favoritos | BDRP';
    return () => { document.title = 'BDRP'; };
  }, []);
  

  useEffect(() => {
    let selectedProducts = [];
         
    if (favorites && favorites.length > 0) {

      const favoriteItems = favorites.map(item => item.id);
      const favoriteCategories = [...new Set(favorites.map(item => item.category))];
      const favoriteSubcategories = [...new Set(favorites.map(item => item.subcategory).filter(Boolean))];
      const favoriteGenders = [...new Set(favorites.map(item => item.gender))];
       
      
      const similar = products.filter(product => {
        
        if (favoriteItems.includes(product.id)) return false;
         
        
        let similarity = 0;
         
        
        if (favoriteCategories.includes(product.category)) {
          similarity += 5;
        }
         
        
        if (favoriteSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }
         
        
        if (favoriteGenders.includes(product.gender)) {
          similarity += 2;
        }
         
        return similarity > 0;
      });
       
      
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (favoriteCategories.includes(a.category) ? 5 : 0) +
                      (favoriteGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (favoriteCategories.includes(b.category) ? 5 : 0) +
                      (favoriteGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });
       
      
      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {
        
        const popularProducts = products
          .filter(product => !favoriteItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
                 
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {
      
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15);
    }
     
    setSimilarProducts(selectedProducts);
  }, [favorites]);
  
  
  const toggleSelectMode = () => {
    setSelectMode(prev => !prev);
  };
  
  
  const handleRemoveProduct = (product) => {
    
    setRemovingItems(prev => [...prev, product.id]);
    
    
    setTimeout(() => {
      removeFromFavorites(product.id);
      setRemovingItems(prev => prev.filter(id => id !== product.id));
    }, 400);
  };

 
  const prepareFavoriteForCard = (product) => {
    return {
      ...product,
      isFavorite: true 
    };
  };

  const prepareSuggestionForCard = (product) => {
    return {
      ...product,
      isFavorite: favorites.some(fav => fav.id === product.id) 
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