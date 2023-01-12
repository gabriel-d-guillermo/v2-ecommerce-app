import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import "../components/ProductCard.css";
export default function ProductById() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function getProducts() {
      try {
        const product = await fetch(`${process.env.REACT_APP_API_URL}/products/viewProducts`, {
          signal: controller.signal,
        });
        const productData = await product.json();
        console.log(productData);
        setProducts(productData);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("wew");
          console.warn("Request was cancelled");
        } else {
          console.error(error);
        }
      }
    }
    getProducts();
    return () => controller.abort();
  }, []);

  return (
    <Container fluid="md" className="product ">
      <Row className="">
        {products.map((product, index) => {
          return <ProductCard key={index} prop={product} />;
        })}
      </Row>
    </Container>
  );
}
