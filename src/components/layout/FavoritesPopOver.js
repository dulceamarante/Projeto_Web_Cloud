import React, { useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './FavoritesPopOver.css';

const FavoritesPopOver = ({ onClose }) => {
  const { favorites, removeFavorite } = useContext(FavoritesContext);
  const popoverRef = useRef(null);

  // Fechar ao clicar fora do popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="favorites-popover-overlay">
      <div className="favorites-popover" ref={popoverRef}>
        <div className="favorites-header">
          <h2>FAVORITOS ({favorites.length})</h2>
        </div>

        <div className="favorites-items">
          {favorites.length === 0 ? (
            <p className="no-favorites">Não tem artigos na lista de favoritos</p>
          ) : (
            favorites.map((item) => (
              <div className="favorite-item" key={item.id}>
                <div className="favorite-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="favorite-details">
                  <h3>{item.name}</h3>
                  <p className="favorite-price">{item.price} €</p>
                  <p className="favorite-color">{item.color}</p>
                  <p className="favorite-size">Tamanho: {item.size}</p>
                </div>
                <div className="favorite-actions">
                  <button
                    className="favorite-add-to-cart"
                    onClick={() => {
                      // Adicionar ao carrinho (implementação futura)
                      console.log('Adicionar ao carrinho:', item);
                    }}
                  >
                    Adicionar à cesta
                  </button>
                  <button
                    className="favorite-remove"
                    onClick={() => removeFavorite(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {favorites.length > 0 && (
          <div className="favorites-footer">
            <div className="favorites-actions">
              <Link to="/favoritos" className="view-favorites-button" onClick={onClose}>
                Ver todos os favoritos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPopOver;