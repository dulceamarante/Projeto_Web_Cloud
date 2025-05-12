// Importações necessárias
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import ProductCard from './ProductCard';
import products from '../../data/products.json';
import './SimilarProducts.css';

// Componente que apresenta produtos semelhantes com base no conteúdo do carrinho
export default function SimilarProducts() {
  const { cart } = useContext(CartContext); // Acede ao carrinho de compras através do contexto
  const [similarProducts, setSimilarProducts] = useState([]); // Estado local para os produtos sugeridos

  useEffect(() => {
    let selectedProducts = []; // Lista final de produtos a mostrar
    
    if (cart && cart.length > 0) {
      // Extrai IDs, categorias, subcategorias e géneros dos produtos no carrinho
      const cartItems = cart.map(item => item.id);
      const cartCategories = [...new Set(cart.map(item => item.category))];
      const cartSubcategories = [...new Set(cart.map(item => item.subcategory).filter(Boolean))];
      const cartGenders = [...new Set(cart.map(item => item.gender))];

      // Filtra produtos com alguma semelhança com os do carrinho
      const similar = products.filter(product => {
        // Ignora produtos que já estão no carrinho
        if (cartItems.includes(product.id)) return false;

        let similarity = 0;

        // Atribui pontos de semelhança conforme a categoria, subcategoria ou género coincida
        if (cartCategories.includes(product.category)) {
          similarity += 5;
        }
        if (cartSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }
        if (cartGenders.includes(product.gender)) {
          similarity += 2;
        }

        // Retém apenas os produtos com alguma semelhança
        return similarity > 0;
      });

      // Ordena os produtos semelhantes por pontuação de semelhança e popularidade
      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (cartCategories.includes(a.category) ? 5 : 0) +
                      (cartGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (cartCategories.includes(b.category) ? 5 : 0) +
                      (cartGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });

      // Se houver pelo menos 15 semelhantes, usa-os
      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {
        // Caso contrário, completa com produtos populares que não estão no carrinho
        const popularProducts = products
          .filter(product => !cartItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
        
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {
      // Se o carrinho estiver vazio, mostra os produtos mais populares
      selectedProducts = products
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 15);
    }

    // Atualiza o estado com os produtos escolhidos
    setSimilarProducts(selectedProducts);
  }, [cart]);

  // Se não houver produtos para mostrar, não renderiza nada
  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="similar-products-section">
      <h2>TALVEZ LHE INTERESSE</h2>
      <div className="similar-products-grid">
        {/* Renderiza os produtos semelhantes usando ProductCard */}
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
