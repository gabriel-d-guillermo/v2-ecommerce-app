import { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Loading from "../../components/loading/Loading";
import ProductModal from "../../components/productModal/ProductModal";

import "./AllProducts.css";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState("all");
  const [searchResult, setSearchResult] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const searchTerm = useRef("");

  let timeOut = null;
  const options = [
    { value: "all", label: "All Products" },
    { value: "active", label: "Active Products" },
    { value: "archived", label: "Archived Products" },
  ];
  const handleModalShow = data => {
    setShow(true);
    setData(data);
  };
  const handleModalClose = () => {
    setShow(false);
    setData({});
  };
  const handleSelectedValue = event => {
    setSelectedValue(event.target.value);
  };

  const handleViewCount = () => {
    setViewCount(viewCount + 10);
  };

  const handleArchive = async id => {
    setLoading(true);
    try {
      const archiveProduct = await fetch(`${process.env.REACT_APP_API_URL}/products/archive/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await archiveProduct.json();
      if (result === true) {
        await getProducts();

        Swal.fire({
          position: "top",
          icon: "success",
          text: "Product has been Archived",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnArchive = async id => {
    try {
      const archiveProduct = await fetch(`${process.env.REACT_APP_API_URL}/products/unarchive/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await archiveProduct.json();
      if (result === true) {
        await getProducts();
        Swal.fire({
          position: "top",
          icon: "success",
          text: "Product has been Unarchived",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  const addNewProduct = async productData => {
    try {
      const newProduct = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });
      const result = await newProduct.json();
      console.log(result);
      if (result.duplicate !== undefined) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Product name is already in use",
          showConfirmButton: true,
        });

        return;
      }
      if (result === true) {
        await getProducts();
        setData({});
        setShow(false);

        Swal.fire({
          position: "top",
          icon: "success",
          text: "Successfully added new product!",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        });
        return;
      }
      if (result === false) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Something went wrong!!",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const updateProduct = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(productData),
      });
      const result = await updateProduct.json();
      if (result === true) {
        Swal.fire({
          position: "top",
          icon: "success",
          text: "Edit Success!!",
          showConfirmButton: false,
          toast: true,
          timer: 2000,
        });
        await getProducts();
        setData({});
        setShow(false);
        return;
      }
      if (!result) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Something went wrong!!",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //when mount
  useEffect(() => {
    setLoading(true);
    const data = async () => {
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
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    data();
    return () => {
      setLoading(false);
    };
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
  const searchProduct = () => {
    const trimSearch = searchTerm.current.value.trim();
    clearTimeout(timeOut);

    if (trimSearch !== "") {
      timeOut = setTimeout(() => {
        const lowerStr = trimSearch.toLowerCase();
        const result = filteredProducts.filter(product => {
          return product.productName.toLowerCase().match(lowerStr) || product.description.toLowerCase().match(lowerStr);
        });
        if (result.length > 0) {
          setSearchResult([...result]);
        }
        console.log(trimSearch);
      }, 1000);
    }
    if (trimSearch === "") {
      setSearchResult([]);
    }
  };

  // if (loading) {
  //   return <Loading />;
  // }

  // if (products.length === 0) {
  //   return (
  //     <Container className="all-product">
  //       <h3 className="text-center text-white">No Data Avialable!</h3>
  //     </Container>
  //   );
  // }

  return (
    <Container fluid="lg" className="all-product ">
      {loading && <Loading />}
      <Button className="btn  mb-4" size="sm" onClick={e => handleModalShow(data)}>
        Add New Product
      </Button>
      <div className="table-wrapper">
        <div className="table-wrapper-header">
          <SelectDropdown options={options} value={selectedValue} handleSelectedValue={handleSelectedValue} />
          <div className="search">
            <input
              ref={searchTerm}
              type="search"
              // onChange={e => setSearch(e.target.value)}
              onChange={searchProduct}
              className="form-control form-control-sm"
              placeholder="Search . . ."
            />
          </div>
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className=" text-center">
                    No Results
                  </td>
                </tr>
              ) : searchResult.length !== 0 ? (
                searchResult.slice(0, viewCount).map(product => {
                  return (
                    <DataTable
                      key={product._id}
                      data={product}
                      handleModalShow={handleModalShow}
                      handleArchive={handleArchive}
                      handleUnArchive={handleUnArchive}
                    />
                  );
                })
              ) : (
                filteredProducts.slice(0, viewCount).map(product => {
                  return (
                    <DataTable
                      key={product._id}
                      data={product}
                      handleModalShow={handleModalShow}
                      handleArchive={handleArchive}
                      handleUnArchive={handleUnArchive}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal
        show={show}
        data={data}
        handleModalClose={handleModalClose}
        addNewProduct={addNewProduct}
        updateProduct={updateProduct}
      />
      {filteredProducts.length !== 0 && filteredProducts.length > viewCount && (
        <div className="my-5 text-center">
          <Button variant="outline-light" onClick={handleViewCount}>
            View More <i className="fa-solid fa-arrow-down"></i> {}
          </Button>
        </div>
      )}
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

function DataTable({ data, handleModalShow, handleArchive, handleUnArchive }) {
  const { productName, imageUrl, price, quantity, description, isActive, _id } = data;
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
        <Button variant="outline-warning" className=" mt-1" size="sm" onClick={e => handleModalShow(data)}>
          Edit
        </Button>
        <br />
        {isActive ? (
          <Button variant="outline-danger" className="mt-1" size="sm" onClick={e => handleArchive(_id)}>
            Archive
          </Button>
        ) : (
          <Button variant="outline-dark" className="mt-1" size="sm" onClick={e => handleUnArchive(_id)}>
            Unarchive
          </Button>
        )}
      </td>
    </tr>
  );
}
