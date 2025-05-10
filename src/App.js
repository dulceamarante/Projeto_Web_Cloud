import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProductProvider } from './contexts/ProductContext';
import './styles/global.css';
import NotificationSystem from './components/ui/NotificationSystem';
import ResponsibilityPage from './pages/ResponsibilityPage';

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                  <Route path="/responsibility" element={<ResponsibilityPage />} />
                </Routes>
              </main>
              <NotificationSystem />
              <Footer />
            </div>
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;