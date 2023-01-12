import { Row, Col, Card } from "react-bootstrap";
import { Container } from "react-bootstrap";
import "./Banner.css";
export default function Banner() {
  return (
    <Container fluid className="background-container p-2 d-flex justify-content-center align-items-center">
      <div className="">
        <div className="banner mx-auto my-2  p-3 ">
          <h2>Welcome to my E-commerce Website</h2>
          <p className="word-wrap">
            This is a Capstone project for Zuitt Coding Bootcamp. An E-commerce Website using MERN stack
          </p>
          MVP (minimum viable product)
          <ul>
            <li>User registration</li>
            <li>User authentication</li>
            <li>Create Product (Admin only)</li>
            <li>Retrieve all active products</li>
            <li>Retrieve single product</li>
            <li>Update Product information (Admin only)</li>
            <li>Archive Product (Admin only)</li>
            <li>Non-admin User checkout (Create Order)</li>
            <li>Retrieve User Details</li>
            <li>
              Add to Cart
              <ul>
                <li> Added Products</li>
                <li>Change product quantities</li>
                <li>Remove products from cart</li>
                <li>Subtotal for each item</li>
                <li>Total price for all items</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
