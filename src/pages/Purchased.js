import { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

import UserContext from "../UserContext";
import "./Purchased.css";
export default function Purchased() {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const fetchData = await fetch(`${process.env.REACT_APP_API_URL}/orders/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await fetchData.json();
      setItems(data);
    };
    getData();
  }, []);

  if (user.id !== undefined && user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  if (user.id === null && user.isAdmin === null) {
    return <Navigate to="/" />;
  }
  return user.id !== undefined && !user.isAdmin ? (
    <Container className="purchased py-5">
      {items.length !== 0 ? (
        <div>
          {items.map(item => {
            return <ItemCards key={item._id} purchaseDetail={item} />;
          })}
        </div>
      ) : (
        <h2 className="text-white text-center"> No purchased yet! </h2>
      )}
    </Container>
  ) : (
    <Container className="purchased"></Container>
  );
}

function ItemCards({ purchaseDetail }) {
  const { purchasedOn, products, totalAmount } = purchaseDetail;

  const date = new Date(purchasedOn);
  return (
    <Card className="mt-1">
      <Card.Header>{`${date.toDateString()} / ${date.toLocaleTimeString()}`}</Card.Header>
      <Card.Body>
        <ul>
          {products.map(product => {
            return (
              <li key={product._id}>
                <div className="product-details-wrapper ">
                  <Link to={`/product/${product.productId}`}>
                    <img src={product.imageUrl} alt="product" />{" "}
                  </Link>
                  <div className="product-details ms-3">
                    <div className=" ">{product.productName}</div>
                    <div className="product-details-quantity ">
                      <div>
                        {product.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "PHP",
                        })}{" "}
                        x {product.quantity}
                      </div>
                      <div className="text-end ">
                        {product.subTotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "PHP",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </li>
            );
          })}
          <li className="text-end mb-0">
            Purchase Total:{" "}
            <span className="text-danger">
              {totalAmount.toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}
            </span>
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
}
