import { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { CartProvider } from "./CartContext";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./App.css";
import Footer from "./components/Footer";
//component
import NavBar from "./components/NavBar";
//pages
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Product from "./pages/Product";
import ViewProduct from "./pages/ViewProduct";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });
  const [cartCount, setCartCount] = useState(0);
  const unsetUser = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const fetchData = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await fetchData.json();
        if (typeof data._id !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
          getCart(data._id);
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, []);
  console.log(user.id);
  // useEffect(() => {
  const getCart = async id => {
    try {
      const cart = await fetch(`${process.env.REACT_APP_API_URL}/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await cart.json();
      console.log("bobo");
      setCartCount(data.length++);
    } catch (error) {
      console.log(error);
    }
  };
  // if (user.id !== null) getCart(user.id);
  // }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser, cartCount, setCartCount, getCart }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/register" element={user.id !== null && user.isAdmin !== null ? <Home /> : <Register />} />
          <Route path="/login" element={user.id !== null && user.isAdmin !== null ? <Home /> : <Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>

        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
