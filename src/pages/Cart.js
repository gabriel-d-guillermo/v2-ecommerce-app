import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../UserContext";
import CartCard from "../components/CartCard";
import "./Cart.css";

export default function Cart() {
  const { cart, user } = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [price, setPrice] = useState(0);
  // console.log(cart);
  // useEffect(() => {
  //   const getProduct = async () => {
  //     try {
  //       const product  = cart,
  //       // const product = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
  //       // const data = await product.json();
  //       // // console.log(data);
  //       // setProduct(data);
  //       // setPrice(data.price);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getProduct();
  // }, [cart]);

  return (
    <Container className="cart p-0">
      <div className="cart-wrapper row mt-5">
        <div className="card-container border col p-0">
          {cart.map(items => {
            return <CartCard key={items._id} cartId={items._id} user={user.id} />;
          })}
        </div>
        <div className="order-container border col p-0">
          s<div className="order-card">ss</div>
        </div>
      </div>
    </Container>
  );
}
