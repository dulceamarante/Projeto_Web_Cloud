import { useParams } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import PackYourBags from '../components/PackYourBags';
import TopProducts from '../components/TopProducts';
import Responsability from '../components/Responsability';



export default function Gender({ gender: propGender }) {
  const params = useParams();
  const gender = propGender || params.gender || 'woman';

  return (
    <>
      <HeroSlider />
      <PackYourBags gender={gender} />
      <TopProducts gender={gender} />
      <Responsibility />
    </>
  );
}
