import { useState, useEffect, useRef } from "react";

import { Container, Row, Button } from "react-bootstrap";
import Swal from "sweetalert2";
// import UserContext from "../UserContext";
import ProductCard from "../components/ProductCard";

import "./Product.css";

export default function Product() {
  // const { user } = useContext(UserContext);
  const topRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterItems, setFilterItems] = useState([]);
  const [viewCount, setViewCount] = useState(10);

  //get all products
  useEffect(() => {
    // topRef.current.scrollIntoView({ behavior: "smooth", inline: "start" });
    // topRef.current.scrollBy({
    //   top: -900,
    //   left: 100,
    //   behavior: "smooth",
    // });
    const controller = new AbortController();
    setLoading(true);
    async function getProducts() {
      try {
        const getProducts = await fetch(`${process.env.REACT_APP_API_URL}/products/viewProducts`, {
          signal: controller.signal,
        });
        const fetchedData = await getProducts.json();
        setProducts(fetchedData);
        setFilterItems(fetchedData);
        setLoading(false);
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("Request was cancelled");
        } else {
          Swal.fire({
            icon: "error",
            text: "Oop!, Something went wrong",
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

  //search/filter products
  const handleFilter = str => {
    let strTrim = str.trim();
    if (strTrim.length > 3) {
      const lowerStr = str.toLowerCase();
      const result = products.filter(product => {
        return product.productName.toLowerCase().match(lowerStr) || product.description.toLowerCase().match(lowerStr);
      });
      if (result.length > 0) {
        setFilterItems([...result]);
      }
      return;
    }
    setFilterItems(products);
  };

  return (
    <Container ref={topRef} fluid="md" className="product">
      {loading ? (
        <div className="loading">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>Loading . . . </div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="" style={{ height: "4rem" }}>
            <input
              type="search"
              className="form-control mx-auto w-50 search"
              onChange={e => {
                handleFilter(e.target.value);
              }}
              placeholder="Search . . ."
              style={{ minWidth: "20rem" }}
            ></input>
          </div>
          <Row className="">
            {filterItems.slice(0, viewCount).map((product, index) => {
              return <ProductCard key={index} prop={product} />;
            })}
          </Row>
          {/* show view more button if the length of products is greater than the viewCount Value */}
          {filterItems.length > viewCount && (
            <div className="text-center my-5">
              <Button variant="outline-light" onClick={() => setViewCount(viewCount + 10)}>
                View More <i className="fa-solid fa-arrow-down"></i> {}
              </Button>
            </div>
          )}
        </>
      ) : (
        <h2 className="mt-5 text-center text-white">No Data Available</h2>
      )}
    </Container>
  );
}
