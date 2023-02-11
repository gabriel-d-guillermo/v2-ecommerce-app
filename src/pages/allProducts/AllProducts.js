import { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";

import "./AllProducts.css";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewCount, setViewCount] = useState(1);
  const [selectedValue, setSelectedValue] = useState("all");

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const options = [
    { value: "all", label: "All Products" },
    { value: "active", label: "Active Products" },
    { value: "archived", label: "Archived Products" },
  ];

  const handleViewCount = () => {
    setViewCount(viewCount + 1);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchProducts = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const fetchResult = await fetchProducts.json();
        if (fetchResult !== false) {
          setProducts(fetchResult);
        }
      } catch (error) {}
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (selectedValue === "all") {
      setFilteredProducts([...products]);
    }
    if (selectedValue === "active") {
      setFilteredProducts(
        products.filter(product => {
          return product.isActive;
        })
      );
    }
    if (selectedValue === "archived") {
      setFilteredProducts(
        products.filter(product => {
          return !product.isActive;
        })
      );
    }
    setViewCount(1);
  }, [selectedValue, products]);

  return (
    <Container className="all-product">
      <div>
        <SelectDropdown options={options} value={selectedValue} onChange={handleChange} />
      </div>
      <ul className="bg-white">
        {/* {filteredProducts.map(product => {
          return <li key={product._id}>{product.productName}</li>;
        })} */}

        {filteredProducts.slice(0, viewCount).map(product => {
          return <li key={product._id}>{product.productName}</li>;
        })}
      </ul>
      <button onClick={handleViewCount}>view more</button>
    </Container>
  );
}
function SelectDropdown({ options, value, onChange }) {
  return (
    <Form.Select value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Form.Select>
  );
}
