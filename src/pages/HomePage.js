import React from 'react';
import Banner from '../components/home/Banner';
import TopProducts from '../components/home/TopProducts';
import CategorySection from '../components/home/CategorySection';

const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <TopProducts />
      <CategorySection />
    </div>
  );
};

export default HomePage;