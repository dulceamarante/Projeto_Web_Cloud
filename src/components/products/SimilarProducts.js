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

      const cartItems = cart.map(item => item.id);
      const cartCategories = [...new Set(cart.map(item => item.category))];
      const cartSubcategories = [...new Set(cart.map(item => item.subcategory).filter(Boolean))];
      const cartGenders = [...new Set(cart.map(item => item.gender))];


      const similar = products.filter(product => {

        if (cartItems.includes(product.id)) return false;


        let similarity = 0;


        if (cartCategories.includes(product.category)) {
          similarity += 5;
        }


        if (cartSubcategories.includes(product.subcategory)) {
          similarity += 3;
        }


        if (cartGenders.includes(product.gender)) {
          similarity += 2;
        }

        return similarity > 0;
      });


      const sortedSimilar = similar.sort((a, b) => {
        const aScore = (cartCategories.includes(a.category) ? 5 : 0) +
                      (cartGenders.includes(a.gender) ? 2 : 0) +
                      (a.popularity / 100);
        const bScore = (cartCategories.includes(b.category) ? 5 : 0) +
                      (cartGenders.includes(b.gender) ? 2 : 0) +
                      (b.popularity / 100);
        return bScore - aScore;
      });


      if (sortedSimilar.length >= 15) {
        selectedProducts = sortedSimilar.slice(0, 15);
      } else {

        const popularProducts = products
          .filter(product => !cartItems.includes(product.id) && !sortedSimilar.includes(product))
          .sort((a, b) => b.popularity - a.popularity);
        
        selectedProducts = [...sortedSimilar, ...popularProducts].slice(0, 15);
      }
    } else {

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