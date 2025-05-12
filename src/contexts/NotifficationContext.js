
import React, { createContext, useState, useContext, useCallback } from 'react';
import NotificationSystem, { NOTIFICATION_TYPES } from '../components/notifications/NotificationSystem';


export const NotificationContext = createContext();


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);

    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => removeNotification(id), duration);
    }
    
    return id;
  }, []);
  

  const removeNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(note => 
        note.id === id ? { ...note, closing: true } : note
      )
    );
    

    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 300);
  }, []);
  

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  

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
    

    showProductAdded: (product, selectedSize, onViewCart, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.PRODUCT_ADDED,
        product,
        selectedSize,
        onViewCart,
        duration
      });
    },
    

    showError: (message, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message,
        duration
      });
    },
    

    showSuccess: (message, duration = 5000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message,
        duration
      });
    },
    

    closeNotification: removeNotification,
    

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
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
  }
  
  return context;
};