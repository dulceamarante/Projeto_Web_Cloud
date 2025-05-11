// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import NotificationSystem from '../components/ui/NotificationSystem';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [removedProduct, setRemovedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  
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
  const updateCartAndStorage = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  const addToCart = (product, quantity = 1, selectedSize = null) => {
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
    
    // Mostrar notificação
    setNotification({
      message: "PRODUTO ADICIONADO AO CARRINHO",
      actionText: "VER CARRINHO",
      onAction: () => {
        window.location.href = '/cart';
        setNotification(null);
      }
    });
    
    return true; // Retornar true para indicar sucesso
  };

  // Função para remover um produto do carrinho
  const removeFromCart = (productId, selectedSize = null) => {
    // Encontrar o produto a ser removido
    const productToRemoveIndex = cart.findIndex(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
    
    if (productToRemoveIndex !== -1) {
      const productToRemove = cart[productToRemoveIndex];
      
      // Remover o produto do carrinho
      const newCart = cart.filter((item, index) => index !== productToRemoveIndex);
      updateCartAndStorage(newCart);
      
      // Guardar o produto removido para caso de desfazer
      setRemovedProduct(productToRemove);
      
      // Mostrar a notificação
      setNotification({
        message: "PRODUTO REMOVIDO DO CARRINHO",
        actionText: "DESFAZER",
        onAction: () => handleUndo() // Usar uma arrow function como no FavoritesContext
      });
    }
  };

  // Função para atualizar a quantidade de um produto
  const updateQuantity = (productId, quantity, selectedSize = null) => {
    const newCart = cart.map(item => {
      if (item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)) {
        return { ...item, quantity };
      }
      return item;
    });
    updateCartAndStorage(newCart);
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    // Criar uma cópia do carrinho antes de limpar
    const previousCart = [...cart];
    
    // Limpar o carrinho
    updateCartAndStorage([]);
    
    // Mostrar notificação
    setNotification({
      message: "CARRINHO ESVAZIADO",
      actionText: "DESFAZER",
      onAction: () => {
        // Restaurar carrinho anterior
        updateCartAndStorage(previousCart);
        setNotification(null);
      }
    });
  };

  // Função para desfazer a remoção de um produto
  const handleUndo = () => {
    console.log("Executing handleUndo in CartContext", removedProduct); // Debug log
    
    if (removedProduct) {
      // Adicionar o produto de volta ao carrinho
      const newCart = [...cart, removedProduct];
      updateCartAndStorage(newCart);
      
      // Limpar o produto removido
      setRemovedProduct(null);
      
      // Esconder a notificação
      setNotification(null);
    } else {
      console.log("No removed product to restore"); // Debug log
    }
  };

  // Função para fechar notificações
  const closeNotification = () => {
    setNotification(null);
    setRemovedProduct(null);
  };

  // Função para calcular o total do carrinho
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Função para contar o número de itens no carrinho
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Função para verificar se um produto está no carrinho
  const isInCart = (productId, selectedSize = null) => {
    return cart.some(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
  };

  // Mover um produto para os favoritos e remover do carrinho
  const moveToFavorites = (product, addToFavorites) => {
    if (addToFavorites) {
      // Remover propriedades específicas do carrinho
      const { quantity, addedAt, ...productWithoutCartDetails } = product;
      
      // Adicionar aos favoritos (função passada como parâmetro)
      addToFavorites(productWithoutCartDetails);
      
      // Remover do carrinho
      removeFromCart(product.id, product.selectedSize);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isInCart,
        moveToFavorites,
        handleUndo // Expor handleUndo para uso direto se necessário, como no FavoritesContext
      }}
    >
      {children}
      
      {notification && (
        <NotificationSystem 
          message={notification.message}
          actionText={notification.actionText}
          onAction={notification.onAction || handleUndo}
          onClose={closeNotification}
        />
      )}
    </CartContext.Provider>
  );
};