import { Link, useLocation } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import UserContext from "../../UserContext";

//bootstrapNav
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./NavBar.css";

export default function NavBar() {
  const location = useLocation();
  const pathname = location.pathname;

  const { user, cart } = useContext(UserContext);
  const topRef = useRef();
  const [height, setHeight] = useState(false);
  const scrollTop = () => {
    topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar variant="dark" className="  fixed-top" expand="md">
        <Container fluid="lg" className="px-lg-0">
          <Navbar.Brand as={Link} to="/" className="fw-bold" onClick={scrollTop}>
            E-toOls
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setHeight(!height)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user.id !== null && user.isAdmin === false ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/products"
                    onClick={scrollTop}
                    className={pathname === "/products" && "active"}
                  >
                    Products
                  </Nav.Link>
                  <Nav.Link
                    className={`my-cart ${pathname === "/cart" && "active"}`}
                    as={Link}
                    to="/cart"
                    onClick={scrollTop}
                  >
                    Cart
                    <div className="cart-count">{cart.length}</div>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/purchased"
                    onClick={scrollTop}
                    className={pathname === "/purchased" && "active"}
                  >
                    My Purchase
                  </Nav.Link>
                  <NavDropdown
                    title={user.email}
                    id="nav-dropdown"
                    align="end"
                    className={pathname === "/account" && "active"}
                  >
                    {/* <NavDropdown.                                                                                                                                                                                             Divider /> */}
                    <NavDropdown.Item as={Link} to="/account" onClick={scrollTop}>
                      My Account
                    </NavDropdown.Item>

                    <NavDropdown.Item as={Link} to="/logout" onClick={scrollTop}>
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : user.id !== null && user.isAdmin === true ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={pathname === "/dashboard" && "active"}
                    onClick={scrollTop}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/allProducts"
                    onClick={scrollTop}
                    className={pathname === "/allProducts" && "active"}
                  >
                    All Products
                  </Nav.Link>
                  <Nav.Link as={Link} to="/users" onClick={scrollTop} className={pathname === "/users" && "active"}>
                    Users
                  </Nav.Link>
                  <NavDropdown
                    title={user.email}
                    id="nav-dropdown"
                    align="end"
                    className={pathname === "/account" && "active"}
                  >
                    <NavDropdown.Item as={Link} to="/account" onClick={scrollTop}>
                      My Account
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/logout" onClick={scrollTop}>
                      Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/products"
                    onClick={scrollTop}
                    className={pathname === "/products" && "active"}
                  >
                    Products
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    onClick={scrollTop}
                    className={pathname === "/register" && "active"}
                  >
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" onClick={scrollTop} className={pathname === "/login" && "active"}>
                    Login <i className="fa-solid fa-right-to-bracket"></i>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div ref={topRef} className={height ? (user.id !== null ? "admin-show-spacer" : "show-spacer") : "spacer"}></div>
    </>
  );
}
