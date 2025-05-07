import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = product => {
    setFavorites(favs => [...favs, product]);
  };

  const removeFromFavorites = productId => {
    setFavorites(favs => favs.filter(p => p.id !== productId));
  };

  const toggleFavorite = product => {
    setFavorites(favs =>
      favs.some(p => p.id === product.id)
        ? favs.filter(p => p.id !== product.id)
        : [...favs, product]
    );
  };

  const isFavorite = productId => {
    return favorites.some(p => p.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
