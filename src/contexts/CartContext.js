import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const CartContext = createContext();

const CartProviderComponent = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, showUndoableToast } = useNotification();
  const previousStateRef = useRef(null);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.warn("Token não encontrado.");
        // Tenta carregar do localStorage como fallback
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart);
            setCart(parsedCart);
          } catch (error) {
            console.error("Erro ao parsear carrinho local:", error);
            setCart([]);
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/products/cart?token=${token}`);
        const data = await res.json();

        if (res.ok && data.products) {
          setCart(data.products);
          // Sincroniza com localStorage
          localStorage.setItem('cart', JSON.stringify(data.products));
        } else {
          console.warn("Falha ao carregar carrinho:", data.message);
          // Fallback para localStorage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            try {
              const parsedCart = JSON.parse(localCart);
              setCart(parsedCart);
            } catch (error) {
              console.error("Erro ao parsear carrinho local:", error);
              setCart([]);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar carrinho do servidor:", err);
        // Fallback para localStorage
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart);
            setCart(parsedCart);
          } catch (error) {
            console.error("Erro ao parsear carrinho local:", error);
            setCart([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateCartAndStorage = useCallback(async (newCart) => {
    // Atualiza o estado primeiro
    setCart(newCart);

    try {
      // Sempre salva no localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('Token JWT não encontrado. Carrinho salvo apenas localmente.');
        return;
      }

      // Tenta sincronizar com o backend
      const response = await fetch(`http://localhost:5000/products/cart?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: newCart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize // Se relevante para o backend
          }))
        })
      });

      if (!response.ok) {
        console.error('Erro ao sincronizar com backend:', response.status);
        const errorData = await response.json();
        console.error('Detalhes do erro:', errorData);
      }
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      // O carrinho fica salvo no localStorage mesmo se o backend falhar
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
      newCart = [
        ...cart,
        {
          ...product,
          quantity,
          selectedSize,
          addedAt: new Date().toISOString()
        }
      ];
    }

    updateCartAndStorage(newCart);
    showToast('ADICIONADO AO CARRINHO');
  }, [cart, updateCartAndStorage, showToast]);

  const removeFromCart = useCallback((productId, selectedSize = null) => {
    saveCurrentState();

    const productToRemoveIndex = cart.findIndex(
      item =>
        item.id === productId &&
        (selectedSize === null || item.selectedSize === selectedSize)
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
    showUndoableToast('CARRINHO ESVAZIADO', () => {
      updateCartAndStorage(previousStateRef.current);
    });
  }, [updateCartAndStorage, showUndoableToast, saveCurrentState]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
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

      const newCart = cart.filter(
        item => !(item.id === product.id && item.selectedSize === product.selectedSize)
      );

      updateCartAndStorage(newCart);

      const message = `MOVIDO PARA FAVORITOS: ${product.name.toUpperCase()}${
        product.selectedSize ? ` (${product.selectedSize})` : ''
      }`;

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
    isLoading,
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
    isLoading,
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