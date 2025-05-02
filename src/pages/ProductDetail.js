import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <h2 style={{ padding: '2rem' }}>Produto não encontrado.</h2>;
  }

  return (
    <div className="bg0 p-t-75 p-b-120">
      <div className="container">
        <div className="row">
          {/* Imagem do produto */}
          <div className="col-md-6 col-lg-6 p-b-30">
            <div className="p-l-25 p-r-30 p-lr-0-lg">
              <div className="wrap-pic-w pos-relative">
                <img src={product.image} alt={product.title} />
              </div>
            </div>
          </div>

          {/* Info do produto */}
          <div className="col-md-6 col-lg-6 p-b-30">
            <div className="p-r-50 p-t-5 p-lr-0-lg">
              <h4 className="mtext-105 cl2 js-name-detail p-b-14">{product.title}</h4>
              <span className="mtext-106 cl2">€{product.price.toFixed(2)}</span>

              <p className="stext-102 cl3 p-t-23">
                Este é um produto fictício usado apenas para demonstração visual. Aqui iriam os detalhes do produto real.
              </p>

              <div className="p-t-33">
                <div className="flex-w flex-r-m p-b-10">
                  <div className="size-204 flex-w flex-m respon6-next">
                    <button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-t-40">
                <span className="stext-102 cl3">Rating: {product.rating} ★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
