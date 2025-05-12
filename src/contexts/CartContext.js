import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const CartContext = createContext();

const CartProviderComponent = ({ children }) => {
  const [cart, setCart] = useState([]); // Estado para armazenar os itens no carrinho
  const { showToast, showUndoableToast } = useNotification(); // Notificações para interações do utilizador
  const previousStateRef = useRef(null); // Referência para armazenar o estado anterior do carrinho

  // Carregar o carrinho do localStorage ao iniciar
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

  // Atualizar o estado do carrinho e sincronizar com o localStorage
  const updateCartAndStorage = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, []);

  // Guardar o estado atual do carrinho para futuras ações de "desfazer"
  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...cart];
  }, [cart]);

  // Verificar se o utilizador está na página do carrinho
  const isOnCartPage = () => {
    return window.location.pathname === '/cart';
  };

  // Adicionar um produto ao carrinho
  const addToCart = useCallback((product, quantity = 1, selectedSize = null) => {
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );

    let newCart;
    if (existingItemIndex !== -1) {
      // Atualizar a quantidade se o produto já existir no carrinho
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      // Adicionar um novo produto ao carrinho
      newCart = [...cart, {
        ...product,
        quantity,
        selectedSize,
        addedAt: new Date().toISOString()
      }];
    }
    
    updateCartAndStorage(newCart);
    
    // Mostrar notificação com base na página atual
    if (isOnCartPage()) {
      showToast("PRODUTO ADICIONADO AO CARRINHO", null, null);
    } else {
      showToast("PRODUTO ADICIONADO AO CARRINHO", "VER CARRINHO", () => {
        window.location.href = '/cart'; // Redirecionar para a página do carrinho
      });
    }
    
    return true;
  }, [cart, updateCartAndStorage, showToast]);

  // Remover um produto do carrinho
  const removeFromCart = useCallback((productId, selectedSize = null) => {
    saveCurrentState(); // Guardar o estado atual antes de modificar

    const productToRemoveIndex = cart.findIndex(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
    
    if (productToRemoveIndex !== -1) {
      const productToRemove = cart[productToRemoveIndex];

      const newCart = cart.filter((item, index) => index !== productToRemoveIndex);
      updateCartAndStorage(newCart);
      
      // Construir mensagem de remoção e oferecer opção de desfazer
      let message = `REMOVIDO DO CARRINHO: ${productToRemove.name.toUpperCase()}`;
      if (productToRemove.selectedSize) {
        message += ` (${productToRemove.selectedSize})`;
      }
      
      showUndoableToast(message, () => {
        updateCartAndStorage(previousStateRef.current); // Reverter alterações
      });
    }
  }, [cart, updateCartAndStorage, showUndoableToast, saveCurrentState]);

  // Atualizar a quantidade de um produto no carrinho
  const updateQuantity = useCallback((productId, quantity, selectedSize = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize); // Remover o produto se a quantidade for zero
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

  // Esvaziar todo o carrinho
  const clearCart = useCallback(() => {
    saveCurrentState();
    updateCartAndStorage([]);
    showUndoableToast("CARRINHO ESVAZIADO", () => {
      updateCartAndStorage(previousStateRef.current); // Reverter esvaziamento se necessário
    });
  }, [updateCartAndStorage, showUndoableToast, saveCurrentState]);

  // Calcular o total do carrinho
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [cart]);

  // Contar o número de itens no carrinho
  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cart]);

  // Verificar se um produto está no carrinho
  const isInCart = useCallback((productId, selectedSize = null) => {
    return cart.some(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
  }, [cart]);

  // Mover um produto do carrinho para favoritos
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

  // Memorizar o contexto do carrinho para evitar renders desnecessários
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
