import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useNotification } from '../components/ui/NotificationSystem';

export const FavoritesContext = createContext();

const FavoritesProviderComponent = ({ children }) => {
  const [favorites, setFavorites] = useState([]); // Estado para armazenar os itens favoritos
  const { showToast, showUndoableToast } = useNotification(); // Sistema de notificações para interações do utilizador
  const previousStateRef = useRef(null); // Referência para armazenar o estado anterior dos favoritos

  // Carregar os favoritos do localStorage quando o componente é montado
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites)); // Inicializar os favoritos com os dados armazenados
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error); // Log de erro para debugging
    }
  }, []);

  // Atualizar os favoritos e sincronizar com o localStorage
  const updateFavoritesAndStorage = useCallback((newFavorites) => {
    setFavorites(newFavorites); // Atualizar o estado local
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites)); // Atualizar o armazenamento local
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);

  // Guardar o estado atual dos favoritos para possíveis ações de "desfazer"
  const saveCurrentState = useCallback(() => {
    previousStateRef.current = [...favorites];
  }, [favorites]);

  // Adicionar um produto aos favoritos
  const addToFavorites = useCallback((product) => {
    if (!favorites.some(item => item.id === product.id)) { // Verificar se o produto já não está nos favoritos
      const newFavorites = [...favorites, product]; // Adicionar o produto ao array de favoritos
      updateFavoritesAndStorage(newFavorites);

      showToast("ADICIONADO AOS SEUS ARTIGOS PREFERIDOS", null, null, 3000); // Notificação de sucesso

      return true;
    }
    return false; // Retornar falso se o produto já estiver nos favoritos
  }, [favorites, updateFavoritesAndStorage, showToast]);

  // Remover um produto dos favoritos
  const removeFromFavorites = useCallback((productId) => {
    saveCurrentState(); // Guardar o estado antes de remover

    const productToRemove = favorites.find(item => item.id === productId); // Encontrar o produto a remover

    if (productToRemove) {
      const newFavorites = favorites.filter(item => item.id !== productId); // Remover o produto do array
      updateFavoritesAndStorage(newFavorites);

      showUndoableToast(
        `ELIMINADO DOS FAVORITOS: ${productToRemove.name.toUpperCase()}`, // Mensagem para "desfazer"
        () => {
          updateFavoritesAndStorage(previousStateRef.current); // Reverter a remoção se necessário
        }
      );

      return true;
    }
    return false; // Retornar falso se o produto não for encontrado
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  // Limpar todos os favoritos
  const clearFavorites = useCallback(() => {
    saveCurrentState(); // Guardar o estado atual

    updateFavoritesAndStorage([]); // Esvaziar os favoritos

    showUndoableToast("TODOS OS FAVORITOS FORAM ELIMINADOS", () => {
      updateFavoritesAndStorage(previousStateRef.current); // Reverter a ação, se necessário
    });
  }, [updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  // Alternar o estado de um produto nos favoritos (adicionar ou remover)
  const toggleFavorite = useCallback((product) => {
    if (favorites.some(item => item.id === product.id)) {
      removeFromFavorites(product.id); // Remover se já estiver nos favoritos
    } else {
      addToFavorites(product); // Adicionar se não estiver
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Verificar se um produto está nos favoritos
  const isFavorite = useCallback((productId) => {
    return favorites.some(item => item.id === productId); // Retorna true se o produto estiver nos favoritos
  }, [favorites]);

  // Mover um produto dos favoritos para o carrinho
  const moveToCart = useCallback((product, addToCart, removeAfterAdd = true) => {
    if (addToCart) {
      saveCurrentState(); // Guardar o estado antes de mover

      const selectedSize = product.selectedSize || 'M'; // Garantir que o tamanho selecionado é válido
      addToCart(product, 1, selectedSize); // Adicionar ao carrinho

      if (removeAfterAdd) { // Remover dos favoritos após adicionar ao carrinho, se necessário
        const newFavorites = favorites.filter(item => item.id !== product.id);
        updateFavoritesAndStorage(newFavorites);

        const message = `MOVIDO PARA CARRINHO: ${product.name.toUpperCase()}`;
        showUndoableToast(message, () => {
          updateFavoritesAndStorage(previousStateRef.current); // Reverter se necessário

          window.undoMoveToCart?.(product.id, selectedSize); // Chamar callback global para desfazer
        });
      }

      return true;
    }
    return false;
  }, [favorites, updateFavoritesAndStorage, showUndoableToast, saveCurrentState]);

  // Registar a função global para desfazer uma remoção dos favoritos
  useEffect(() => {
    window.undoMoveToFavorites = (productId) => {
      removeFromFavorites(productId); // Remover produto dos favoritos
    };

    return () => {
      window.undoMoveToFavorites = null; // Limpar callback ao desmontar
    };
  }, [removeFromFavorites]);

  // Memorizar o contexto para evitar renders desnecessários
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
