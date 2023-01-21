import { useEffect, useState, useContext, useRef } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";

import Swal from "sweetalert2";
import "./ViewProduct.css";
export default function ViewProduct() {
  const topRef = useRef(null);
  const { id } = useParams();
  const { user, cartCount, setCartCount, getCart } = useContext(UserContext);

  const [productDetails, setProductDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);

  const amount = price * quantity;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleIncrement = () => {
    if (quantity < currentQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleForm = async e => {
    e.preventDefault();

    try {
      const addToCart = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: id,
          quantity: quantity,
          subTotal: quantity * price,
        }),
      });
      const post = await addToCart.json();
      if (post) {
        getCart(user.id);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Product has been added to your cart",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    topRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    const getProduct = async () => {
      try {
        const product = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`);
        const data = await product.json();
        if (data.name === "CastError") {
          setError(true);
        } else {
          setProductDetails(data);
          setCurrentQuantity(data.quantity - 1);
          setPrice(data.price);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  return (
    <Container ref={topRef} fluid="md" className="view-product ">
      {productDetails !== null ? (
        <Card className="">
          <Row className=" m-0">
            <Col className="img-wrapper">
              <div className=" img-container">
                <img className="card-img" src={productDetails.imageUrl} alt="product" />
              </div>
            </Col>
            <Col className="details-wrapper bg-light">
              <form onSubmit={e => handleForm(e)}>
                <h5 className="mt-4">{productDetails.productName}</h5>
                <p className="description mt-3">{productDetails.description}</p>
                <p>
                  Product price:{" "}
                  {price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}{" "}
                </p>
                <p>Product Available : {currentQuantity}</p>
                <p></p>
                <small>Quantity:</small>
                <br />
                <div className="btn-group mb-3">
                  <Button
                    className={`btn btn-dark btn-sm ${quantity === 1 ? "disabled" : ""}`}
                    onClick={handleDecrement}
                  >
                    -
                  </Button>
                  <button className="btn btn-sm disabled px-3 mx-2">{quantity}</button>

                  <Button
                    className={`btn btn-dark btn-sm ${quantity === currentQuantity ? "disabled" : ""}`}
                    onClick={handleIncrement}
                  >
                    +
                  </Button>
                </div>
                <p>
                  Amount:{" "}
                  {amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}{" "}
                </p>
                <div>
                  <Button type="submit" variant="outline-dark my-3" className="form-control">
                    Add to Cart
                  </Button>
                  {/* <button className="form-control"></button> */}
                </div>
              </form>
            </Col>
          </Row>
        </Card>
      ) : (
        error && (
          <div>
            <h3 className="mt-5 text-white text-center">No Data Available</h3>
          </div>
        )
      )}
    </Container>
  );
}
