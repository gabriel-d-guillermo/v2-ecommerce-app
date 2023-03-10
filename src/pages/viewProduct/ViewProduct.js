import { useEffect, useState, useContext, useRef } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";

import Swal from "sweetalert2";
import "./ViewProduct.css";
export default function ViewProduct() {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const { id } = useParams();
  const { user, getCart } = useContext(UserContext);

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
    if (user.id === null && user.isAdmin === null) {
      Swal.fire({
        position: "top",
        icon: "warning",
        title: "Your Action Cannot Be Processed ",
        text: "You are not currently logged in",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "login",
      }).then(result => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

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
          productName: productDetails.productName,
          quantity: quantity,
          price: price,
          imageUrl: productDetails.imageUrl,
        }),
      });
      const post = await addToCart.json();
      if (post) {
        getCart(user.id);
        Swal.fire({
          position: "top",
          icon: "success",
          text: "Product has been added to your cart",
          showConfirmButton: false,
          timer: 1500,
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
          setCurrentQuantity(data.quantity);
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
          <Row className=" m-0 ">
            <Col className="img-wrapper col-12 col-sm-6">
              <div className=" img-container">
                <img className="card-img" src={productDetails.imageUrl} alt="product" />
              </div>
            </Col>
            <Col className="details-wrapper bg-light col-12 col-sm-6">
              <form onSubmit={e => handleForm(e)}>
                <h5 className="mt-4">{productDetails.productName}</h5>
                <p className="description mt-3">{productDetails.description}</p>
                <p>
                  Product price:{" "}
                  {price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </p>
                <p>Product Available : {currentQuantity}</p>
                {currentQuantity > 0 ? (
                  <div>
                    <small>Quantity:</small>
                    <br />
                    <div className="btn-group mb-3">
                      <Button
                        className={`btn btn-dark btn-sm ${quantity === 1 ? "disabled" : ""}`}
                        onClick={handleDecrement}
                      >
                        -
                      </Button>
                      <button type="button" className="btn btn-sm px-3 mx-2">
                        {quantity}
                      </button>

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
                    </div>
                  </div>
                ) : (
                  <p className="text-danger fs-4 mt-5 text-center">This Product Is Currently Not Available</p>
                )}
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
