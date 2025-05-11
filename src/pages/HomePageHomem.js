import React from 'react';
import Banner from '../components/homeHomem/Banner';
import TopProducts from '../components/homeHomem/TopProducts';
import CategorySection from '../components/homeHomem/CategorySection';

const HomePage = () => {
  return (
    <div className="home-page">
      <Banner />
      <CategorySection />
      <TopProducts />
    </div>
  );
};

export default HomePage;