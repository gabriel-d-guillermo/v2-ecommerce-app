import { useState, useEffect, useContext } from "react";
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
      console.log(data);
    };
    getData();
  }, []);

  return (
    <Container className="purchased border pt-5">
      {items.length !== 0 ? (
        <div>
          {items.map(item => {
            return <ItemCards key={item._id} purchaseDetail={item} />;
          })}
        </div>
      ) : (
        "Zero purchase"
      )}
    </Container>
  );
}

function ItemCards({ purchaseDetail }) {
  const { purchasedOn, products } = purchaseDetail;
  return (
    <Card>
      <Card.Header>{purchasedOn}</Card.Header>
      <Card.Body>
        <ul>
          {products.map(product => {
            return <li key={product._id}>{product.productName}</li>;
          })}
        </ul>
      </Card.Body>
    </Card>
  );
}
