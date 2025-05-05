import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <section className="main-banner">
      <div className="banner-container">
        <img 
          src="/assets/images/banner/main-banner.jpg" 
          alt="Nova Coleção" 
          className="banner-image"
        />
        <div className="banner-content">
          <button className="banner-button">New in</button>
        </div>
      </div>
    </section>
  );
};

export default Banner;