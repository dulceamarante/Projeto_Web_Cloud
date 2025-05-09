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

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    // Verificar se o produto já está no carrinho com o mesmo tamanho
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItemIndex !== -1) {
      // Atualizar quantidade se o produto já estiver no carrinho
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Adicionar novo item ao carrinho
      setCart(prev => [...prev, {
        ...product,
        quantity,
        selectedSize,
        addedAt: new Date().toISOString()
      }]);
    }
    
    // Mostrar notificação
    setNotification({
      message: "PRODUTO ADICIONADO AO CARRINHO",
      actionText: "VER CESTA",
      onAction: () => {
        // Ao clicar no botão de ação, redireciona para a página do carrinho
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
      const newCart = [...cart];
      newCart.splice(productToRemoveIndex, 1);
      setCart(newCart);
      
      // Guardar o produto removido para caso de desfazer
      setRemovedProduct(productToRemove);
      
      // Mostrar a notificação
      setNotification({
        message: "PRODUTO REMOVIDO DO CARRINHO",
        actionText: "DESFAZER",
        onAction: handleUndo
      });
    }
  };

  // Função para atualizar a quantidade de um produto
  const updateQuantity = (productId, quantity, selectedSize = null) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    // Criar uma cópia do carrinho antes de limpar
    const previousCart = [...cart];
    
    // Limpar o carrinho
    setCart([]);
    
    // Mostrar notificação
    setNotification({
      message: "CARRINHO ESVAZIADO",
      actionText: "DESFAZER",
      onAction: () => {
        // Restaurar carrinho anterior
        setCart(previousCart);
        setNotification(null);
      }
    });
  };

  // Função para desfazer a remoção de um produto
  const handleUndo = () => {
    if (removedProduct) {
      // Adicionar o produto de volta ao carrinho
      setCart(prev => [...prev, removedProduct]);
      
      // Limpar o produto removido
      setRemovedProduct(null);
      
      // Esconder a notificação
      setNotification(null);
    }
  };

  // Função para fechar notificações
  const closeNotification = () => {
    setNotification(null);
    setRemovedProduct(null);
  };

  // Função para calcular o total do carrinho
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Função para contar o número de itens no carrinho
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Função para verificar se um produto está no carrinho
  const isInCart = (productId, selectedSize = null) => {
    return cart.some(
      item => item.id === productId && (selectedSize === null || item.selectedSize === selectedSize)
    );
  };

  // Mover um produto dos favoritos para o carrinho
  const moveFromFavoritesToCart = (product, quantity = 1, selectedSize = null) => {
    // Adicionar ao carrinho
    addToCart(product, quantity, selectedSize);
    
    // A remoção dos favoritos deve ser feita no componente usando o FavoritesContext
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
        moveFromFavoritesToCart
      }}
    >
      {children}
      
      {notification && (
        <NotificationSystem 
          message={notification.message}
          actionText={notification.actionText}
          onAction={notification.onAction}
          onClose={closeNotification}
        />
      )}
    </CartContext.Provider>
  );
};