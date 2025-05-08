import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';


const Banner = () => {
  return (
    <section className="main-banner">
      <div className="banner-container">
        <div className="banner-content">
          <button className="banner-button">NOVA COLEÇÃO</button>
        </div>
      </div>
    </section>
  );
};

export default Banner;