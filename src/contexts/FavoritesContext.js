
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const FavoritesContext = createContext();

const FavoritesProviderComponent = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showToast, showUndoableToast } = useNotification();
  const previousStateRef = useRef(null);
  

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


  const updateFavoritesAndStorage = useCallback((newFavorites) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);


  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...favorites];
  }, [favorites]);

  const addToFavorites = useCallback((product) => {
    if (!favorites.some(item => item.id === product.id)) {
      const newFavorites = [...favorites, product];
      updateFavoritesAndStorage(newFavorites);
      
  
      showToast("ADICIONADO AOS SEUS ARTIGOS PREFERIDOS", null, null, 3000);
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showToast]);

  const removeFromFavorites = useCallback((productId) => {

    saveCurrentState();
    
    const productToRemove = favorites.find(item => item.id === productId);
    
    if (productToRemove) {

      const newFavorites = favorites.filter(item => item.id !== productId);
      updateFavoritesAndStorage(newFavorites);
      

      showUndoableToast(
        `ELIMINADO DOS FAVORITOS: ${productToRemove.name.toUpperCase()}`, 
        () => {

          updateFavoritesAndStorage(previousStateRef.current);
        }
      );
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  const clearFavorites = useCallback(() => {

    saveCurrentState();
    

    updateFavoritesAndStorage([]);
    

    showUndoableToast("TODOS OS FAVORITOS FORAM ELIMINADOS", () => {
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


  const moveToCart = useCallback((product, addToCart, removeAfterAdd = true) => {

    if (addToCart) {

      saveCurrentState();
      
      const selectedSize = product.selectedSize || 'M';
      addToCart(product, 1, selectedSize);
      

      if (removeAfterAdd) {
        const newFavorites = favorites.filter(item => item.id !== product.id);
        updateFavoritesAndStorage(newFavorites);
        

        const message = `MOVIDO PARA CARRINHO: ${product.name.toUpperCase()}`;
        showUndoableToast(message, () => {

          updateFavoritesAndStorage(previousStateRef.current);
          

          window.undoMoveToCart?.(product.id, selectedSize);
        });
      }
      
      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);


  useEffect(() => {
    window.undoMoveToFavorites = (productId) => {

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


export { FavoritesProviderComponent as FavoritesProvider };