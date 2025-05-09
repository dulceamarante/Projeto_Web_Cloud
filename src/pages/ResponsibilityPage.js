import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import './ResponsibilityPage.css';


const ResponsibilityPage = () => {

    useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

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
            <div class="container2">
                <div class="title2">
                    <h1>OS NOSSOS MATERIAIS</h1>
                </div>
                <div class="materials">
                    <div class="material">
                        <img src="/assets/images/materiais/algodao_reciclado.png" alt="Poliéster Reciclado" />
                        <p>Poliéster Reciclado</p>
                    </div>
                    <div class="material">
                        <img src="/assets/images/materiais/algodao_regenerativo.png" alt="Algodão Regerativo"/>
                        <p>Algodão regenerativo</p>
                    </div>
                    <div class="material">
                        <img src="/assets/images/materiais/algodao_bci.png" alt="Algodão BCI"/>
                        <p>Algodão BCI</p>
                    </div>
                    <div class="material">
                        <img src="/assets/images/materiais/algodao_organico.png" alt="Algodão Orgânico" />
                        <p>Algodão orgânico</p>
                    </div>
                </div>
            </div>
            <div class="container">
            <div class="title">
                <h1>RECICLAGEM</h1>
            </div>
            <div class="content">
                <p>
                    Em alinhamento com os Objetivos de Desenvolvimento Sustentável das Nações Unidas, a BDRP disponibiliza aos seus clientes a oportunidade de darem uma nova vida à roupa e calçado usados, através das nossas Recycling Boxes.
                </p>
                <p>
                    Todos os artigos depositados nestes contentores serão encaminhados para um novo destino, respeitando a hierarquia de gestão de resíduos:
                </p>
                <p>
                    <h3>Reutilização</h3>
                     As peças em bom estado são encaminhadas para o mercado de segunda mão.
                </p>
                <p>
                     <h3>Reciclagem</h3>
                     As peças mais danificadas são convertidas em fibras têxteis ou em matérias-primas para outros usos, como isolamento térmico, entre outros.
                </p>
                <p>
                     <h3>Valorização energética</h3>
                    Os materiais que já não podem ser reciclados são transformados em energia (electricidade ou vapor) através de um processo de combustão controlada.
                </p>
            </div>
        </div>
        </div>
    );
  };
  
  export default ResponsibilityPage;