import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../UserContext";
import CartCard from "../components/CartCard";
import "./Cart.css";

export default function Cart() {
  if (localStorage.getItem("Orders") === null) {
    localStorage.setItem("Orders", "[]");
  }
  const { cart, user } = useContext(UserContext);
  // const [product, setProduct] = useState({});
  // const [price, setPrice] = useState(0);
  const [orders, setOrders] = useState(localStorage.getItem("Orders"));

  const addItem = newItem => {
    const items = JSON.parse(localStorage.getItem("Orders"));

    if (items !== null) {
      items.push(newItem);
      localStorage.setItem("Orders", JSON.stringify(items));
    } else {
      localStorage.setItem("Orders", JSON.stringify(newItem));
    }
    setOrders(localStorage.getItem("Orders"));
  };

  const removeItem = itemId => {
    const items = JSON.parse(localStorage.getItem("Orders"));

    const newItem = items.filter(item => {
      return item.id !== itemId;
    });
    localStorage.setItem("Orders", JSON.stringify(newItem));
    setOrders(localStorage.getItem("Orders"));
  };

  return (
    <Container className="cart pb-5">
      <div className="cart-wrapper row mt-5 ">
        <div className="card-container col p-0 mb-2">
          {cart.map(items => {
            return (
              <CartCard key={items._id} cartId={items._id} user={user.id} addItem={addItem} removeItem={removeItem} />
            );
          })}
        </div>
        {/* <div className="order-container"> */}
        <div className="order-card ">
          <Orders data={orders} />
        </div>
        {/* </div> */}
      </div>
    </Container>
  );
}
function Orders({ data }) {
  const items = JSON.parse(data);

  const multiply = items.map(item => {
    return item.quantity * item.price;
  });

  const sum = multiply.reduce((acc, curr) => acc + curr, 0);

  return <div>{sum}</div>;
}
