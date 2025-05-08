import React, { createContext, useState, useEffect } from 'react';

// Criando o contexto
export const FavoritesContext = createContext();

// Criando o provider
export const FavoritesProvider = ({ children }) => {
  // Estado para armazenar os favoritos
  const [favorites, setFavorites] = useState(() => {
    // Tenta recuperar os favoritos do localStorage
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Salva os favoritos no localStorage sempre que há uma alteração
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Função para adicionar um item aos favoritos
  const addFavorite = (product) => {
    setFavorites((prevFavorites) => {
      // Verifica se o produto já existe nos favoritos
      if (prevFavorites.some(item => item.id === product.id)) {
        return prevFavorites;
      }
      // Adiciona o produto aos favoritos
      return [...prevFavorites, product];
    });
  };

  // Função para remover um item dos favoritos
  const removeFavorite = (productId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  // Função para verificar se um item está nos favoritos
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // Função para limpar todos os favoritos
  const clearFavorites = () => {
    setFavorites([]);
  };

  // Valores e funções que serão disponibilizados pelo contexto
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;