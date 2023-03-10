import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container } from "react-bootstrap";

import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  //reset all input
  const handleReset = () => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  };

  //validate form
  const handleForm = e => {
    e.preventDefault();
    let error = {};
    const firstName = firstNameRef.current?.value.trim();
    const lastName = lastNameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    const confirmPassword = confirmPasswordRef.current?.value.trim();
    if (firstName === "") error.firstName = "first name is required";
    if (lastName === "") error.lastName = "last name is required";
    if (email === "") error.email = "email is required";
    if (password === "") error.password = "password is required";
    if (password !== confirmPassword) error.confirmPassword = "password and confirm password should be the same";
    setFormError(error);
    if (Object.keys(error).length === 0) {
      setIsFormValid(true);
    }
  };

  //check if the email is already in use
  const checkEmail = async email => {
    try {
      const userEmail = await fetch(`${process.env.REACT_APP_API_URL}/users/checkEmail`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await userEmail.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  //register when isFormvalid ==true
  useEffect(() => {
    const register = async () => {
      try {
        //input values
        const firstName = firstNameRef.current?.value.trim();
        const lastName = lastNameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        //chech if email is already in use
        const isEmailInUSe = await checkEmail(email);

        if (isEmailInUSe) {
          return alertPopUP("duplicate");
        }
        //if email is not in use
        //proceed to register
        const postData = await fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          }),
        });

        const res = await postData.json();

        //check if the reponse is success
        if (res) {
          handleReset();
          await alertPopUP("success");
          return navigate("/login");
        }

        return alertPopUP("error");
      } catch (error) {
        console.error(error);
        return alertPopUP("error");
      }
    };

    if (isFormValid) register();

    return () => {
      setIsFormValid(false);
    };
  }, [isFormValid, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Container fluid className=" background-container pt-2 ">
      <Card className="register mx-auto mt-3 border pt-3 border-dark" style={{ maxWidth: "30rem", fontSize: "14px" }}>
        <Card.Body className="p-0">
          <Card.Title className="text-center fw-bold">Register</Card.Title>

          <Form className=" px-4 py-2 " onSubmit={handleForm}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label className="mb-1">First name</Form.Label>
              <Form.Control
                size="sm"
                ref={firstNameRef}
                type="text"
                placeholder="Enter first name"
                autoComplete="off"
              />
              {formError.firstName && <span className="error">{formError.firstName}</span>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="mb-1">Last name</Form.Label>
              <Form.Control size="sm" ref={lastNameRef} type="text" placeholder="Enter first name" autoComplete="off" />
              {formError.lastName && <span className="error">{formError.lastName}</span>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="mb-1">Email address</Form.Label>
              <Form.Control size="sm" ref={emailRef} type="email" placeholder="Enter email" autoComplete="off" />
              {formError.email && <span className="error">{formError.email}</span>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="mb-1">Password</Form.Label>
              <Form.Control
                size="sm"
                ref={passwordRef}
                type={!showPassword ? "password" : "text"}
                placeholder="Password"
                autoComplete="off"
              />
              {formError.password && <span className="error">{formError.password}</span>}
            </Form.Group>
            <Form.Group className="mb-1 " controlId="confirmPassword">
              <Form.Label className="mb-1">Confirm Password</Form.Label>
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
  );
}

function alertPopUP(status) {
  if (status === "success") {
    return Swal.fire({
      position: "top",
      icon: "success",
      text: "Register Successfully!!",
      showConfirmButton: false,
      timer: 2000,
      toast: true,
    });
  }

  if (status === "duplicate") {
    return Swal.fire({
      icon: "warning",
      text: "Email is already in use. Please use a different one",
      width: "25rem",
    });
  }
  if (status === "error")
    Swal.fire({
      icon: "error",
      text: "Something went wrong!!",
      width: "25rem",
    });
}
