import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Dashboard.css";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const getProducts = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const getUsers = await fetch(`${process.env.REACT_APP_API_URL}/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const usersResult = await getUsers.json();
        const productsResult = await getProducts.json();
        if (productsResult !== false && usersResult !== false) {
          setProducts(productsResult);
          setUser(usersResult);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getdata();
  }, []);
  return (
    <Container className="dashboard">
      <ul className="dashboard-list">
        <li>
          <Link to="/users">
            Total Users <span className="float-end">{user.length}</span>
          </Link>
        </li>
        <hr />
        <li>
          <Link to="/allProducts">
            Total Products <span className="float-end">{products.length}</span>
          </Link>
          <ul className="products-list">
            <li>
              Active Products{" "}
              <span className="float-end">
                {
                  products.filter(product => {
                    return product.isActive;
                  }).length
                }
              </span>
            </li>
            <li>
              Archived Products{" "}
              <span className="float-end">
                {
                  products.filter(product => {
                    return !product.isActive;
                  }).length
                }
              </span>
            </li>
          </ul>
        </li>
        <hr />
      </ul>
    </Container>
  );
}
