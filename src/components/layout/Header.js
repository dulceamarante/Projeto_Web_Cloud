// Header.js - Menu com categorias horizontais e subcategorias verticais
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

// Array de produtos para pesquisa
const products = [
  {
    id: 1,
    name: "Vestido Floral Folhos",
    description: "Design longo...",
    price: 49.99,
    oldPrice: 69.99,
    category: "vestidos",
    image: "/assets/images/products/vestido-1.jpg"
  },
  {
    id: 2,
    name: "Sabrinas Metalizadas",
    description: "Tecido metalizado...",
    price: 39.99,
    category: "sapatos",
    image: "/assets/images/products/sabrina-1.jpg"
  },
  {
    id: 3,
    name: "Mala de Ombro de Pele com Estampado",
    description: "100% pele bovina...",
    price: 79.99,
    category: "acessorios",
    image: "/assets/images/products/mala-1.jpg"
  },
  {
    id: 4,
    name: "Casaco de Algodão com Botões de Jóia",
    description: "Tecido com mistura...",
    price: 59.99,
    category: "casacos",
    image: "/assets/images/products/casaco-1.jpg"
  },
  {
    id: 5,
    name: "T-shirt com Gola Assimétrica",
    description: "Tecido fluido...",
    price: 19.99,
    category: "tshirt",
    image: "/assets/images/products/tshirt-1.jpg"
  }
];

// Definição de categorias conforme código original
const categories = {
  mulher: [
    "CAMISAS", 
    "T-SHIRTS", 
    "JEANS", 
    "CALÇAS", 
    "CASACOS"
  ],
  homem: [
    "CAMISAS", 
    "T-SHIRTS", 
    "JEANS", 
    "CALÇAS", 
    "CASACOS"
  ],
  beauty: [
    "MAKEUP", 
    "PERFUMES", 
    "SKINCARE"
  ]
};

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher'); // Categoria padrão
  const [subMenuAnimation, setSubMenuAnimation] = useState('');

  // Efeito para fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Abrir menu lateral
  const openCategoryMenu = () => {
    setMenuOpen(true);
  };

  // Fechar menu lateral
  const closeCategoryMenu = () => {
    setMenuOpen(false);
  };

  // Alternar subcategorias com animação
  const toggleSubcategory = (category) => {
    if (activeCategory === category) {
      return; // Já está ativa, não faz nada
    }
    
    setSubMenuAnimation('slide-out');
    setTimeout(() => {
      setActiveCategory(category);
      setSubMenuAnimation('slide-in');
    }, 300); // Tempo da animação
  };

  // Abrir pesquisa
  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Pesquisar em tempo real
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="#" onClick={(e) => {e.preventDefault(); openCategoryMenu(); setActiveCategory('mulher');}}>MULHER</a>
          <a href="#" onClick={(e) => {e.preventDefault(); openCategoryMenu(); setActiveCategory('homem');}}>HOMEM</a>
          <a href="#" onClick={(e) => {e.preventDefault(); openCategoryMenu(); setActiveCategory('beauty');}}>BEAUTY</a>
        </div>
        
        <div className="header-center">
          <Link to="/">BDRP</Link>
        </div>
        
        <div className="header-right">
          <a href="#" onClick={(e) => {e.preventDefault(); openSearch();}}>PESQUISAR</a>
          <Link to="/login">INICIAR SESSÃO</Link>
          <Link to="/favorites">FAVORITOS (0)</Link>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>

      {/* Menu lateral com categorias horizontais e subcategorias verticais */}
      {menuOpen && (
        <div className="side-menu-wrapper">
          <div className="side-menu">
            <button className="close-menu-button" onClick={closeCategoryMenu}>×</button>
            
            <div className="side-menu-content">
              {/* Categorias principais na horizontal */}
              <div className="main-categories">
                <a 
                  href="#" 
                  className={activeCategory === 'mulher' ? 'active' : ''}
                  onClick={(e) => {e.preventDefault(); toggleSubcategory('mulher');}}
                >
                  MULHER
                </a>
                <a 
                  href="#" 
                  className={activeCategory === 'homem' ? 'active' : ''}
                  onClick={(e) => {e.preventDefault(); toggleSubcategory('homem');}}
                >
                  HOMEM
                </a>
                <a 
                  href="#" 
                  className={activeCategory === 'beauty' ? 'active' : ''}
                  onClick={(e) => {e.preventDefault(); toggleSubcategory('beauty');}}
                >
                  BEAUTY
                </a>
              </div>
              
              {/* Subcategorias com animação de slide */}
              <div className={`subcategories-container ${subMenuAnimation}`}>
                <ul className="category-list">
                  {categories[activeCategory].map((item, index) => (
                    <li key={index}>
                      <Link 
                        to={`/products?category=${item.toLowerCase()}`} 
                        onClick={closeCategoryMenu}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="side-menu-overlay" onClick={closeCategoryMenu}></div>
        </div>
      )}

      {/* Modal de pesquisa */}
      {searchOpen && (
        <div className="search-modal">
          <button className="close-search-button" onClick={() => setSearchOpen(false)}>×</button>
          <div className="search-modal-content">
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="O QUE PROCURA?"
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
            </div>
            
            <div className="search-results-container">
              <h2 className="results-title">TALVEZ LHE INTERESSE</h2>
              <div className="search-results-grid">
                {(searchResults.length > 0 ? searchResults : products).map(product => (
                  <div key={product.id} className="product-item">
                    <Link 
                      to={`/product/${product.id}`} 
                      className="product-link"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                          {product.oldPrice && (
                            <span className="old-price">{product.oldPrice.toFixed(2)} EUR</span>
                          )}
                          <span className="current-price">{product.price.toFixed(2)} EUR</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;