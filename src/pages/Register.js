import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleForm = e => {
    e.preventDefault();
    let error = {};
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (username.trim() === "") error.username = "username is required";
    if (email.trim() === "") error.email = "email is required";
    if (password.trim() === "") error.password = "password is required";
    if (password.trim() !== confirmPassword.trim())
      error.confirmPassword = "password and confirm password should be the same";
    console.log(password === confirmPassword);
    setFormError(error);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {/* <Alert variant="primary">This is a alert—check it out!</Alert> */}
      <Container fluid className=" background-container p-2 ">
        <Card className="register mx-auto my-3 border pt-3 border-dark" style={{ maxWidth: "30rem", fontSize: "14px" }}>
          <Card.Body className="p-0">
            <Card.Title className="text-center fw-bold">Register</Card.Title>

            <Form className=" px-4 py-2 " onSubmit={handleForm}>
              <Form.Group className="mb-3" controlId="UserName">
                <Form.Label>User name</Form.Label>
                <Form.Control
                  size="sm"
                  ref={usernameRef}
                  type="text"
                  placeholder="Enter user name"
                  autoComplete="off"
                />
                {formError.username && <span className="error">{formError.username}</span>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control size="sm" ref={emailRef} type="email" placeholder="Enter email" autoComplete="off" />
                {formError.email && <span className="error">{formError.email}</span>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  size="sm"
                  ref={passwordRef}
                  type={!showPassword ? "password" : "text"}
                  placeholder="Password"
                  autoComplete="off"
                />
                {formError.password && <span className="error">{formError.password}</span>}
              </Form.Group>
              <Form.Group className="mb-3 " controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  size="sm"
                  ref={confirmPasswordRef}
                  type={!showPassword ? "password" : "text"}
                  placeholder="Confirm password"
                  autoComplete="off"
                />
                {formError.confirmPassword && <span className="error">{formError.confirmPassword}</span>}
              </Form.Group>

              <Form.Group className="" controlId="checkbox">
                <Form.Check type="checkbox" onClick={() => setShowPassword(!showPassword)} label="Show password" />
              </Form.Group>
              <Button variant="outline-dark" className="btn btn-sm mx-auto d-block w-75 my-3 fw-bold" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
          <hr variant="dark" className="m-0 " />
          <p className="text-center m-0" style={{ fontSize: "12px" }}>
            Already have an account?
            <button type="button" className="btn btn-link  btn-sm " onClick={() => navigate("/login")}>
              Click here
            </button>
            to login
          </p>
        </Card>
      </Container>
    </>
  );
}
