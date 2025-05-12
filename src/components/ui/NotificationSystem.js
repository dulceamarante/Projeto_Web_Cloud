
import React, { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import './NotificationSystem.css';

const NotificationContext = createContext();


export const NOTIFICATION_TYPES = {
  TOAST: 'toast',
  PRODUCT_ADDED: 'product-added',
  ERROR: 'error',
  SUCCESS: 'success'
};


export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (notification) => {
    const id = Date.now() + Math.random(); 
    setNotifications(prev => [...prev, { ...notification, id }]);
    

    if (notification.duration !== 0) {
      const duration = notification.duration || 3000;
      setTimeout(() => removeNotification(id), duration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.map(note => 
        note.id === id ? { ...note, closing: true } : note
      )
    );
    

    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 300);
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const notificationAPI = React.useMemo(() => ({
    showToast: (message, actionText, onAction, duration = 3000) => {

      let finalAction = onAction;
      if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
        finalAction = () => {

          window.location.href = '/cart';
        };
      }
      
      return addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        message,
        actionText,
        onAction: finalAction,
        duration
      });
    },
    
    showProductAdded: (product, selectedSize, onViewCart, duration = 3000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.PRODUCT_ADDED,
        product,
        selectedSize,
        onViewCart: () => {
          window.location.href = '/cart';
        },
        duration
      });
    },
    
    showError: (message, duration = 3000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message,
        duration
      });
    },
    
    showSuccess: (message, duration = 3000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message,
        duration
      });
    },
    

    showUndoableToast: (message, onUndo, duration = 3000) => {
      return addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        message,
        actionText: "ANULAR",
        onAction: onUndo,
        duration
      });
    },
    
    closeNotification: removeNotification,
    clearAll: clearNotifications
  }), [addNotification, removeNotification, clearNotifications]);
  

  useEffect(() => {
    window._notificationSystem = notificationAPI;
    
    return () => {
      window._notificationSystem = null;
    };
  }, [notificationAPI]);
  
  return (
    <NotificationContext.Provider value={notificationAPI}>
      {children}
      

      {createPortal(
        <div className="notifications-container">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};


export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    console.warn('useNotification deve ser usado dentro de um NotificationProvider');
    

    return {
      showToast: (message) => console.log('Toast:', message),
      showError: (message) => console.log('Error:', message),
      showSuccess: (message) => console.log('Success:', message),
      showProductAdded: () => console.log('Product added notification'),
      showUndoableToast: (message, onUndo) => console.log('Undoable toast:', message),
      closeNotification: () => {},
      clearAll: () => {}
    };
  }
  
  return context;
};


const NotificationItem = ({ notification, onClose, closing }) => {
  const { type, closing: notificationClosing } = notification;
  const isClosing = closing || notificationClosing;
  
  switch (type) {
    case NOTIFICATION_TYPES.TOAST:
      return (
        <ToastNotification 
          notification={notification} 
          onClose={onClose} 
          closing={isClosing}
        />
      );
      
    case NOTIFICATION_TYPES.PRODUCT_ADDED:
      return (
        <ProductAddedNotification 
          notification={notification} 
          onClose={onClose}
          closing={isClosing}
        />
      );
      
    case NOTIFICATION_TYPES.ERROR:
    case NOTIFICATION_TYPES.SUCCESS:
      return (
        <StatusNotification 
          notification={notification} 
          onClose={onClose}
          closing={isClosing}
        />
      );
      
    default:
      return null;
  }
};


const ToastNotification = ({ notification, onClose, closing }) => {
  const { message, actionText, onAction } = notification;
  
  const handleAction = () => {
    if (onAction) {
      try {
        onAction();
      } catch (error) {
        console.error("Error in toast notification action:", error);

        if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
          window.location.href = '/cart';
        }
      }
    } else if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
      window.location.href = '/cart';
    }
    onClose();
  };
  
  return (
    <div className={`notification-toast ${closing ? 'hide' : ''}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        {actionText && (
          <button 
            className="notification-action" 
            onClick={handleAction}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

const StatusNotification = ({ notification, onClose, closing }) => {
  const { type, message } = notification;
  const isError = type === NOTIFICATION_TYPES.ERROR;
  
  return (
    <div className={`status-notification ${isError ? 'error' : 'success'} ${closing ? 'hide' : ''}`}>
      <div className="notification-content">
        <div className={`status-icon ${isError ? 'error-icon' : 'success-icon'}`}>
          {isError ? '!' : '✓'}
        </div>
        <span className="notification-message">{message}</span>
        <button className="close-notification" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

const ProductAddedNotification = ({ notification, onClose, closing }) => {
  const { product, selectedSize } = notification;
  
  const handleViewCart = (e) => {
    e.preventDefault();
    onClose();
    

    setTimeout(() => {
      window.location.href = '/cart';
    }, 310);
  };
  
  if (!product) return null;

  return (
    <div className={`product-notification ${closing ? 'fade-out' : 'fade-in'}`}>
      <div className="notification-content">
        <button className="close-notification" onClick={onClose}>×</button>
        
        <div className="notification-header">
          <div className="success-icon">✓</div>
          <h3>Produto adicionado ao carrinho!</h3>
        </div>
        
        <div className="product-info">
          <div className="product-image">
            <img src={product.image || (product.images && product.images[0])} alt={product.name} />
          </div>
          <div className="product-details">
            <h4>{product.name}</h4>
            {selectedSize && <p className="product-size">Tamanho: {selectedSize}</p>}
            <p className="product-price">{product.price.toFixed(2)} €</p>
          </div>
        </div>
        
        <div className="notification-actions">
          <button className="continue-btn" onClick={onClose}>
            Continuar a comprar
          </button>
          <button 
            className="view-cart-btn"
            onClick={handleViewCart}
          >
            Ver carrinho
          </button>
        </div>
      </div>
    </div>
  );
};


const NotificationSystem = {
  showToast: (message, actionText, onAction, duration = 3000) => {
    const notifications = window._notificationSystem;
    if (notifications && notifications.showToast) {
      return notifications.showToast(message, actionText, onAction, duration);
    } else {
      console.warn('NotificationSystem não está inicializado corretamente');
      

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.left = '50%';
      container.style.transform = 'translateX(-50%)';
      container.style.backgroundColor = '#000';
      container.style.color = '#fff';
      container.style.padding = '12px 20px';
      container.style.borderRadius = '8px';
      container.style.zIndex = '10000';
      container.textContent = message;
      
      document.body.appendChild(container);
      
      setTimeout(() => {
        document.body.removeChild(container);
      }, duration);
      
      return { id: Date.now() };
    }
  },

  showError: (message, duration = 3000) => {
    const notifications = window._notificationSystem;
    if (notifications && notifications.showError) {
      return notifications.showError(message, duration);
    }
    return NotificationSystem.showToast(message, null, null, duration);
  },

  showSuccess: (message, duration = 3000) => {
    const notifications = window._notificationSystem;
    if (notifications && notifications.showSuccess) {
      return notifications.showSuccess(message, duration);
    }
    return NotificationSystem.showToast(message, null, null, duration);
  },

  showProductAdded: (product, selectedSize, onViewCart, duration = 3000) => {
    const notifications = window._notificationSystem;
    if (notifications && notifications.showProductAdded) {
      return notifications.showProductAdded(product, selectedSize, onViewCart, duration);
    } else {
      console.warn('NotificationSystem não está inicializado corretamente');
      return { id: Date.now() };
    }
  },

  showUndoableToast: (message, onUndo, duration = 3000) => {
    const notifications = window._notificationSystem;
    if (notifications && notifications.showUndoableToast) {
      return notifications.showUndoableToast(message, onUndo, duration);
    } else {
      console.warn('NotificationSystem não está inicializado corretamente');
      return { id: Date.now() };
    }
  }
};


export default NotificationSystem;