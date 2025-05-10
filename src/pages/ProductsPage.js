import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { CartContext } from '../contexts/CartContext';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import './ProductsPage.css';

const ProductsPage = () => {
  const { productId } = useParams(); // atenção ao nome no teu Route (":productId")
  const {
    getProductById,
    getSimilarProducts,
    addToRecentlyViewed,
    getRecentlyViewedProducts
  } = useContext(ProductContext);

  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetched = getProductById(productId);
    if (fetched) {
      setProduct(fetched);
      setSimilarProducts(getSimilarProducts(fetched));
      addToRecentlyViewed(fetched);
      setRecentlyViewed(
        getRecentlyViewedProducts().filter(p => p.id !== fetched.id)
      );
      setSelectedImage(0);
      setSelectedSize(null);
      setQuantity(1);
      document.title = `${fetched.name} | BDRP`;
    }
    return () => { document.title = 'BDRP'; };
  }, [
    productId,
    getProductById,
    getSimilarProducts,
    addToRecentlyViewed,
    getRecentlyViewedProducts
  ]);

  if (!product) {
    return <div className="loading">Carregando produto...</div>;
  }

  const productIsFav = isFavorite(product.id);

  const handleAddToCart = () => {
    if (product.variants?.length && !selectedSize) {
      alert('Por favor selecione um tamanho.');
      return;
    }
    setIsAddingToCart(true);
    addToCart(product, quantity, selectedSize);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  return (
    <div className="product-page">
      <div className="product-container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> &gt;{' '}
          <Link to={`/products?category=${product.category}`}>
            {product.category}
          </Link>{' '}
          &gt; <span>{product.name}</span>
        </div>

        <div className="product-main">
          {/* Galeria */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumbnail ${
                      selectedImage === i ? 'active' : ''
                    }`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="product-details">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-meta">
              <div className="product-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(product.rating) ? '#f8ce0b' : '#e0e0e0'}
                  />
                ))}
                <span>({product.reviews || 0} avaliações)</span>
              </div>
              <div className="product-reference">
                Ref: {product.sku || product.id}
              </div>
            </div>

            <div className="product-price">
              {product.oldPrice && (
                <span className="old-price">
                  {product.oldPrice.toFixed(2)} €
                </span>
              )}
              <span className="current-price">
                {product.price.toFixed(2)} €
              </span>
              {product.oldPrice && (
                <span className="discount-badge">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Tamanhos */}
            {product.variants?.length > 0 && (
              <div className="size-selection">
                <h3>Tamanho</h3>
                <div className="size-options">
                  {product.variants.map(v => (
                    <button
                      key={v.size}
                      className={`size-btn ${
                        selectedSize === v.size ? 'selected' : ''
                      } ${v.stock === 0 ? 'disabled' : ''}`}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedSize(v.size)}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="quantity-selection">
              <h3>Quantidade</h3>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="product-actions">
              <button
                className={`add-to-cart-btn ${isAddingToCart ? 'adding' : ''}`}
                onClick={handleAddToCart}
              >
                ADICIONAR À CESTA
              </button>
              <button
                className={`favorite-btn ${productIsFav ? 'active' : ''}`}
                onClick={() => toggleFavorite(product)}
                aria-label={
                  productIsFav
                    ? 'Remover dos favoritos'
                    : 'Adicionar aos favoritos'
                }
              >
                {productIsFav ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* Descrição */}
            <div className="product-description">
              <h3>Descrição</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Similares */}
        {similarProducts.length > 0 && (
          <section className="similar-products-section">
            <h2>PRODUTOS SIMILARES</h2>
            <div className="similar-products-grid">
              {similarProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="similar-product-card"
                >
                  <img src={p.image} alt={p.name} />
                  <div className="info">
                    <span className="name">{p.name}</span>
                    <span className="price">{p.price.toFixed(2)} €</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Vistos recentemente */}
        {recentlyViewed.length > 0 && (
          <section className="recently-viewed-section">
            <h2>VIU RECENTEMENTE</h2>
            <div className="recently-viewed-grid">
              {recentlyViewed.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="recently-viewed-card"
                >
                  <img src={p.image} alt={p.name} />
                  <div className="info">
                    <span className="name">{p.name}</span>
                    <span className="price">{p.price.toFixed(2)} €</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
