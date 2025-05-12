import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose, initialCategory, onCategoryChange }) => {
  // Estado para controlar a categoria ativa (ex: mulher, homem, beauty)
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  // Estado para controlar a animação do submenu (entrada/saída)
  const [subMenuAnimation, setSubMenuAnimation] = useState('');
  // Estado para controlar a animação do menu principal
  const [menuAnimation, setMenuAnimation] = useState('');
  // Referência ao menu para possíveis interações futuras (não utilizada aqui)
  const menuRef = useRef(null);

  // Efeito que corre sempre que o menu é aberto
  useEffect(() => {
    if (isOpen) {
      // Define a categoria ativa com base na categoria inicial recebida por props
      setActiveCategory(initialCategory);

      // Usa requestAnimationFrame para garantir que as classes de animação são aplicadas depois do DOM estar atualizado
      requestAnimationFrame(() => {
        setSubMenuAnimation('slide-in'); // ativa a animação do submenu
        setMenuAnimation('slide-in');    // ativa a animação do menu
      });
    }
  }, [isOpen, initialCategory]);

  // Função para fechar o menu com animação
  const handleClose = () => {
    setMenuAnimation('slide-out'); // ativa a animação de saída do menu
    setSubMenuAnimation('slide-out'); // ativa a animação de saída do submenu

    // Aguarda o fim da animação (800ms) antes de efetivamente fechar o menu
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // Fecha o menu quando o rato sai da área do menu (só em desktop)
  const handleMouseLeave = () => {
    handleClose();
  };

  // Troca a categoria ativa e anima a transição entre subcategorias
  const toggleSubcategory = category => {
    if (activeCategory === category) return; // evita repetir a categoria ativa

    // Notifica o componente pai, se for fornecida uma função para tal
    if (onCategoryChange) {
      onCategoryChange(category);
    }

    // Anima a saída da subcategoria atual
    setSubMenuAnimation('slide-out');
    // Após a animação de saída, muda a categoria e anima a entrada
    setTimeout(() => {
      setActiveCategory(category);
      setSubMenuAnimation('slide-in');
    }, 800);
  };

  // Estrutura de dados com as subcategorias de cada categoria principal
  const categories = {
    mulher: [
      { name: 'TODOS OS ARTIGOS', path: '/mulher/products' },
      { name: 'CAMISAS', path: '/mulher/camisas' },
      { name: 'T-SHIRTS', path: '/mulher/tshirt' },
      { name: 'JEANS', path: '/mulher/jeans' },
      { name: 'CALÇAS', path: '/mulher/calcas' },
      { name: 'CASACOS', path: '/mulher/casacos' },
      { name: 'VESTIDOS', path: '/mulher/vestidos' },
      { name: 'SAIAS', path: '/mulher/saias' }
    ],
    homem: [
      { name: 'TODOS OS ARTIGOS', path: '/homem/products' },
      { name: 'CAMISAS', path: '/homem/camisas' },
      { name: 'T-SHIRTS', path: '/homem/tshirt' },
      { name: 'JEANS', path: '/homem/jeans' },
      { name: 'CALÇAS', path: '/homem/calcas' },
      { name: 'CASACOS', path: '/homem/casacos' }
    ],
    beauty: [
      { name: 'TODOS OS ARTIGOS', path: '/beauty/products' },
      { name: 'MAKEUP', path: '/beauty/makeup' },
      { name: 'PERFUMES', path: '/beauty/perfumes' },
      { name: 'SKINCARE', path: '/beauty/skincare' }
    ]
  };

  // Se o menu não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div 
      className="side-menu-wrapper" 
      onMouseLeave={handleMouseLeave} // Fecha menu ao sair com o rato
      ref={menuRef}
    >
      <div className={`side-menu ${menuAnimation}`}>
        {/* Barra de navegação do topo com as categorias principais */}
        <div className="nav-top-bar">
          <span 
            className={activeCategory === 'mulher' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('mulher')}
          >
            MULHER
          </span>
          <span 
            className={activeCategory === 'homem' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('homem')}
          >
            HOMEM
          </span>
          <span 
            className={activeCategory === 'beauty' ? 'nav-item active' : 'nav-item'} 
            onClick={() => toggleSubcategory('beauty')}
          >
            BEAUTY
          </span>
        </div>
        
        {/* Conteúdo do menu com as subcategorias */}
        <div className="side-menu-content">
          <div className={`subcategories-container ${subMenuAnimation}`}>
            <ul className="category-list">
              {/* Lista de links das subcategorias da categoria ativa */}
              {categories[activeCategory].map((sub, i) => (
                <li key={i}>
                  <Link to={sub.path} onClick={handleClose}>
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay escurecido por trás do menu */}
      <div 
        className={`side-menu-overlay ${menuAnimation === 'slide-out' ? 'fade-out' : 'fade-in'}`} 
        onClick={handleClose} 
      />
    </div>
  );
};

export default SideMenu;
