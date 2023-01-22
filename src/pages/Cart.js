import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";

import UserContext from "../UserContext";
import "./Cart.css";

export default function Cart() {
  const { cart } = useContext(UserContext);

  return (
    <Container className="cart border">
      <div className="cart-wrapper">
        {cart.map(items => {
          return <CartCard key={items._id} id={items.productId} />;
        })}
      </div>
    </Container>
  );
}

function CartCard({ id }) {
  // const { _id, productId } = data;

  const [price, setPrice] = useState(0);
  // console.log(productId);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const product = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
        const data = await product.json();
        console.log(data);
        setPrice(data.price);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  return (
    <div className="cart-card">
      <img />
      {price}ss
    </div>
  );
}
