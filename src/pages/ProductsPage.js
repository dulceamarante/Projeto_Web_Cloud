import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { ProductContext } from '../contexts/ProductContext';
import './ProductsPage.css';

export default function ProductsPage() {
  const { gender, category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading } = useContext(ProductContext);

  const [currentProducts, setCurrentProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState('popularity');
  const [activeType, setActiveType] = useState('VER TUDO');
  const [activeColor, setActiveColor] = useState('');
  const [activeSize, setActiveSize] = useState('');
  const [productTypes, setProductTypes] = useState(['VER TUDO']);
  const [colors, setColors] = useState([]);

  const sizes = [
    'XS','S','M','L','XL','XXL',
    ...Array.from({ length: 12 }, (_, i) => String(34 + i))
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(o => !o);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setCurrentPage(parseInt(p.get('page')) || 1);
    setSortOption(p.get('sort') || 'popularity');
    setActiveType(
      p.get('type') ||
      (category ? category.toUpperCase() : 'VER TUDO')
    );
    setActiveColor(p.get('color') || '');
    setActiveSize(p.get('size') || '');
  }, [location.search, category]);

  useEffect(() => {
    if (!products.length) return;
    let f = filterProductsByGender(products, gender);
    if (category) {
      f = f.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    const cats = ['VER TUDO'];
    f.forEach(p => {
      const c = p.category.toUpperCase();
      if (!cats.includes(c)) cats.push(c);
    });
    setProductTypes(cats);
  }, [products, gender, category]);

  useEffect(() => {
    if (!products.length) return;
    let f = filterProductsByGender(products, gender);
    if (category) {
      f = f.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    const defaultColors = [
      'black','white','red','blue','green',
      'yellow','purple','pink','orange','grey'
    ];
    const extra = new Set();
    f.forEach(p =>
      p.variants?.forEach(v =>
        v.color && extra.add(v.color.toLowerCase())
      )
    );
    const allColors = [
      ...defaultColors,
      ...Array.from(extra).filter(c => !defaultColors.includes(c))
    ];
    setColors(allColors);
  }, [products, gender, category]);

  useEffect(() => {
    if (!products.length) return;
    let f = filterProductsByGender(products, gender);

    if (category) {
      f = f.filter(p => p.category.toLowerCase() === category.toLowerCase());
    } else if (activeType !== 'VER TUDO') {
      f = f.filter(p => p.category.toUpperCase() === activeType);
    }

    if (activeColor) {
      f = f.filter(p =>
        p.variants?.some(v => v.color.toLowerCase() === activeColor.toLowerCase())
      );
    }
    if (activeSize) {
      f = f.filter(p =>
        p.variants?.some(v => v.size?.toUpperCase() === activeSize)
      );
    }

    switch (sortOption) {
      case 'price-low':
        f.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        f.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        f.sort((a, b) => b.rating - a.rating);
        break;
      default:
        f.sort((a, b) => b.popularity - a.popularity);
    }

    setCurrentProducts(f);
  }, [
    products, gender, category,
    activeType, activeColor, activeSize, sortOption
  ]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (currentPage > 1) p.set('page', currentPage);
    if (sortOption !== 'popularity') p.set('sort', sortOption);
    if (activeType !== 'VER TUDO' && !category) p.set('type', activeType);
    if (activeColor) p.set('color', activeColor);
    if (activeSize) p.set('size', activeSize);
    navigate(`${location.pathname}?${p.toString()}`, { replace: true });
  }, [
    currentPage, sortOption,
    activeType, activeColor, activeSize,
    category, location.pathname, navigate
  ]);

  const handleTypeChange = t => {
    setActiveType(t);
    setCurrentPage(1);
    if (t === 'VER TUDO') navigate(`/${gender}/products`);
    else navigate(`/${gender}/${t.toLowerCase()}`);
  };
  const handleColorChange = c => {
    setActiveColor(prev => (prev === c ? '' : c));
    setCurrentPage(1);
  };
  const handleSizeChange = s => {
    setActiveSize(prev => (prev === s ? '' : s));
    setCurrentPage(1);
  };
  const handleSortChange = e => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };
  const clearFilters = () => {
    setActiveColor('');
    setActiveSize('');
    setSortOption('popularity');
    setCurrentPage(1);
    if (!category) setActiveType('VER TUDO');
  };

  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const paginated = currentProducts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const btns = [];

    btns.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(cp => cp - 1)}
        disabled={currentPage === 1}
        className="pagination-arrow"
      >
        <ChevronLeft size={20} />
      </button>
    );

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(start + 2, totalPages);
    if (end - start < 2) start = Math.max(1, end - 2);

    for (let i = start; i <= end; i++) {
      btns.push(
        <button
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    btns.push(
      <button
        key="next"
        onClick={() => setCurrentPage(cp => cp + 1)}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
      >
        <ChevronRight size={20} />
      </button>
    );

    return <div className="pagination">{btns}</div>;
  };

  const getPageTitle = () => {
    if (category) return category.toUpperCase();
    if (gender === 'mulher') return 'MULHER - TODOS OS PRODUTOS';
    if (gender === 'homem') return 'HOMEM - TODOS OS PRODUTOS';
    if (gender === 'beauty') return 'BEAUTY - TODOS OS PRODUTOS';
    return 'TODOS OS PRODUTOS';
  };

  return (
    <div className="products-page">
      <h1 className="page-title">{getPageTitle()}</h1>

      {/* Categories + Filters */}
      <div className="products-view-controls">
        <div className="product-type-filters-inline">
          {productTypes.map(t => (
            <button
              key={t}
              className={activeType === t ? 'active' : ''}
              onClick={() => handleTypeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filter-dropdown">
          <button className="filter-btn" onClick={toggleSidebar}>
            FILTROS
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={sidebarOpen ? 'overlay open' : 'overlay'}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div className={sidebarOpen ? 'filter-sidebar open' : 'filter-sidebar'}>
        <div className="sidebar-header">
          <h3>Filtros</h3>
          <button className="close-btn" onClick={toggleSidebar}>
            ×
          </button>
        </div>

        <div className="filter-section">
          <h4>Cor</h4>
          <div className="color-filters">
            {colors.map(c => (
              <button
                key={c}
                className={`color-filter ${activeColor === c ? 'active' : ''}`}
                onClick={() => handleColorChange(c)}
                style={{ backgroundColor: getColorHex(c) }}
                title={c}
              />
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Tamanho</h4>
          <div className="size-filters">
            {sizes.map(s => (
              <button
                key={s}
                className={`size-filter ${activeSize === s ? 'active' : ''}`}
                onClick={() => handleSizeChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>Preço</h4>
          <div className="price-filters">
            <select
              className="sort-select"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="price-low">Preço: Menor para Maior</option>
              <option value="price-high">Preço: Maior para Menor</option>
            </select>
          </div>
        </div>

        <div className="filter-section">
          <h4>Ordenar</h4>
          <select
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="popularity">Mais Populares</option>
            <option value="rating">Avaliação</option>
          </select>
        </div>

        <button
          className="clear-filters-btn"
          onClick={() => {
            clearFilters();
            setSidebarOpen(false);
          }}
        >
          Limpar Filtros
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Carregando produtos...</div>
      ) : paginated.length === 0 ? (
        <div className="no-products-message">
          Nenhum produto encontrado com os filtros atuais.
          <button
            className="clear-filters-btn-empty"
            onClick={clearFilters}
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {paginated.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}

// Helpers
function filterProductsByGender(products, genderFilter) {
  if (!genderFilter) return products;

  const g = genderFilter.toLowerCase();

  return products.filter(product => product.gender?.toLowerCase() === g);
  
}

function getColorHex(name) {
  const map = {
    black: '#000000', white: '#FFFFFF', red: '#FF0000',
    blue: '#0000FF', green: '#008000', yellow: '#FFFF00',
    purple: '#800080', pink: '#FFC0CB', orange: '#FFA500',
    brown: '#A52A2A', gray: '#808080', grey: '#808080',
    beige: '#F5F5DC', bege: '#F5F5DC', navy: '#000080',
    silver: '#C0C0C0', gold: '#FFD700',
  };
  return map[name.toLowerCase()] || '#CCCCCC';
}
