import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import UserContext from "../../UserContext";

//bootstrap
import { Container, Nav, Navbar } from "react-bootstrap";
import "./NavBar.css";

export default function NavBar() {
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
            <Nav className="ms-auto" onClick={scrollTop}>
              {user.id !== null && user.isAdmin === false ? (
                <>
                  {/* <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link> */}
                  <Nav.Link as={Link} to="/products">
                    Products
                  </Nav.Link>
                  <Nav.Link className="my-cart" as={Link} to="/cart">
                    Cart
                    <div className="cart-count">{cart.length}</div>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/purchased">
                    Purchased
                  </Nav.Link>
                  <Nav.Link as={Link} to="/account">
                    Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout">
                    Log Out
                  </Nav.Link>
                </>
              ) : (
                <>
                  {/* <Nav.Link as={Link} to="/">
                    Home
                  </Nav.Link> */}
                  <Nav.Link as={Link} to="/products">
                    Products
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    Login <i className="fa-solid fa-right-to-bracket"></i>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div ref={topRef} className={height ? "spacer show-spacer" : "spacer"}></div>
    </>
  );
}