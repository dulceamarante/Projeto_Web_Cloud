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

  // Função para atualizar favoritos e localStorage
  const updateFavoritesAndStorage = (newFavorites) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addToFavorites = (product) => {
    if (!favorites.some(item => item.id === product.id)) {
      const newFavorites = [...favorites, product];
      updateFavoritesAndStorage(newFavorites);
      
      // Mostrar notificação quando produto é adicionado
      setNotification({
        message: "ADICIONADO AOS SEUS ARTIGOS PREFERIDOS",
        actionText: null
      });
      
      // Fechar a notificação após alguns segundos
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return true;
    }
    return false;
  };

  const removeFromFavorites = (productId) => {
    const productToRemove = favorites.find(item => item.id === productId);
    
    if (productToRemove) {
      // Remover o produto dos favoritos
      const newFavorites = favorites.filter(item => item.id !== productId);
      updateFavoritesAndStorage(newFavorites);
      
      // Guardar o produto removido para caso de desfazer
      setRemovedProduct(productToRemove);
      
      // Mostrar a notificação
      setNotification({
        message: "ELIMINADO DOS SEUS ARTIGOS PREFERIDOS",
        actionText: "DESFAZER",
        onAction: () => handleUndo() // Importante: Usamos uma arrow function aqui
      });

      return true;
    }
    return false;
  };

  const clearFavorites = () => {
    // Criar uma cópia dos favoritos antes de limpar
    const previousFavorites = [...favorites];
    
    // Limpar todos os favoritos
    updateFavoritesAndStorage([]);
    
    // Mostrar notificação
    setNotification({
      message: "TODOS OS FAVORITOS FORAM ELIMINADOS",
      actionText: "DESFAZER",
      onAction: () => {
        // Restaurar favoritos anteriores
        updateFavoritesAndStorage(previousFavorites);
        setNotification(null);
      }
    });
  };

  const handleUndo = () => {
    console.log("Executing handleUndo in FavoritesContext", removedProduct); // Debug log
    
    if (removedProduct) {
      // Adicionar o produto de volta aos favoritos
      const newFavorites = [...favorites, removedProduct];
      updateFavoritesAndStorage(newFavorites);
      
      // Limpar o produto removido
      setRemovedProduct(null);
      
      // Esconder a notificação
      setNotification(null);
    } else {
      console.log("No removed product to restore"); // Debug log
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

  // Mover produto para o carrinho e remover dos favoritos
  const moveToCart = (product, addToCart, removeAfterAdd = true) => {
    // Adicionar ao carrinho
    if (addToCart) {
      const selectedSize = product.selectedSize || 'M';
      addToCart(product, 1, selectedSize);
      
      // Se necessário, remover dos favoritos após adicionar ao carrinho
      if (removeAfterAdd) {
        removeFromFavorites(product.id);
      }
      
      return true;
    }
    return false;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        toggleFavorite,
        isFavorite,
        moveToCart,
        handleUndo // Expor handleUndo para uso direto se necessário
      }}
    >
      {children}
      
      {/* Exibir notificação apenas quando há uma notificação para mostrar */}
      {notification && (
        <NotificationSystem 
          message={notification.message}
          actionText={notification.actionText}
          onAction={notification.onAction}
          onClose={closeNotification}
        />
      )}
    </FavoritesContext.Provider>
  );
};