import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import './FavoritesPopOver.css';

export default function FavoritesPopOver({ onClose }) {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleViewAll = () => {
    onClose();
    navigate('/favorites');
  };

  if (!favorites.length) {
    return (
      <div className="favorites-popover">
        <p>Não tens favoritos.</p>
      </div>
    );
  }

  return (
    <div className="favorites-popover">
      <h4>OS MEUS FAVORITOS</h4>
      <ul className="fav-list">
        {favorites.map(item => (
          <li key={item.id} className="fav-item">
            {item.image && (
              <img src={item.image} alt={item.name} className="fav-img" />
            )}
            <span className="fav-name">{item.name}</span>
            <button
              className="fav-remove"
              onClick={() => removeFromFavorites(item.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button className="fav-view-all" onClick={handleViewAll}>
        Ver favoritos
      </button>
    </div>
  );
}
