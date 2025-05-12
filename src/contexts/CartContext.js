
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const CartContext = createContext();

const CartProviderComponent = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { showToast, showUndoableToast } = useNotification();
  const previousStateRef = useRef(null);
  

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }, []);

  const updateCartAndStorage = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, []);

  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...cart];
  }, [cart]);


  const isOnCartPage = () => {
    return window.location.pathname === '/cart';
  };

  const addToCart = useCallback((product, quantity = 1, selectedSize = null) => {

    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );

    let newCart;
    if (existingItemIndex !== -1) {

      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {

      newCart = [...cart, {
        ...product,
        quantity,
        selectedSize,
        addedAt: new Date().toISOString()
      }];
    }
    
    updateCartAndStorage(newCart);
    

    if (isOnCartPage()) {

      showToast("PRODUTO ADICIONADO AO CARRINHO", null, null);
    } else {

      showToast("PRODUTO ADICIONADO AO CARRINHO", "VER CARRINHO", () => {
        window.location.href = '/cart';
      });
    }
    
    return true;
  }, [cart, updateCartAndStorage, showToast]);


  const removeFromCart = useCallback((productId, selectedSize = null) => {

    saveCurrentState();
    

    const productToRemoveIndex = cart.findIndex(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
    
    if (productToRemoveIndex !== -1) {
      const productToRemove = cart[productToRemoveIndex];
      

      const newCart = cart.filter((item, index) => index !== productToRemoveIndex);
      updateCartAndStorage(newCart);
      

      let message = `REMOVIDO DO CARRINHO: ${productToRemove.name.toUpperCase()}`;
      if (productToRemove.selectedSize) {
        message += ` (${productToRemove.selectedSize})`;
      }
      

      showUndoableToast(message, () => {

        updateCartAndStorage(previousStateRef.current);
      });
    }
  }, [cart, updateCartAndStorage, showUndoableToast, saveCurrentState]);


  const updateQuantity = useCallback((productId, quantity, selectedSize = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    const newCart = cart.map(item => {
      if (item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)) {
        return { ...item, quantity };
      }
      return item;
    });
    updateCartAndStorage(newCart);
  }, [cart, updateCartAndStorage, removeFromCart]);


  const clearCart = useCallback(() => {

    saveCurrentState();
    

    updateCartAndStorage([]);
    

    showUndoableToast("CARRINHO ESVAZIADO", () => {

      updateCartAndStorage(previousStateRef.current);
    });
  }, [updateCartAndStorage, showUndoableToast, saveCurrentState]);


  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [cart]);


  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cart]);


  const isInCart = useCallback((productId, selectedSize = null) => {
    return cart.some(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
  }, [cart]);


  const moveToFavorites = useCallback((product, addToFavorites) => {
    if (addToFavorites) {

      saveCurrentState();
      

      const { quantity, addedAt, ...productWithoutCartDetails } = product;
      

      addToFavorites(productWithoutCartDetails);
      

      const newCart = cart.filter(item => 
        !(item.id === product.id && item.selectedSize === product.selectedSize)
      );
      updateCartAndStorage(newCart);
      

      const message = `MOVIDO PARA FAVORITOS: ${product.name.toUpperCase()}${product.selectedSize ? ` (${product.selectedSize})` : ''}`;
      showUndoableToast(message, () => {

        updateCartAndStorage(previousStateRef.current);
        

        window.undoMoveToFavorites?.(product.id);
      });
      
      return true;
    }
    return false;
  }, [cart, updateCartAndStorage, showUndoableToast, saveCurrentState]);

  const value = React.useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    moveToFavorites
  }), [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    moveToFavorites
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


export { CartProviderComponent as CartProvider };