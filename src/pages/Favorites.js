import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

function Favorites() {
  const { favorites, removeFromFavorites } = useContext(GlobalContext);

  if (favorites.length === 0) {
    return (
      <div className="container p-t-100 p-b-100">
        <h2 className="ltext-105 cl5 txt-center">Não tens produtos favoritos ainda.</h2>
      </div>
    );
  }

  return (
    <div className="container p-t-75 p-b-120">
      <h2 className="ltext-105 cl5 p-b-30">Os Meus Favoritos</h2>

      <div className="row">
        {favorites.map(product => (
          <div key={product.id} className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
            <div className="block2">
              <div className="block2-pic hov-img0">
                <img src={product.image} alt={product.title} />
                <a href={`/produto/${product.id}`} className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04">
                  Ver Detalhes
                </a>
              </div>
              <div className="block2-txt flex-w flex-t p-t-14">
                <div className="block2-txt-child1 flex-col-l">
                  <a href={`/produto/${product.id}`} className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                    {product.title}
                  </a>
                  <span className="stext-105 cl3">€{product.price.toFixed(2)}</span>
                </div>
                <div className="block2-txt-child2 flex-r p-t-3">
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="btn-addwish-b2 dis-block pos-relative"
                    title="Remover dos Favoritos"
                  >
                    <i className="zmdi zmdi-close"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
