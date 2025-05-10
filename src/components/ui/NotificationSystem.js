// src/components/ui/NotificationSystem.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import './NotificationSystem.css';

// 1. Contexto para gerenciar notificações
const NotificationContext = createContext();

// 2. Tipos de notificações
export const NOTIFICATION_TYPES = {
  TOAST: 'toast',
  PRODUCT_ADDED: 'product-added',
  ERROR: 'error',
  SUCCESS: 'success'
};

// 3. Componente NotificationSystem que pode ser importado e usado diretamente
// (Compatível com código existente que usa import NotificationSystem from '...')
const NotificationSystem = ({ message, actionText, onAction, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  const handleAction = () => {
    if (onAction) {
      try {
        // Call the onAction callback directly
        onAction();
      } catch (error) {
        console.error("Error in notification action:", error);
      }
    }
    handleClose();
  };
  
  if (!message) return null;
  
  return (
    <div className={`notification-toast ${isExiting ? 'hide' : ''}`}>
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

// 4. Métodos estáticos para o componente NotificationSystem
// Estes permitem usar NotificationSystem.showToast(), etc.
NotificationSystem.showToast = (message, actionText, onAction, duration = 5000) => {
  const notifications = window._notificationSystem;
  if (notifications && notifications.showToast) {
    return notifications.showToast(message, actionText, onAction, duration);
  } else {
    console.warn('NotificationSystem não está inicializado corretamente');
    
    // Fallback: Mostrar uma notificação simples
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
};

NotificationSystem.showError = (message, duration = 5000) => {
  return NotificationSystem.showToast(message, null, null, duration);
};

NotificationSystem.showSuccess = (message, duration = 5000) => {
  return NotificationSystem.showToast(message, null, null, duration);
};

NotificationSystem.showProductAdded = (product, selectedSize, onViewCart, duration = 5000) => {
  const notifications = window._notificationSystem;
  if (notifications && notifications.showProductAdded) {
    return notifications.showProductAdded(product, selectedSize, onViewCart, duration);
  } else {
    console.warn('NotificationSystem não está inicializado corretamente');
    return { id: Date.now() };
  }
};

// 5. Provider que gerencia as notificações
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-remover após a duração especificada
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
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
    
    // Dar tempo para a animação de saída
    setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
    }, 300);
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const notificationAPI = {
    showToast: (message, actionText, onAction, duration = 5000) => {
      // Se a ação for ver carrinho, preparamos um redirecionamento seguro
      let finalAction = onAction;
      if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
        finalAction = () => {
          // Usando window.location para navegação
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
    
    showProductAdded: (product, selectedSize, onViewCart, duration = 5000) => {
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
  
  // Expor a API para métodos estáticos
  useEffect(() => {
    window._notificationSystem = notificationAPI;
    
    return () => {
      window._notificationSystem = null;
    };
  }, []);
  
  return (
    <NotificationContext.Provider value={notificationAPI}>
      {children}
      
      {/* Portal para renderizar notificações */}
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

// 6. Hook para usar notificações em componentes funcionais
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    console.warn('useNotification deve ser usado dentro de um NotificationProvider');
    
    // Retornar API simulada para evitar erros
    return {
      showToast: (message) => console.log('Toast:', message),
      showError: (message) => console.log('Error:', message),
      showSuccess: (message) => console.log('Success:', message),
      showProductAdded: () => console.log('Product added notification'),
      closeNotification: () => {},
      clearAll: () => {}
    };
  }
  
  return context;
};

// 7. Componente para renderizar diferentes tipos de notificação
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

// 8. Componentes específicos para cada tipo de notificação
const ToastNotification = ({ notification, onClose, closing }) => {
  const { message, actionText, onAction } = notification;
  
  const handleAction = () => {
    if (onAction) {
      try {
        onAction();
      } catch (error) {
        console.error("Error in toast notification action:", error);
        // Fallback for VER CARRINHO if onAction fails
        if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
          window.location.href = '/cart';
        }
      }
    } else if (actionText === "VER CARRINHO" || actionText === "VER CESTA") {
      window.location.href = '/cart';
    } else if (actionText === "DESFAZER") {
      console.log("DESFAZER action triggered without handler");
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
    
    // Redirecionar após fechar notificação
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

// Exportar como default para compatibilidade com código existente
export default NotificationSystem;