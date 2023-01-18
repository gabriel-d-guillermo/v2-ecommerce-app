import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";

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
import ProductId from "./pages/Product_Id";
import Register from "./pages/Register";
function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data._id !== "undefined") {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
        } else {
          setUser({
            id: null,
            isAdmin: null,
          });
        }
      });
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product/:id" element={<ProductId />} />
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
