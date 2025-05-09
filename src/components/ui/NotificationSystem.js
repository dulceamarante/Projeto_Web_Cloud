// src/components/ui/NotificationSystem.js
import React, { useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = ({ message, actionText, onAction, onClose }) => {
  useEffect(() => {
    // Fechar a notificação após 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Verificar se há uma mensagem para mostrar
  if (!message) {
    return null; // Não renderizar nada se não houver mensagem
  }
  
  return (
    <div className="notification-overlay">
      <div className="notification-toast">
        <div className="notification-content">
          <span className="notification-message">{message}</span>
          {actionText && onAction && (
            <button className="notification-action" onClick={onAction}>
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;