import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import './TopProducts.css';

const TopProducts = () => {
  const { getTopSellingProducts, loading } = useContext(ProductContext);
  const carouselRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  
  // Obter produtos mais vendidos do contexto
  const topProducts = getTopSellingProducts(5); // Obter os 5 mais vendidos
  
  // Função para navegar no carrossel
  const scroll = (direction) => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Função para adicionar/remover dos favoritos
  const toggleFavorite = (event, productId) => {
    event.preventDefault(); // Evita navegação ao clicar no coração
    event.stopPropagation(); // Evita a propagação do clique
    
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };
  
  // Função para adicionar ao carrinho
  const addToCart = (event, product) => {
    event.preventDefault(); // Evita navegação ao clicar no botão
    event.stopPropagation(); // Evita a propagação do clique
    
    // Aqui você implementaria a lógica de adicionar ao carrinho
    // Isso poderia ser através de um Context, Redux, ou outra solução de gerenciamento de estado
    console.log(`Produto ${product.name} adicionado ao carrinho`);
    
    // Exibir um feedback visual (opcional)
    alert(`${product.name} adicionado ao carrinho!`);
  };
  
  if (loading) {
    return <div className="loading">Carregando produtos mais vendidos...</div>;
  }
  
  // Verifica se topProducts existe e tem itens
  if (!topProducts || topProducts.length === 0) {
    return <div className="no-products">Nenhum produto em destaque disponível.</div>;
  }

  return (
    <section className="top-products-section">
      <h2 className="section-title">MAIS VENDIDOS</h2>
      
      <div className="products-carousel">
        <button 
          className="carousel-control prev"
          onClick={() => scroll('left')}
          aria-label="Anterior"
        >
          <img src="/assets/images/Setas/SetaEsquerda.png" alt="Seta para a esquerda" />
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="products-container" ref={carouselRef}>
          {topProducts.map(product => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <Link to={`/product/${product.id}`} className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.jpg'; // Imagem de fallback
                      console.error(`Erro ao carregar imagem: ${product.image}`); // Log para debug
                    }} 
                  />
                  <button 
                    className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(e, product.id)}
                    aria-label={favorites.includes(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <i className={`fas ${favorites.includes(product.id) ? 'fa-heart' : 'fa-heart'}`}></i>
                  </button>
                </Link>
              </div>
              
              <div className="product-info">
                <div className="product-category">
                  {product.category} {product.subcategory && `• ${product.subcategory}`}
                </div>
                <Link to={`/product/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                <div className="product-price">
                  {product.price.toFixed(2)} €
                </div>
                
                {/* Adicionando seleção de tamanhos */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="product-sizes">
                    <div className="sizes-label">ADICIONAR TAMANHO</div>
                    <div className="sizes-options">
                      {product.sizes.map(size => (
                        <button 
                          key={size} 
                          className="size-option"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button 
                  className="add-to-cart-button"
                  onClick={(e) => addToCart(e, product)}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-control next"
          onClick={() => scroll('right')}
          aria-label="Próximo"
        >
          <img src="/assets/images/Setas/SetaDireita.png" alt="Seta para a direita" />
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className="responsibility-section">
        <div className="responsibility-content">
          <h2>O NOSSO SENTIDO DE RESPONSABILIDADE</h2>
          <button className="outline-button">DESCUBRA MAIS</button>
        </div>
      </div>
      
    </section>
  );
};

export default TopProducts;