import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";

//css
import "./App.css";

//component
import Footer from "./components/footer/Footer";
import NavBar from "./components/navBar/NavBar";

//pages
import Account from "./pages/account/Account";
import Cart from "./pages/cart/Cart";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Logout from "./pages/logout/Logout";
import Product from "./pages/product/Product";
import ViewProduct from "./pages/viewProduct/ViewProduct";
import Register from "./pages/register/Register";
import Purchased from "./pages/purchased/Purchased";

function App() {
  const [user, setUser] = useState({
    id: undefined,
    isAdmin: undefined,
    address: null,
  });
  const [cart, setCart] = useState([]);

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
          await getCart(data._id);
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
            address: data.address,
          });
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

  //get the users cart items
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
        <Route path="/account" element={<Account />} />
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
