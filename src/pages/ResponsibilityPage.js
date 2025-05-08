import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './ResponsibilityPage.css';

const ResponsibilityPage = () => {
    return (
      <div className="responsibility-page">
        <Header />
        <div class="banner">
                <img src="/assets/images/Banners/banner_responsibility.png" alt="Banner de Responsabilidade" />
        </div>
        <div class="container">
            <div class="title">
                <h1>O NOSSO SENTIDO DE RESPONSABILIDADE</h1>
            </div>
            <div class="content">
                <p>
                    Desde o momento da sua criação até ao momento em que é vestida, cada uma das nossas peças segue um processo único. Poderíamos fazê-lo mais rapidamente, mas na BDRP optamos por um caminho mais cuidadoso, onde acompanhamos de perto cada etapa, garantindo a qualidade e atenção a todos os detalhes.
                </p>
                <p>
                    Dedicamo-nos a cada ponto, cada prega, cada acabamento, com tempo e precisão.
                </p>
                <p>
                    Apostamos na exploração de materiais que, além de exclusivos, têm um impacto ambiental reduzido, porque acreditamos que moda e sustentabilidade podem andar de mãos dadas.
                </p>
                <p>
                    O nosso estilo é inspirado na natureza, com uma elegância intemporal que nunca sai de moda, enquanto trabalhamos para deixar a menor pegada possível no nosso planeta.
                </p>
                <p>
                    Este é o nosso compromisso, o caminho que seguimos com paixão e convicção. E temos a certeza de que é o melhor caminho.
                </p>
            </div>
        </div>
            <div class="title2">
                    <h1>OS NOSSOS MATERIAIS</h1>
            </div>
      </div>
    );
  };
  
  export default ResponsibilityPage;