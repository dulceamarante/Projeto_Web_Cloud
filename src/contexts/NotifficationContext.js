import React, { createContext, useState, useContext, useCallback } from 'react';
import NotificationSystem, { NOTIFICATION_TYPES } from '../components/notifications/NotificationSystem';

// Criação de um contexto para fornecer e consumir notificações
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // Estado para armazenar as notificações ativas

  // Adicionar uma nova notificação
  const addNotification = useCallback((notification) => {
    const id = Date.now(); 
    setNotifications(prev => [...prev, { ...notification, id }]); 

    // Configurar a duração da notificação, caso não seja permanente
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000; 
      setTimeout(() => removeNotification(id), duration); 
    }

    return id; // Retornar o ID da notificação
  }, []);

  // Remover uma notificação específica
  const removeNotification = useCallback((id) => {
    
    setNotifications(prev => 
      prev.map(note => 
        note.id === id ? { ...note, closing: true } : note
      )
    );

    // Remover a notificação definitivamente após 300ms (tempo da animação)
    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 300);
  }, []);

  // Remover todas as notificações ativas
  const clearNotifications = useCallback(() => {
    setNotifications([]); // Limpar o array de notificações
  }, []);

  // API de notificações exposta para uso no contexto
  const notificationAPI = {
  
    showToast: (message, actionText, onAction, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        message,
        actionText,
        onAction,
        duration
      });
    },

    // Mostrar notificação para produto adicionado ao carrinho
    showProductAdded: (product, selectedSize, onViewCart, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.PRODUCT_ADDED,
        product,
        selectedSize,
        onViewCart,
        duration
      });
    },

    // Mostrar uma notificação de erro
    showError: (message, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message,
        duration
      });
    },

    // Mostrar uma notificação de sucesso
    showSuccess: (message, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message,
        duration
      });
    },

    // Fechar uma notificação específica
    closeNotification: removeNotification,

    // Limpar todas as notificações
    clearAll: clearNotifications
  };

  return (
    <NotificationContext.Provider value={notificationAPI}>
      {children}
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext); // Obter o contexto atual
  
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  
  return context; 
};
