
import React from 'react';
import { Link } from 'react-router-dom';
import './BannerHomem.css';

const Banner = () => {
  return (
    <section className="main-banner">
      <div className="banner-homem-container">
        <div className="banner-content">
          <Link to="/homem/products">
            <button className="banner-button">TODOS OS PRODUTOS</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;