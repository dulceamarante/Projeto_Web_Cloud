import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Adiciona produto ao carrinho
  const addToCart = (product) => {
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove produto do carrinho
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Adiciona produto aos favoritos
  const addToFavorites = (product) => {
    setFavorites(prevFavs =>
      prevFavs.find(item => item.id === product.id)
        ? prevFavs
        : [...prevFavs, product]
    );
  };

  // Remove produto dos favoritos
  const removeFromFavorites = (productId) => {
    setFavorites(prevFavs => prevFavs.filter(item => item.id !== productId));
  };

  return (
    <GlobalContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        addToFavorites,
        removeFromFavorites
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
