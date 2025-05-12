// src/contexts/FavoritesContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const FavoritesContext = createContext();

const FavoritesProviderComponent = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showToast, showUndoableToast } = useNotification();
  
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

  const addToFavorites = useCallback((product) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.some(item => item.id === product.id)) {
        const newFavorites = [...prevFavorites, product];
        updateFavoritesAndStorage(newFavorites);
        
        // Mostrar notificação quando produto é adicionado
        showToast("ADICIONADO AOS SEUS ARTIGOS PREFERIDOS", null, null, 3000);
        
        return newFavorites;
      }
      return prevFavorites;
    });
  }, [updateFavoritesAndStorage, showToast]);

  const removeFromFavorites = useCallback((productId) => {
    setFavorites(prevFavorites => {
      const productToRemove = prevFavorites.find(item => item.id === productId);
      
      if (productToRemove) {
        // Remover o produto dos favoritos
        const newFavorites = prevFavorites.filter(item => item.id !== productId);
        updateFavoritesAndStorage(newFavorites);
        
        // Criar uma cópia do produto para a função de undo
        const productCopy = { ...productToRemove };
        
        // Mostrar a notificação específica com o nome do produto
        showUndoableToast(
          `ELIMINADO DOS FAVORITOS: ${productToRemove.name.toUpperCase()}`, 
          () => handleUndo(productCopy)
        );
        
        return newFavorites;
      }
      return prevFavorites;
    });
  }, [updateFavoritesAndStorage, showUndoableToast]);

  const clearFavorites = useCallback(() => {
    // Criar uma cópia dos favoritos antes de limpar
    const previousFavorites = [...favorites];
    
    // Limpar todos os favoritos
    updateFavoritesAndStorage([]);
    
    // Mostrar notificação
    showUndoableToast("TODOS OS FAVORITOS FORAM ELIMINADOS", () => {
      // Restaurar favoritos anteriores
      updateFavoritesAndStorage(previousFavorites);
    });
  }, [favorites, updateFavoritesAndStorage, showUndoableToast]);

  const handleUndo = useCallback((productToRestore) => {
    console.log("Restoring specific product:", productToRestore);
    
    if (productToRestore) {
      // Adicionar APENAS o produto específico de volta aos favoritos
      setFavorites(prevFavorites => {
        // Verificar se o produto já existe nos favoritos
        if (!prevFavorites.some(item => item.id === productToRestore.id)) {
          const newFavorites = [...prevFavorites, productToRestore];
          updateFavoritesAndStorage(newFavorites);
          return newFavorites;
        }
        return prevFavorites;
      });
    }
  }, [updateFavoritesAndStorage]);

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
      // Criar uma snapshot dos favoritos antes da remoção
      const currentFavorites = [...favorites];
      
      const selectedSize = product.selectedSize || 'M';
      addToCart(product, 1, selectedSize);
      
      // Se necessário, remover dos favoritos após adicionar ao carrinho
      if (removeAfterAdd) {
        const newFavorites = currentFavorites.filter(item => item.id !== product.id);
        updateFavoritesAndStorage(newFavorites);
        
        // Mostrar notificação para mover para carrinho
        const message = `MOVIDO PARA CARRINHO: ${product.name.toUpperCase()}`;
        showUndoableToast(message, () => {
          // Reverter: remover do carrinho e adicionar de volta aos favoritos
          // Primeiro, remover do carrinho
          const removeFromCart = window._cartProvider?.removeFromCart;
          if (removeFromCart) {
            removeFromCart(product.id, selectedSize);
          }
          
          // Depois, adicionar de volta aos favoritos
          setFavorites(prevFavorites => {
            const updatedFavorites = [...prevFavorites, product];
            updateFavoritesAndStorage(updatedFavorites);
            return updatedFavorites;
          });
        });
      }
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast]);

  // Expor funções para uso externo
  useEffect(() => {
    window._favoritesProvider = {
      removeFavorite: removeFromFavorites
    };
    
    return () => {
      window._favoritesProvider = null;
    };
  }, [removeFromFavorites]);

  const value = React.useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
    moveToCart,
    handleUndo
  }), [
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
    moveToCart,
    handleUndo
  ]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Para manter a compatibilidade, exportar FavoritesProvider
export { FavoritesProviderComponent as FavoritesProvider };