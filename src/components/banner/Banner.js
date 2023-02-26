import { Container } from "react-bootstrap";
import "./Banner.css";
export default function Banner() {
  return (
    <Container className="background-container p-2 d-flex justify-content-center align-items-center">
      <div className="mt-3">
        <div className="banner mx-auto">
          <div className="title">
            {/* <h3>Welcome to my E-commerce Website</h3> */}
            <p className="word-wrap">
              This is a Capstone project for Zuitt Coding Bootcamp. An E-commerce Website using MERN stack
            </p>
          </div>
          <div className="mvp-wrapper">
            <div className="mvp-header"> MVP (minimum viable product)</div>
            <div className="mvp-body">
              <div className="user">
                <h5> Users</h5>
                <ul>
                  <li>User registration</li>
                  <li>User authentication</li>
                  <li>Retrieve User Details</li>
                  <li>Retrieve all active products</li>
                  <li>Retrieve single product</li>
                  <li>User checkout (Create Order)</li>
                  <li>
                    <h6> Add to Cart</h6>
                    <ul>
                      <li> Add Products to cart</li>
                      <li>Change product quantities</li>
                      <li>Remove products from cart</li>
                      <li>Subtotal for each item</li>
                      <li>Total price for all items</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="admin ">
                <h5> Admin</h5>
                <ul>
                  <li>Create Products</li>
                  <li>Update Products information</li>
                  <li>Retrieve All Products</li>
                  <li>Archive/Unarchive Products</li>
                  <li>Retrieve All Users Details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
