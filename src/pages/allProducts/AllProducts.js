import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";

import "./AllProducts.css";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState("all");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [data, setData] = useState({});
  const searchTerm = useRef("");
  const options = [
    { value: "all", label: "All Products" },
    { value: "active", label: "Active Products" },
    { value: "archived", label: "Archived Products" },
  ];
  let filter = null;
  const handleShowEdit = data => {
    setShowEdit(true);
    setData(data);
  };
  const handleEditClose = () => {
    setShowEdit(false);
  };
  const handleSelectedValue = event => {
    setSelectedValue(event.target.value);
  };

  const handleViewCount = () => {
    setViewCount(viewCount + 10);
  };

  //when mount
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
    console.log("mount");
  }, []);

  //get data
  useEffect(() => {
    if (selectedValue === "all") {
      setFilteredProducts(products);
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

    setViewCount(10);
  }, [selectedValue, products]);

  //search/filter product
  useEffect(() => {
    const trimSearch = search.trim();
    if (trimSearch === "") {
      setSearchResult([]);
      return;
    }

    let filter = null;

    if (trimSearch !== "") {
      filter = setTimeout(() => {
        const lowerStr = trimSearch.toLowerCase();
        const result = filteredProducts.filter(product => {
          return product.productName.toLowerCase().match(lowerStr) || product.description.toLowerCase().match(lowerStr);
        });
        if (result.length > 0) {
          setSearchResult([...result]);
        }
      }, 1000);
    }
    console.log("search");

    return () => {
      clearTimeout(filter);
    };
  }, [search, filteredProducts]);

  const testSearch = () => {
    const trimSearch = searchTerm.current.value.trim();
    clearTimeout(filter);
    if (trimSearch !== "") {
      filter = setTimeout(() => {
        const lowerStr = trimSearch.toLowerCase();
        const result = filteredProducts.filter(product => {
          return product.productName.toLowerCase().match(lowerStr) || product.description.toLowerCase().match(lowerStr);
        });
        console.log(trimSearch);
        if (result.length > 0) {
          setSearchResult([...result]);
        }
      }, 1000);
    }
    if (trimSearch === "") {
      setSearchResult([]);
    }
  };

  if (products.length === 0) {
    return (
      <Container className="all-product">
        <h1 className="text-center text-white">No Data Avialable!</h1>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="all-product">
      <div className="table-wrapper">
        <div className="table-wrapper-header">
          <SelectDropdown options={options} value={selectedValue} handleSelectedValue={handleSelectedValue} />
          <div className="search">
            <input
              ref={searchTerm}
              type="search"
              // onChange={e => setSearch(e.target.value)}
              onChange={e => testSearch()}
              className="form-control form-control-sm"
              placeholder="Search . . ."
            />
            {/* {search === "" && <i className="search-icon fa-solid fa-magnifying-glass"></i>} */}
          </div>
          {/* <div className="search-mobile"><i className="fa-solid fa-magnifying-glass"></i></div> */}
        </div>

        <div className="table-wrapper-content">
          <table className="table bg-white">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th className="description">Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.length !== 0
                ? searchResult.slice(0, viewCount).map(product => {
                    return <DataTable key={product._id} data={product} handleShowEdit={handleShowEdit} />;
                  })
                : filteredProducts.slice(0, viewCount).map(product => {
                    return <DataTable key={product._id} data={product} handleShowEdit={handleShowEdit} />;
                  })}
            </tbody>
          </table>
        </div>
      </div>
      <EditModal showEdit={showEdit} data={data} handleEditClose={handleEditClose} />
      <button onClick={handleViewCount}>view more</button>
    </Container>
  );
}

function SelectDropdown({ options, value, handleSelectedValue }) {
  return (
    <select className="form-select" value={value} onChange={handleSelectedValue}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function DataTable({ data, handleShowEdit }) {
  const { productName, imageUrl, price, quantity, _id, description } = data;
  return (
    <tr>
      <td>
        <img src={imageUrl} alt="product" />
      </td>
      <td>{productName}</td>
      <td>{description}</td>
      <td>
        {price.toLocaleString("en-US", {
          style: "currency",
          currency: "PHP",
        })}
      </td>
      <td>{quantity}</td>

      <td>
        <div>
          <Button variant="outline-warning" className="me-1 mt-1" size="sm" onClick={e => handleShowEdit(data)}>
            Edit
          </Button>
          <Button variant="outline-danger" className="mt-1" size="sm">
            Archive
          </Button>
        </div>
      </td>
    </tr>
  );
}

function EditModal({ showEdit, data, handleEditClose }) {
  const { productName, imageUrl, price, quantity, _id, description } = data;

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      console.log("no data");
    } else {
      console.log(data);
    }
  }, [data]);
  return (
    <Modal show={showEdit} onHide={handleEditClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>I will not close if you click outside me. Don't even try to press escape key.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleEditClose}>
          Close
        </Button>
        <Button variant="primary">Understood</Button>
      </Modal.Footer>
    </Modal>
  );
}
