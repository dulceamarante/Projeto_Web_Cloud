import React, { createContext, useState, useEffect } from 'react';
import initialProductsData from '../data/products.json';

// Criar o contexto para fornecer e consumir os dados dos produtos
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Estados para gerir os dados dos produtos e funcionalidades relacionadas
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [recentlyViewed, setRecentlyViewed] = useState([]); 
  const [filters, setFilters] = useState({
    category: '', 
    minPrice: 0, 
    maxPrice: 1000, 
    search: '', 
    sort: 'popularity' 
  });

  
  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true); 

      // Simulação de uma chamada a uma API com um timeout
      setTimeout(() => {
        try {
          setProducts(initialProductsData); // Carregar os dados iniciais
          
          // Extrair categorias únicas dos produtos
          const uniqueCategories = [...new Set(initialProductsData.map(product => product.category))];
          setCategories(uniqueCategories); // Atualizar o estado das categorias

          setFilteredProducts(initialProductsData); 
          setLoading(false); 
        } catch (error) {
          console.error("Erro ao carregar produtos:", error); 
          setLoading(false); 
        }
      }, 500); 
    };

    fetchProducts(); 
  }, []);

  // Atualizar os filtros de pesquisa
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters })); 
  };

  // Obter um produto pelo ID
  const getProductById = (productId) => {
    return products.find(product => product.id === parseInt(productId)); 
  };

  // Obter os produtos com melhor avaliação
  const getTopProducts = (limit = 8) => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit); 
  };

  // Obter os produtos mais vendidos
  const getTopSellingProducts = (limit = 5) => {
    return [...products].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  };

  // Obter produtos semelhantes ao produto atual
  const getSimilarProducts = (product, limit = 4) => {
    if (!product) return []; 
    return products
      .filter(p => p.category === product.category && p.id !== product.id) 
      .slice(0, limit); 
  };

  // Adicionar um produto à lista de visualizados recentemente
  const addToRecentlyViewed = (product) => {
    if (!product) return; 
    const filteredList = recentlyViewed.filter(p => p.id !== product.id); 
    const updatedList = [product, ...filteredList].slice(0, 10); 
    setRecentlyViewed(updatedList); 
  };

  // Obter os produtos visualizados recentemente
  const getRecentlyViewedProducts = (limit = 5) => {
    const validProducts = recentlyViewed.filter(viewed => 
      products.some(p => p.id === viewed.id) 
    );
    return validProducts.slice(0, limit); 
  };

  return (
    <ProductContext.Provider value={{
      products, 
      filteredProducts, 
      categories, 
      loading, 
      filters, 
      updateFilters, 
      getProductById, 
      getTopProducts, 
      getTopSellingProducts, 
      getSimilarProducts, 
      addToRecentlyViewed, 
      getRecentlyViewedProducts 
    }}>
      {children} 
    </ProductContext.Provider>
  );
};
