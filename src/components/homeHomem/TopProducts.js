
// TopProducts.js

// Importação do React e do hook useContext
import React, { useContext } from 'react';
// Importação do Link do React Router
import { Link } from 'react-router-dom';
// Importação dos contextos para produtos e favoritos
import { ProductContext } from '../../contexts/ProductContext';
import { FavoritesContext } from '../../contexts/FavoritesContext';
// Importação do componente ProductCard
import ProductCard from '../products/ProductCard';
// Importação do ficheiro CSS local
import './TopProducts.css';

// Definição e exportação do componente funcional TopProducts
export default function TopProducts() {
  // Extracção de produtos e estado de carregamento do contexto
  const { products, loading } = useContext(ProductContext);
  // Extracção das funções de favoritos do contexto
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
 
  // Função para obter os produtos mais vendidos para homem
  const getTopSellingWomenProducts = (count) => {
    // Filtra produtos por género 'homem'
    const womenProducts = products.filter(product => 
      product.gender?.toLowerCase() === 'homem'
    );
    
    // Ordena por popularidade em ordem decrescente
    const sorted = [...womenProducts].sort((a, b) => b.popularity - a.popularity);
    
    // Retorna apenas o número solicitado de produtos
    return sorted.slice(0, count);
  };
 
  // Obter os 5 produtos mais vendidos para homem
  const topProducts = getTopSellingWomenProducts(5);
 
  // Função para adicionar ao carrinho
  const addToCart = (productId, variant) => {
    alert(`Item ${productId} (tamanho ${variant.size}) adicionado!`);
  };
 
  // Retorna elemento de carregamento se ainda estiver a carregar
  if (loading) return <div className="loading">Carregando...</div>;
  // Retorna mensagem se não houver produtos para homem
  if (!topProducts.length) return <div className="no-products">Sem produtos para homem</div>;
 
  return (
    // Secção principal dos produtos em destaque
    <section className="top-products-section">
      {/* Título da secção para produtos de homem */}
      <h2 className="section-title">TOP SELLERS HOMEM</h2>
     
      {/* Grelha com os produtos */}
      <div className="products-grid">
        {/* Mapeamento dos produtos para criar cartões */}
        {topProducts.map(prod => (
          <ProductCard
            key={prod.id}                    // Chave única para o React
            product={{
              ...prod,                       // Spread do produto
              isFavorite: isFavorite(prod.id) // Adiciona estado de favorito
            }}
            addToCart={addToCart}            // Função para adicionar ao carrinho
          />
        ))}
      </div>
     
      {/* Secção de responsabilidade */}
      <div className="responsibility-section">
        <div className="responsibility-content">
          {/* Título da secção */}
          <h2 className="responsibility-title">VESTIR COM CONSCIÊNCIA</h2>
          {/* Link para a página de responsabilidade */}
          <Link to="/responsibility">
            <button className="outline-button">DESCOBRIR MAIS</button>
          </Link>
        </div>
      </div>
    </section>
  );
}