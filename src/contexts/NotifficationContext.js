// src/contexts/NotificationContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import NotificationSystem, { NOTIFICATION_TYPES } from '../components/notifications/NotificationSystem';

// Criar o contexto
export const NotificationContext = createContext();

// Provedor do contexto
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Adicionar uma nova notificação
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-remover após a duração especificada
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => removeNotification(id), duration);
    }
    
    return id;
  }, []);
  
  // Remover uma notificação específica
  const removeNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(note => 
        note.id === id ? { ...note, closing: true } : note
      )
    );
    
    // Dar tempo para a animação de saída
    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 300);
  }, []);
  
  // Limpar todas as notificações
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  // API de contexto para uso em toda a aplicação
  const notificationAPI = {
    // Mostrar uma notificação de tipo toast
    showToast: (message, actionText, onAction, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        message,
        actionText,
        onAction,
        duration
      });
    },
    
    // Mostrar uma notificação de produto adicionado
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

// Hook personalizado para usar notificações
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  
  return context;
};