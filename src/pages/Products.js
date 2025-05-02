import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import products from '../data/products';
import { Link } from 'react-router-dom';

function Products() {
  const { addToCart, addToFavorites, cart, favorites } = useContext(GlobalContext);

  useEffect(() => {
    console.log('🛒 Carrinho:', cart);
    console.log('❤️ Favoritos:', favorites);
  }, [cart, favorites]);

  return (
    <div className="bg0 p-t-75 p-b-120">
      <div className="container">
        <div className="p-b-20">
          <h2 className="ltext-103 cl5">Todos os Produtos</h2>
        </div>

        <div className="row isotope-grid">
          {products.map(product => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
              <div className="block2">
                <div className="block2-pic hov-img0">
                  <img src={product.image} alt={product.title} />
                  <Link
                    to={`/produto/${product.id}`}
                    className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
                  >
                    Ver Detalhes
                  </Link>
                </div>

                <div className="block2-txt flex-w flex-t p-t-14">
                  <div className="block2-txt-child1 flex-col-l">
                    <Link
                      to={`/produto/${product.id}`}
                      className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                    >
                      {product.title}
                    </Link>
                    <span className="stext-105 cl3">€{product.price.toFixed(2)}</span>
                    <span className="stext-105 cl3">⭐ {product.rating}</span>
                  </div>

                  <div className="block2-txt-child2 flex-r p-t-3">
                    <button
                      onClick={() => {
                        console.log('❤️ Adicionar aos favoritos:', product);
                        addToFavorites(product);
                      }}
                      className="btn-addwish-b2 dis-block pos-relative"
                      title="Favoritar"
                    >
                      <i className="zmdi zmdi-favorite-outline"></i>
                    </button>

                    <button
                      onClick={() => {
                        console.log('🛒 Adicionar ao carrinho:', product);
                        addToCart(product);
                      }}
                      className="btn-addcart-b2 dis-block pos-relative p-l-10"
                      title="Carrinho"
                    >
                      <i className="zmdi zmdi-shopping-cart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
