// Importações de dependências React e de contexto
import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { useNotification } from '../ui/NotificationSystem';
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';
import './ProductDetails.css';

// Componente principal que mostra os detalhes de um produto
export default function ProductDetails({ products }) {
  // Obtém o ID do produto a partir da URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Acesso aos contextos de carrinho e favoritos
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { showToast, showError } = useNotification();

  // Estados locais para animação, imagem atual e tamanho selecionado
  const [animateHeart, setAnimateHeart] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const favBtnRef = useRef(null);

  // Encontra o produto correspondente ao ID
  const product = products.find(p => String(p.id) === id);
  const isProductFavorite = isFavorite(product?.id);

  // Determina se o produto requer seleção de tamanho
  const doesNotRequireSize = 
    product?.category === 'beauty' || 
    product?.gender === 'beauty' ||
    product?.subcategory === 'skincare' ||
    !product?.variants || 
    product?.variants.length === 0;

  // Alterna o estado de favorito e ativa a animação
  const handleToggleFavorite = e => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(product);
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 1200);
  };

  // Navegação entre imagens do produto
  const prev = () => {
    setCurrentImage(i =>
      i === 0 ? (product.images?.length || 1) - 1 : i - 1
    );
  };

  const next = () => {
    setCurrentImage(i =>
      i === (product.images?.length || 1) - 1 ? 0 : i + 1
    );
  };

  // Atualiza o tamanho selecionado
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Adiciona o produto ao carrinho com validação do tamanho
  const handleAddToCart = () => {
    if (!doesNotRequireSize) {
      if (product.variants && product.variants.length > 0 && !selectedSize) {
        showError("Por favor, selecione um tamanho antes de adicionar ao carrinho.", 3000);
        return;
      }
    }

    addToCart(product, 1, selectedSize || null);

    showToast(
      "PRODUTO ADICIONADO AO CARRINHO",
      "VER CARRINHO",
      () => {
        navigate('/cart');
      }
    );
  };

  // Limpa o estado de animação após um tempo
  useEffect(() => {
    if (animateHeart) {
      const timer = setTimeout(() => {
        setAnimateHeart(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [animateHeart]);

  // Renderiza as estrelas do rating com base na classificação
  function renderStars(rating) {
    const validRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

    return (
      <>
        {[...Array(validRating)].map((_, i) => (
          <FaStar key={i} color="#ffc107" />
        ))}
        {[...Array(5 - validRating)].map((_, i) => (
          <FaRegStar key={i + validRating} color="#ccc" />
        ))}
      </>
    );
  }

  // Se o produto não existir, mostra uma mensagem
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-details-page">
      {/* Coluna de imagem do produto */}
      <div className="product-image-column">
        <div className="image-wrapper">
          <img
            src={product.images?.[currentImage] || product.image}
            alt={product.name}
            className="product-detail-image"
          />
          {/* Botões de navegação se houver várias imagens */}
          {product.images?.length > 1 && (
            <>
              <button className="nav-arrow left" onClick={prev}>
                <FaChevronLeft size={24} />
              </button>
              <button className="nav-arrow right" onClick={next}>
                <FaChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Coluna com informações e ações do produto */}
      <div className="product-info-column">
        <h1 className="product-title">{product.name}</h1>
        <div className="rating">
          Rating:
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-value"> {product.rating}</span>
        </div>
        <p className="product-description">{product.description}</p>

        {/* Preço antigo e atual */}
        {product.oldPrice && (
          <p className="old-price">Antes: <span>{product.oldPrice.toFixed(2)} €</span></p>
        )}
        <p className="price">{product.price.toFixed(2)} €</p>

        {/* Se necessário, mostra dropdown para seleção de tamanho */}
        {!doesNotRequireSize && product.variants?.length > 0 && (
          <select 
            className="size-select"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="">Tamanho</option>
            {product.variants.map((v, index) => (
              <option key={index} value={v.size}>{v.size}</option>
            ))}
          </select>
        )}

        {/* Botões para adicionar ao carrinho e favoritos */}
        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Adicionar ao cesto
          </button>

          <button
            ref={favBtnRef}
            className={`fav-btn ${animateHeart ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={
              isProductFavorite
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'
            }
          >
            {isProductFavorite ? (
              <FaHeart style={{ color: '#e41e63', fill: '#e41e63' }} />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
