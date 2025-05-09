// src/components/ui/NotificationToast.js
import React, { useEffect } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ 
  message, 
  actionText, 
  onAction, 
  onClose,
  duration = 5000 // Por padrão a notificação desaparece após 5 segundos
}) => {
  useEffect(() => {
    // Configurar timer para auto-fechar
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    // Limpar timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
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
  );
};

export default NotificationToast;