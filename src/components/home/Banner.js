
import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <section className="main-banner">
      <div className="banner-container">
        <div className="banner-content">
          <Link to="/mulher/products">
            <button className="banner-button">TODOS OS PRODUTOS</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;