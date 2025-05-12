// src/components/products/SimilarProducts.js
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import ProductCard from './ProductCard';
import products from '../../data/products.json';
import './SimilarProducts.css';

export default function SimilarProducts() {
  const { cart } = useContext(CartContext);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    let selectedProducts = [];
    
    if (cart && cart.length > 0) {
      // Extrair informações dos produtos no carrinho
      const cartItems = cart.map(item => item.id);
      const cartCategories = [...new Set(cart.map(item => item.category))];
      const cartSubcategories = [...new Set(cart.map(item => item.subcategory).filter(Boolean))];
      const cartGenders = [...new Set(cart.map(item => item.gender))];

      // Filtrar produtos similares
      const similar = products.filter(product => {
        // Não incluir produtos que já estão no carrinho
        if (cartItems.includes(product.id)) return false;

        // Calcular pontuação de similaridade
        let similarity = 0;

        // Mesma categoria = +5 pontos
        if (cartCategories.includes(product.category)) {
          similarity += 5;
        }

        // Mesma subcategoria = +3 pontos
        if (cartSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }

        // Mesmo gênero = +2 pontos
        if (cartGenders.includes(product.gender)) {
          similarity += 2;
        }

        return similarity > 0;
      });

      // Ordenar por similaridade e popularidade
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (cartCategories.includes(a.category) ? 5 : 0) +
                      (cartGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (cartCategories.includes(b.category) ? 5 : 0) +
                      (cartGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });

      // Se temos produtos similares suficientes, usar eles
      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {
        // Se não temos suficientes, misturar com produtos populares
        const popularProducts = products
          .filter(product => !cartItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
        
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {
      // Se o carrinho estiver vazio, mostrar produtos populares
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15);
    }

    setSimilarProducts(selectedProducts);
  }, [cart]);

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="similar-products-section">
      <h2>TALVEZ LHE INTERESSE</h2>
      <div className="similar-products-grid">
        {similarProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
}