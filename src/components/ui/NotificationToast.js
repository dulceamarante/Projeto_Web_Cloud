// src/components/ui/NotificationToast.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationToast.css';

const NotificationToast = ({
  message,
  actionText,
  onAction,
  onClose,
  duration = 5000 // Por padrão a notificação desaparece após 5 segundos
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar timer para auto-fechar
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    // Limpar timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const handleAction = () => {
    // Verificar tipo de ação
    if (actionText === "VER CESTA") {
      // Usar navigate para manter o estado React
      navigate('/cart');
    } else if (onAction) {
      // Para outras ações, chamar callback
      onAction();
    }
    handleClose();
  };

  return (
    <div className={`notification-toast ${isExiting ? 'hide' : ''}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        {actionText && (
          <button className="notification-action" onClick={handleAction}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationToast;