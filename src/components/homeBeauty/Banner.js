// src/components/home/Banner.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BannerBeauty.css';

const Banner = () => {
  return (
    <section className="main-banner">
      <div className="banner-beauty-container">
        <div className="banner-content">
          <Link to="/beauty/products">
            <button className="banner-button">TODOS OS PRODUTOS</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;