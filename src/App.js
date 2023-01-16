import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./App.css";
import Footer from "./components/Footer";
//component
import NavBar from "./components/NavBar";
//pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import ProductId from "./pages/Product_Id";
import Register from "./pages/Register";
function App() {
  // fetch(`${process.env.REACT_APP_API_URL}/users/details`,{

  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductId />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
