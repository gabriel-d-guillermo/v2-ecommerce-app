import { useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container fluid className=" background-container p-2">
      <Card className="mx-auto mt-5 border pt-3 border-dark" style={{ maxWidth: "25rem", fontSize: "14px" }}>
        <Card.Body className="p-0">
          <Card.Title className="text-center">Log in</Card.Title>

          <Form className=" px-4 py-2 ">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>User name</Form.Label>
              <Form.Control size="sm" type="email" placeholder="Enter user name" autoComplete="off" />
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="sm"
                type={!showPassword ? "password" : "text"}
                placeholder="Password"
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="" controlId="checkbox">
              <Form.Check type="checkbox" onClick={() => setShowPassword(!showPassword)} label="Show password" />
            </Form.Group>
            <Button variant="outline-dark" className="btn btn-sm mx-auto d-block w-75 mt-4 mb-3" type="submit">
              Log in
            </Button>
          </Form>
        </Card.Body>
        <hr variant="dark" className="m-0 " />
        <p className="text-center m-0" style={{ fontSize: "12px" }}>
          Don't have an account yet?
          <button type="button" className="btn btn-link  btn-sm " onClick={() => navigate("/register")}>
            Click here
          </button>
          to register
        </p>
      </Card>
    </Container>
  );
}
