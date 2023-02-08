import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Form, Col, Button, Row, Container } from "react-bootstrap";

import Swal from "sweetalert2";
import UserContext from "../UserContext";
import "./Account.css";
import ChangePassword from "../components/ChangePassword";

export default function Account() {
  const { user } = useContext(UserContext);

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [isActive, setIsActive] = useState(false);

  //user details
  const userDetails = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        setfirstName(data.firstName);
        setlastName(data.lastName);
        setAddress(data.address);
        setMobileNo(data.mobileNo);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateProfile = e => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/details/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        mobileNo: mobileNo,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data === true) {
          // console.log(data);
          Swal.fire({
            title: "Edit Success",
            icon: "success",
          });
          userDetails();
          disableEdit();
        } else {
          console.log(data);
          Swal.fire({
            title: "Something Went Wrong! ",
            icon: "error",
          });
        }
      });
  };

  const enableEdit = () => {
    // e.preventDefault();
    const status = document.querySelectorAll(".profile-input");
    status.forEach(elem => {
      elem.removeAttribute("disabled");
    });
    // status.removeAttribute('disabled');
    setIsActive(true);
  };

  const disableEdit = () => {
    const status2 = document.querySelectorAll(".profile-input");
    status2.forEach(elem => {
      elem.setAttribute("disabled", "");
    });
    // status.removeAttribute('disabled');
    setIsActive(false);
  };

  useEffect(() => {
    userDetails();
  }, []);

  if (user.id !== undefined && user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  if (user.id === null && user.isAdmin === null) {
    return <Navigate to="/" />;
  }

  return user.id !== undefined && !user.isAdmin ? (
    <Container className="account">
      <Row className="justify-content-center mb-5 p-3">
        <Col className="  col-md-9 col-lg-6 bg-white rounded border  p-3 p-sm-5 shadow">
          <h3 align="center" className="text-secondary">
            Profile
          </h3>

          <Form className="" onSubmit={e => updateProfile(e)}>
            <Form.Group className="mb-3 " controlId="firstName">
              <Form.Label className="text-secondary">First Name</Form.Label>
              <Form.Control
                type="text"
                className="profile-input text-secondary"
                value={firstName}
                onChange={e => setfirstName(e.target.value)}
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="text-secondary">Last Name</Form.Label>
              <Form.Control
                type="Text"
                value={lastName}
                className="profile-input text-secondary"
                onChange={e => setlastName(e.target.value)}
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label className="text-secondary">Address</Form.Label>
              <Form.Control
                type="Text"
                className="profile-input text-secondary"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobileNo">
              <Form.Label className="text-secondary">Mobile Number</Form.Label>
              <Form.Control
                type="Text"
                className="profile-input text-secondary"
                value={mobileNo}
                onChange={e => setMobileNo(e.target.value.replace(/[a-zA-Z\s]/g, ""))}
                required
                disabled
              />
            </Form.Group>

            {isActive ? (
              <>
                <Button variant="primary" className="me-1" size="sm" type="submit" id="submitBtn">
                  Save Changes
                </Button>
                <Button variant="danger" size="sm" onClick={e => disableEdit()}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={e => enableEdit()}>
                Edit Profile
              </Button>
            )}
          </Form>

          <ChangePassword />
        </Col>
      </Row>
    </Container>
  ) : (
    <Container className="account"></Container>
  );
}
