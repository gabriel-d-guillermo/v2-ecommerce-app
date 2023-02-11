import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Dashboard.css";

export default function Dashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [archiveProductsCount, setArchiveProductsCount] = useState(0);
  const [activeProductsCount, setActiveProductsCount] = useState(0);

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
          setProductsCount(productsResult.length);
          setUserCount(usersResult.length);
          setActiveProductsCount(
            productsResult.filter(product => {
              return product.isActive;
            }).length
          );
          setArchiveProductsCount(
            productsResult.filter(product => {
              return !product.isActive;
            }).length
          );
        }

        // const users = await fetch();
      } catch (error) {
        console.log(error);
      }
    };
    getdata();
  }, []);
  return (
    <Container className="dashboard border">
      <ul className="dashboard-list">
        <li>
          <Link to="/">
            Total Users <span className="float-end">{userCount}</span>
          </Link>
        </li>
        <hr />
        <li>
          <Link to="/allProducts">
            Total Products <span className="float-end">{productsCount}</span>
          </Link>
          <ul className="products-list">
            <li>
              Active Products <span className="float-end">{activeProductsCount}</span>
            </li>
            <li>
              Archived Products <span className="float-end">{archiveProductsCount}</span>
            </li>
          </ul>
        </li>
        <hr />
        {/* <li>
          <Link to="/">
            Archived Products <span className="float-end">{archiveProductsCount}</span>
          </Link>
        </li>
        <hr /> */}
      </ul>
    </Container>
  );
}
