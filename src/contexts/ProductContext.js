
import React, { createContext, useState, useEffect } from 'react';


import initialProductsData from '../data/products.json';


export const ProductContext = createContext();


export const ProductProvider = ({ children }) => {
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
      

      setTimeout(() => {
        try {
          setProducts(initialProductsData);
          

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


  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getProductById = (productId) => {
    return products.find(product => product.id === parseInt(productId));
  };

  const getTopProducts = (limit = 8) => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
  };

  const getTopSellingProducts = (limit = 5) => {
    return [...products].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  };

  const getSimilarProducts = (product, limit = 4) => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  };

  const addToRecentlyViewed = (product) => {
    if (!product) return;
    const filteredList = recentlyViewed.filter(p => p.id !== product.id);
    const updatedList = [product, ...filteredList].slice(0, 10);
    setRecentlyViewed(updatedList);
  };

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