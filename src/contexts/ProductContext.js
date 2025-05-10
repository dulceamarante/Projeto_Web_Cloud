import React, { createContext, useState, useEffect } from 'react';

// Importar os dados de produtos
import initialProductsData from '../data/products.json';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]); // Estado para produtos vistos recentemente
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    search: '',
    sort: 'popularity'
  });

  useEffect(() => {
    // Simulando uma chamada de API
    const fetchProducts = () => {
      setLoading(true);
      
      // Simular uma pequena demora para dar a sensação de carregamento de dados
      setTimeout(() => {
        try {
          setProducts(initialProductsData);
          
          // Extrair categorias únicas dos produtos
          const uniqueCategories = [...new Set(initialProductsData.map(product => product.category))];
          setCategories(uniqueCategories);
          
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

  // Carregar produtos vistos recentemente do localStorage
  useEffect(() => {
    try {
      const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
      if (storedRecentlyViewed) {
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos vistos recentemente:', error);
    }
  }, []);

  // Salvar produtos vistos recentemente no localStorage quando mudar
  useEffect(() => {
    try {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Erro ao salvar produtos vistos recentemente:', error);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    // Aplicar filtros aos produtos
    const applyFilters = () => {
      let filtered = [...products];
      
      // Filtrar por categoria
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
      }
      
      // Filtrar por preço
      filtered = filtered.filter(product => 
        product.price >= filters.minPrice && product.price <= filters.maxPrice
      );
      
      // Filtrar por pesquisa
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }
      
      // Ordenar produtos
      switch (filters.sort) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default: // popularity
          filtered.sort((a, b) => b.popularity - a.popularity);
      }
      
      setFilteredProducts(filtered);
    };

    if (products.length > 0) {
      applyFilters();
    }
  }, [products, filters]);

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const getProductById = (productId) => {
    return products.find(product => product.id === parseInt(productId));
  };

  const getTopProducts = (limit = 8) => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  const getSimilarProducts = (product, limit = 4) => {
    if (!product) return [];
    
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  };

  const getTopSellingProducts = (limit = 5) => {
    // Em um cenário real, você teria um campo como 'salesCount' ou 'popularity'
    // que seria atualizado através de um sistema de back-end
    return [...products]
      .sort((a, b) => (b.salesCount || b.popularity) - (a.salesCount || a.popularity))
      .slice(0, limit); // Limitar ao número especificado
  };

  // Função para adicionar um produto à lista de vistos recentemente
  const addToRecentlyViewed = (product) => {
    if (!product) return;
    
    // Remover o produto da lista atual, se já estiver presente
    const filteredList = recentlyViewed.filter(p => p.id !== product.id);
    
    // Adicionar o produto ao início da lista
    const updatedList = [product, ...filteredList].slice(0, 10); // Limitar a 10 produtos
    
    setRecentlyViewed(updatedList);
  };

  // Função para obter produtos vistos recentemente
  const getRecentlyViewedProducts = (limit = 5) => {
    // Filtrar produtos que ainda existem na lista de produtos atual
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
      addToRecentlyViewed, // Nova função
      getRecentlyViewedProducts // Nova função
    }}>
      {children}
    </ProductContext.Provider>
  );
};