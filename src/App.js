// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProductProvider } from './contexts/ProductContext';
import { NotificationProvider } from './components/ui/NotificationSystem';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import ResponsibilityPage from './pages/ResponsibilityPage';
import ProductDetails from './components/products/ProductDetails';
import products from './data/products.json';
import HomeHomem from './pages/HomePageHomem';
import HomeBeauty from './pages/HomePageBeauty';

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <Router>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Rotas para produtos por gênero */}
                  <Route path="/:gender/products" element={<ProductsPage />} />
                  <Route path="/:gender/:category" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetails products={products} />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/responsibility" element={<ResponsibilityPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/homem" element={<HomeHomem />} />
                  <Route path="/beauty" element={<HomeBeauty />} />
                </Routes>
                </main>
               <Footer />
            </Router>
          </NotificationProvider>
        </FavoritesProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;


