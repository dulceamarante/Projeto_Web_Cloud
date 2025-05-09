// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import { ProductProvider } from './contexts/ProductContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <Router>
      <ProductProvider>
        <FavoritesProvider>
          <CartProvider>
            <div className="app">
              <Header />
              <main className="content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  {/* As rotas para ProductPage e CartPage serão adicionadas mais tarde */}
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </ProductProvider>
    </Router>
  );
}

export default App;