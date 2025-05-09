// src/contexts/FavoritesContext.js
import React, { createContext, useState, useEffect } from 'react';
import NotificationSystem from '../components/ui/NotificationSystem';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [removedProduct, setRemovedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Carregar favoritos do localStorage quando o componente montar
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }, []);

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  const addToFavorites = (product) => {
    if (!favorites.some(item => item.id === product.id)) {
      setFavorites(prev => [...prev, product]);
      
      // Mostrar notificação quando produto é adicionado
      setNotification({
        message: "ADICIONADO AOS SEUS ARTIGOS PREFERIDOS",
        actionText: null
      });
      
      // Fechar a notificação após alguns segundos
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const removeFromFavorites = (productId) => {
    const productToRemove = favorites.find(item => item.id === productId);
    
    if (productToRemove) {
      // Remover o produto dos favoritos
      setFavorites(prev => prev.filter(item => item.id !== productId));
      
      // Guardar o produto removido para caso de desfazer
      setRemovedProduct(productToRemove);
      
      // Mostrar a notificação
      setNotification({
        message: "ELIMINADO DOS SEUS ARTIGOS PREFERIDOS",
        actionText: "DESFAZER"
      });
    }
  };

  const clearFavorites = () => {
    // Criar uma cópia dos favoritos antes de limpar
    const previousFavorites = [...favorites];
    
    // Limpar todos os favoritos
    setFavorites([]);
    
    // Mostrar notificação
    setNotification({
      message: "TODOS OS FAVORITOS FORAM ELIMINADOS",
      actionText: "DESFAZER",
      onAction: () => {
        // Restaurar favoritos anteriores
        setFavorites(previousFavorites);
        setNotification(null);
      }
    });
  };

  const handleUndo = () => {
    if (removedProduct) {
      // Adicionar o produto de volta aos favoritos
      setFavorites(prev => [removedProduct, ...prev]);
      
      // Limpar o produto removido
      setRemovedProduct(null);
      
      // Esconder a notificação
      setNotification(null);
    }
  };

  const closeNotification = () => {
    setNotification(null);
    setRemovedProduct(null);
  };

  const toggleFavorite = (product) => {
    if (favorites.some(item => item.id === product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        toggleFavorite,
        isFavorite
      }}
    >
      {children}
      
      {/* Exibir notificação apenas quando há uma notificação para mostrar */}
      {notification && (
        <NotificationSystem 
          message={notification.message}
          actionText={notification.actionText}
          onAction={notification.onAction || handleUndo}
          onClose={closeNotification}
        />
      )}
    </FavoritesContext.Provider>
  );
};