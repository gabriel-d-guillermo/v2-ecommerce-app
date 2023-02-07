import { useState, useEffect } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
// import { useLocation } from "react-router-dom";
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
import ViewProduct from "./pages/ViewProduct";
import Register from "./pages/Register";
import Purchased from "./pages/Purchased";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    adress: null,
  });
  const [cart, setCart] = useState([]);

  const unsetUser = () => {
    localStorage.removeItem("token");
  };
  // let location = useLocation();
  // const currentPath = location.pathname;

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
            address: data.address,
          });
          await getCart(data._id);
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
  const getCart = async id => {
    try {
      const cart = await fetch(`${process.env.REACT_APP_API_URL}/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await cart.json();
      setCart(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserProvider value={{ user, setUser, unsetUser, cart, setCart, getCart }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/register" element={user.id !== null && user.isAdmin !== null ? <Home /> : <Register />} />
        <Route path="/login" element={user.id !== null && user.isAdmin !== null ? <Home /> : <Login />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      {/* {currentPath !== "/cart" && <Footer />} */}
      <Footer />
    </UserProvider>
  );
}

export default App;
