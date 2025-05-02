import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

function Cart() {
  const { cart, removeFromCart } = useContext(GlobalContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container p-t-100 p-b-100">
        <h2 className="ltext-105 cl5 txt-center">O carrinho está vazio.</h2>
      </div>
    );
  }

  return (
    <div className="container p-t-75 p-b-120">
      <h2 className="ltext-105 cl5 p-b-30">Carrinho de Compras</h2>

      {cart.map(item => (
        <div key={item.id} className="p-b-40 border-bottom">
          <div className="row align-items-center">
            <div className="col-3">
              <img src={item.image} alt={item.title} className="img-fluid" />
            </div>
            <div className="col-6">
              <h5 className="mtext-110">{item.title}</h5>
              <p className="stext-102">Preço unitário: €{item.price.toFixed(2)}</p>
              <p className="stext-102">Quantidade: {item.quantity}</p>
              <p className="stext-102">Subtotal: €{(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div className="col-3 text-end">
              <button onClick={() => removeFromCart(item.id)} className="flex-c-m stext-101 cl0 size-102 bg3 bor1 hov-btn3 p-lr-15 trans-04">
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="p-t-40 text-end">
        <h4 className="mtext-109">Total: €{total.toFixed(2)}</h4>
      </div>
    </div>
  );
}

export default Cart;

