// src/contexts/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const FavoritesContext = createContext();

const FavoritesProviderComponent = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showToast, showUndoableToast } = useNotification();
  const previousStateRef = useRef(null);
  
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
  const updateFavoritesAndStorage = useCallback((newFavorites) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);

  // Função para salvar estado antes de uma ação
  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...favorites];
  }, [favorites]);

  const addToFavorites = useCallback((product) => {
    if (!favorites.some(item => item.id === product.id)) {
      const newFavorites = [...favorites, product];
      updateFavoritesAndStorage(newFavorites);
      
      // Mostrar notificação quando produto é adicionado
      showToast("ADICIONADO AOS SEUS ARTIGOS PREFERIDOS", null, null, 3000);
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showToast]);

  const removeFromFavorites = useCallback((productId) => {
    // SALVAR ESTADO ANTES DE REMOVER
    saveCurrentState();
    
    const productToRemove = favorites.find(item => item.id === productId);
    
    if (productToRemove) {
      // Remover o produto dos favoritos
      const newFavorites = favorites.filter(item => item.id !== productId);
      updateFavoritesAndStorage(newFavorites);
      
      // Mostrar a notificação específica com o nome do produto
      showUndoableToast(
        `ELIMINADO DOS FAVORITOS: ${productToRemove.name.toUpperCase()}`, 
        () => {
          // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR
          updateFavoritesAndStorage(previousStateRef.current);
        }
      );
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  const clearFavorites = useCallback(() => {
    // SALVAR ESTADO ANTES DE LIMPAR
    saveCurrentState();
    
    // Limpar todos os favoritos
    updateFavoritesAndStorage([]);
    
    // Mostrar notificação
    showUndoableToast("TODOS OS FAVORITOS FORAM ELIMINADOS", () => {
      // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR
      updateFavoritesAndStorage(previousStateRef.current);
    });
  }, [updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  const toggleFavorite = useCallback((product) => {
    if (favorites.some(item => item.id === product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  const isFavorite = useCallback((productId) => {
    return favorites.some(item => item.id === productId);
  }, [favorites]);

  // Mover produto para o carrinho e remover dos favoritos
  const moveToCart = useCallback((product, addToCart, removeAfterAdd = true) => {
    // Adicionar ao carrinho
    if (addToCart) {
      // SALVAR ESTADO ANTES DE MOVER
      saveCurrentState();
      
      const selectedSize = product.selectedSize || 'M';
      addToCart(product, 1, selectedSize);
      
      // Se necessário, remover dos favoritos após adicionar ao carrinho
      if (removeAfterAdd) {
        const newFavorites = favorites.filter(item => item.id !== product.id);
        updateFavoritesAndStorage(newFavorites);
        
        // Mostrar notificação para mover para carrinho
        const message = `MOVIDO PARA CARRINHO: ${product.name.toUpperCase()}`;
        showUndoableToast(message, () => {
          // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR DOS FAVORITOS
          updateFavoritesAndStorage(previousStateRef.current);
          
          // E REMOVER DO CARRINHO
          window.undoMoveToCart?.(product.id, selectedSize);
        });
      }
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  // Expor função para undo externos
  useEffect(() => {
    window.undoMoveToFavorites = (productId) => {
      // Esta função será chamada quando anular "mover para favoritos"
      removeFromFavorites(productId);
    };
    
    return () => {
      window.undoMoveToFavorites = null;
    };
  }, [removeFromFavorites]);

  const value = React.useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
    moveToCart
  }), [
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
    moveToCart
  ]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Para manter a compatibilidade, exportar FavoritesProvider
export { FavoritesProviderComponent as FavoritesProvider };