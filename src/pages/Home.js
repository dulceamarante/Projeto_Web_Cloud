import React, { useContext } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

import slide01 from '../assets/images/slide-01.jpg';  // Certifique-se de que as imagens estão na pasta certa
import slide02 from '../assets/images/slide-02.jpg';
import slide03 from '../assets/images/slide-03.jpg';
import { GlobalContext } from '../context/GlobalContext';

function Home() {
  const { addToCart, addToFavorites } = useContext(GlobalContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000
  };

  return (
    <div className="container">
      {/* Slider */}
      <section className="slide1">
        <div className="wrap-slick1">
          <Slider {...settings}>
            <div className="item-slick1" style={{ backgroundImage: `url(${slide01})` }}>
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div className="layer-slick1 animated visible-false" data-appear="fadeInDown" data-delay="0">
                    <span className="ltext-101 cl2 respon2">Coleção de Verão 2025</span>
                  </div>
                  <div className="layer-slick1 animated visible-false" data-appear="fadeInUp" data-delay="800">
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">Nova Chegada</h2>
                  </div>
                  <div className="layer-slick1 animated visible-false" data-appear="zoomIn" data-delay="1600">
                    <Link to="/produtos" className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04">Ver Produtos</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-slick1" style={{ backgroundImage: `url(${slide02})` }}>
              {/* Conteúdo do segundo slide */}
            </div>
            <div className="item-slick1" style={{ backgroundImage: `url(${slide03})` }}>
              {/* Conteúdo do terceiro slide */}
            </div>
          </Slider>
        </div>
      </section>

      {/* Top Produtos */}
      <section className="bg0 p-t-23 p-b-140">
        <div className="container">
          <div className="p-b-10">
            <h3 className="ltext-103 cl5">Top Produtos</h3>
          </div>
          <div className="row isotope-grid">
            {/* Renderizar os produtos aqui */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
