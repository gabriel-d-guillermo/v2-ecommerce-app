import { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

import "./ViewProduct.css";
export default function ViewProduct() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [number, setNumber] = useState(1);
  const amount = productDetails.price * number;

  const handleDecrement = () => {
    if (number > 1) {
      setNumber(number - 1);
      setCurrentQuantity(currentQuantity + 1);
    }
  };
  const handleIncrement = () => {
    if (currentQuantity > 0) {
      setNumber(number + 1);
      setCurrentQuantity(currentQuantity - 1);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const product = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
        const data = await product.json();
        setProductDetails(data);
        setCurrentQuantity(data.quantity - 1);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);
  return (
    <Container className="view-product">
      <Card className="h-100">
        <Row className=" m-0">
          <Col className="img-wrapper">
            <div className=" img-container">
              <img className="card-img" src={productDetails.imageUrl} alt="product" />
            </div>
          </Col>
          <Col className="details-wrapper bg-light">
            <h4 className="mt-5">{productDetails.productName}</h4>
            <p className=" border p-3">{productDetails.description}</p>
            <p>Product price: ₱{productDetails.price}</p>
            <p>Product Available : {currentQuantity}</p>
            <p></p>
            <small>Quantity:</small>
            <br />
            <div className="btn-group">
              <button className={`btn btn-primary ${number === 1 ? "disabled" : ""}`} onClick={handleDecrement}>
                -
              </button>
              <button className="btn bg-white">{number}</button>
              <button
                className={`btn btn-primary ${currentQuantity === 0 ? "disabled" : ""}`}
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
            <p>Amount ₱{amount} </p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
