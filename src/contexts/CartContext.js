// src/contexts/CartContext.js
import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const CartContext = createContext();

const CartProviderComponent = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { showToast, showUndoableToast } = useNotification();
  const previousStateRef = useRef(null);
  
  // Carregar carrinho do localStorage quando o componente montar
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

  // Função para atualizar carrinho e localStorage
  const updateCartAndStorage = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, []);

  // Função para salvar estado antes de uma ação
  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...cart];
  }, [cart]);

  // Função para verificar se estamos na página do carrinho
  const isOnCartPage = () => {
    return window.location.pathname === '/cart';
  };

  const addToCart = useCallback((product, quantity = 1, selectedSize = null) => {
    // Verificar se o produto já está no carrinho com o mesmo tamanho
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );

    let newCart;
    if (existingItemIndex !== -1) {
      // Atualizar quantidade se o produto já estiver no carrinho
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      // Adicionar novo item ao carrinho
      newCart = [...cart, {
        ...product,
        quantity,
        selectedSize,
        addedAt: new Date().toISOString()
      }];
    }
    
    updateCartAndStorage(newCart);
    
    // Mostrar notificação baseada na página atual
    if (isOnCartPage()) {
      // Na página do carrinho: notificação SEM botão "VER CARRINHO"
      showToast("PRODUTO ADICIONADO AO CARRINHO", null, null);
    } else {
      // Outras páginas: notificação COM botão "VER CARRINHO"
      showToast("PRODUTO ADICIONADO AO CARRINHO", "VER CARRINHO", () => {
        window.location.href = '/cart';
      });
    }
    
    return true;
  }, [cart, updateCartAndStorage, showToast]);

  // Função para remover um produto do carrinho
  const removeFromCart = useCallback((productId, selectedSize = null) => {
    // SALVAR ESTADO ANTES DE REMOVER
    saveCurrentState();
    
    // Encontrar o produto a ser removido
    const productToRemoveIndex = cart.findIndex(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
    
    if (productToRemoveIndex !== -1) {
      const productToRemove = cart[productToRemoveIndex];
      
      // Remover o produto do carrinho
      const newCart = cart.filter((item, index) => index !== productToRemoveIndex);
      updateCartAndStorage(newCart);
      
      // Criar mensagem específica do produto
      let message = `REMOVIDO DO CARRINHO: ${productToRemove.name.toUpperCase()}`;
      if (productToRemove.selectedSize) {
        message += ` (${productToRemove.selectedSize})`;
      }
      
      // Mostrar a notificação com opção de anular
      showUndoableToast(message, () => {
        // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR
        updateCartAndStorage(previousStateRef.current);
      });
    }
  }, [cart, updateCartAndStorage, showUndoableToast, saveCurrentState]);

  // Função para atualizar a quantidade de um produto
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

  // Função para limpar o carrinho
  const clearCart = useCallback(() => {
    // SALVAR ESTADO ANTES DE LIMPAR
    saveCurrentState();
    
    // Limpar o carrinho
    updateCartAndStorage([]);
    
    // Mostrar notificação
    showUndoableToast("CARRINHO ESVAZIADO", () => {
      // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR
      updateCartAndStorage(previousStateRef.current);
    });
  }, [updateCartAndStorage, showUndoableToast, saveCurrentState]);

  // Função para calcular o total do carrinho
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [cart]);

  // Função para contar o número de itens no carrinho
  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cart]);

  // Função para verificar se um produto está no carrinho
  const isInCart = useCallback((productId, selectedSize = null) => {
    return cart.some(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
  }, [cart]);

  // Mover um produto para os favoritos e remover do carrinho
  const moveToFavorites = useCallback((product, addToFavorites) => {
    if (addToFavorites) {
      // SALVAR ESTADO ANTES DE MOVER
      saveCurrentState();
      
      // Remover propriedades específicas do carrinho
      const { quantity, addedAt, ...productWithoutCartDetails } = product;
      
      // Adicionar aos favoritos (função passada como parâmetro)
      addToFavorites(productWithoutCartDetails);
      
      // Remover do carrinho
      const newCart = cart.filter(item => 
        !(item.id === product.id && item.selectedSize === product.selectedSize)
      );
      updateCartAndStorage(newCart);
      
      // Mostrar notificação para mover para favoritos
      const message = `MOVIDO PARA FAVORITOS: ${product.name.toUpperCase()}${product.selectedSize ? ` (${product.selectedSize})` : ''}`;
      showUndoableToast(message, () => {
        // SIMPLESMENTE RESTAURAR O ESTADO ANTERIOR DO CARRINHO
        updateCartAndStorage(previousStateRef.current);
        
        // E REMOVER DOS FAVORITOS
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

// Para manter a compatibilidade, exportar CartProvider
export { CartProviderComponent as CartProvider };