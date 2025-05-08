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
                    Desde o momento em que é concebida até ao momento em que é vestida, cada uma das nossas peças segue este percurso. Poderíamos fazê-lo a um ritmo acelerado, porém, na Mango, escolhemos acompanhar e cuidar de todos aqueles que percorrem este caminho connosco.
                </p>
                <p>
                    Levar o tempo necessário, prestando atenção a cada passo, a cada ponto, a cada prega, a cada acabamento...
                </p>
                <p>
                    A explorar a paisagem e a reunir, cada vez mais, fibras com um reduzido impacto ambiental.
                </p>
                <p>
                    A respirar o estilo inconfundível, perfeito e intemporal com que a natureza desenha cada pormenor e a reduzir as pegadas que a nossa viagem possa deixar no planeta.
                </p>
                <p>
                    Este é o nosso caminho, que vai ganhando forma à medida que o percorremos. E nós acreditamos nele.
                </p>
            </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default ResponsibilityPage;