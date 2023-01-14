import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";
import "../components/ProductCard.css";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    async function getProducts() {
      try {
        const product = await fetch(`${process.env.REACT_APP_API_URL}/products/viewProducts`, {
          signal: controller.signal,
        });
        const productData = await product.json();
        console.log(productData);
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("Request was cancelled");
        } else {
          Swal.fire({
            icon: "error",
            text: "Something went wrong!!",
            color: "#f27474",
            width: "25rem",
          });
          console.error(error);
          setLoading(false);
        }
      }
    }
    getProducts();
    return () => controller.abort();
  }, []);
  // if (loading) {
  //   return (
  //     <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //   );
  // }
  return (
    <Container fluid="md" className="product ">
      {loading ? (
        <div className="spinner-border" style={{ width: "5rem", height: "5rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <Row className="">
          {products.map((product, index) => {
            return <ProductCard key={index} prop={product} />;
          })}
        </Row>
      )}
    </Container>
  );
}
