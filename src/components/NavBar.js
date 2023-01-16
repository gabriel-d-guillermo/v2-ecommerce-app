import { Link } from "react-router-dom";

//bootstrap
import { Container, Nav, Navbar } from "react-bootstrap";
import "./NavBar.css";

export default function NavBar() {
  return (
    <Navbar variant="dark" expand="md" style={{ backgroundColor: "#0a0a0d" }}>
      <Container fluid="lg" className="px-lg-0">
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          E-toOls
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login <i className="fa-solid fa-right-to-bracket"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
