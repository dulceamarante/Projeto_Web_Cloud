import React from 'react';
import Banner from '../components/homeBeauty/Banner';
import TopProducts from '../components/homeBeauty/TopProducts';
import CategorySection from '../components/homeBeauty/CategorySection';

const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <TopProducts />
    </div>
  );
};

export default HomePage;