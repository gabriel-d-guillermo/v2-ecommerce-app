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
import AllProducts from "./pages/allProducts/AllProducts";
import Cart from "./pages/cart/Cart";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Logout from "./pages/logout/Logout";
import Product from "./pages/product/Product";
import Purchased from "./pages/purchased/Purchased";
import Register from "./pages/register/Register";
import ViewProduct from "./pages/viewProduct/ViewProduct";

function App() {
  const [user, setUser] = useState({
    id: undefined,
    isAdmin: undefined,
    address: undefined,
    email: undefined,
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
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
            address: data.address,
            email: data.email,
          });
          if (!data.isAdmin) {
            await getCart(data._id);
          }
        } else {
          setUser({
            id: null,
            isAdmin: null,
            address: null,
            email: null,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, [user.id]);

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
        <Route path="/account" element={<Account />} />
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Product />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ViewProduct />} />
      </Routes>

      {/* {currentPath !== "/cart" && <Footer />} */}
      <Footer />
    </UserProvider>
  );
}

export default App;
