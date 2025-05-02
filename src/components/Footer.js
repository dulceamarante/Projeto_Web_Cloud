import React from 'react';

function Footer() {
  return (
    <footer className="bg3 p-t-75 p-b-32">
      <div className="container">
        <div className="row">
          {/* Categorias */}
          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30"> Categorias </h4>
            <ul>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Mulheres </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Homens </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Calçado </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Acessórios </a></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30"> Ajuda </h4>
            <ul>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Encomendas </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Devoluções </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> Envio </a></li>
              <li className="p-b-10"><a href="#" className="stext-107 cl7 hov-cl1 trans-04"> FAQs </a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30"> Contacto </h4>
            <p className="stext-107 cl7 size-201"> Alguma dúvida? Contacta-nos através do nosso chat ou e-mail: suporte@cozastore.com </p>
            <div className="p-t-27">
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16"><i className="fa fa-facebook"></i></a>
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16"><i className="fa fa-instagram"></i></a>
              <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16"><i className="fa fa-pinterest-p"></i></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-sm-6 col-lg-3 p-b-50">
            <h4 className="stext-301 cl0 p-b-30"> Newsletter </h4>
            <form>
              <div className="wrap-input1 w-full p-b-4">
                <input className="input1 bg-none plh1 stext-107 cl7" type="text" name="email" placeholder="email@exemplo.com" />
                <div className="focus-input1 trans-04"></div>
              </div>
              <div className="p-t-18">
                <button className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn1 p-lr-15 trans-04"> Subscrever </button>
              </div>
            </form>
          </div>
        </div>

        {/* Créditos finais */}
        <div className="p-t-40">
          <p className="stext-107 cl6 txt-center">
            &copy; {new Date().getFullYear()} Cozastore | Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
