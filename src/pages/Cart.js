import { useState, useContext, useEffect } from "react";
import { Container } from "react-bootstrap";

import UserContext from "../UserContext";
import "./Cart.css";

export default function Cart() {
  const { cart } = useContext(UserContext);
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
            return <CartCard key={items._id} data={items} />;
          })}
        </div>
        <div className="order-container border col p-0">
          s<div className="order-card">ss</div>
        </div>
      </div>
    </Container>
  );
}

function CartCard({ data }) {
  const { _id, productId, imageUrl, price, createdOn } = data;

  console.log(productId);

  return (
    <div className="cart-card bg-white mb-3 border p-2 ">
      <div className="img-container">
        <img className="" src={data.imageUrl} />
      </div>
      {createdOn}
      <p> {data.productName}</p>
    </div>
  );
}
