import { useState, useRef, useEffect, useContext } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../UserContext";

import Swal from "sweetalert2";

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isError, setIsError] = useState({});
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleLogin = e => {
    e.preventDefault();
    let error = {};
    if (emailRef.current?.value.trim() === "") error.email = "email is required";
    if (passwordRef.current?.value.trim() === "") error.password = "email is required";
    setIsError(error);
    if (Object.keys(error).length === 0) {
      setIsFormValid(true);
    }
  };

  useEffect(() => {
    const loginUser = async () => {
      try {
        const login = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: emailRef.current?.value.trim(),
            password: passwordRef.current?.value.trim(),
          }),
        });
        const res = await login.json();

        if (res.access && res.access !== "undefined") {
          localStorage.setItem("token", res.access);
          const data = await retrieveUserDetails(res.access);
          if (data) {
            setUser({
              id: data._id,
              isAdmin: data.isAdmin,
              address: data.address,
              email: data.email,
            });

            Swal.fire({
              position: "top",
              icon: "success",
              text: "Log in successful!!",
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
            if (data.isAdmin) {
              navigate("dashboard");
            }
            if (!data.isAdmin) {
              navigate("/products");
            }
            // if (user.id !== null && user.isAdmin) return <Navigate to="/dashboard" />;
            // if (user.id !== null && !user.isAdmin) return <Navigate to="/products" />;
          } else {
            Swal.fire({
              icon: "error",
              text: "Something went wrong!!",
              width: "25rem",
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            text: "Email/Password is incorrect",
            width: "25rem",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (isFormValid) loginUser();

    return () => setIsFormValid(false);
  }, [isFormValid, setUser, navigate]);

  const retrieveUserDetails = async token => {
    try {
      const fetchUserDetails = await fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await fetchUserDetails.json();
      if (data) {
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  if (user.id !== null && user.isAdmin) return <Navigate to="/dashboard" />;
  if (user.id !== null && !user.isAdmin) return <Navigate to="/products" />;

  return (
    <Container fluid className=" background-container p-2 ">
      <Card className="login mx-auto mt-5 border pt-3 border-dark" style={{ maxWidth: "25rem", fontSize: "14px" }}>
        <Card.Body className="p-0">
          <Card.Title className="text-center">Login</Card.Title>

          <Form className=" px-4 py-2 " onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Email</Form.Label>
              <Form.Control ref={emailRef} size="sm" type="email" placeholder="Enter email" autoComplete="off" />
              {isError.email && <span className="error">{isError.email}</span>}
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                ref={passwordRef}
                size="sm"
                type={!showPassword ? "password" : "text"}
                placeholder="Password"
                autoComplete="off"
              />
              {isError.password && <span className="error">{isError.password}</span>}
            </Form.Group>
            <Form.Group className="" controlId="checkbox">
              <Form.Check type="checkbox" onClick={() => setShowPassword(!showPassword)} label="Show password" />
            </Form.Group>
            <Button variant="outline-dark" className="btn btn-sm mx-auto d-block w-75 mt-4 mb-3" type="submit">
              Login
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
