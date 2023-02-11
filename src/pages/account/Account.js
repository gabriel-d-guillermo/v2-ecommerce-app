import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

import Swal from "sweetalert2";
import UserContext from "../../UserContext";
import "./Account.css";
import ChangePassword from "../../components/changePassword/ChangePassword";

export default function Account() {
  const { user, setUser } = useContext(UserContext);

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
        if (data.address === null && data.mobileNo === null) {
          setfirstName(data.firstName);
          setlastName(data.lastName);
        } else {
          setfirstName(data.firstName);
          setlastName(data.lastName);
          setAddress(data.address);
          setMobileNo(data.mobileNo);
        }
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
          Swal.fire({
            title: "Edit Success",
            icon: "success",
            position: "top",
            showConfirmButton: false,
            toast: true,
            timer: 2000,
          });
          setUser({
            ...user,
            address: address,
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
    const status = document.querySelectorAll(".profile-input");
    status.forEach(elem => {
      elem.removeAttribute("disabled");
    });
    setIsActive(true);
  };

  const disableEdit = () => {
    const status2 = document.querySelectorAll(".profile-input");
    status2.forEach(elem => {
      elem.setAttribute("disabled", "");
    });
    setIsActive(false);
  };

  useEffect(() => {
    userDetails();
  }, []);

  //admin
  // if (user.id !== undefined && user.isAdmin) {
  //   return <Navigate to="/dashboard" />;
  // }
  //non user
  if (user.id === null && user.isAdmin === null) {
    return <Navigate to="/" />;
  }

  return user.id !== undefined && user.isAdmin !== undefined ? (
    <Container className="account pt-4">
      <div className="d-flex justify-content-center mb-5 mt-3  ">
        <div className="account-content bg-white rounded ">
          <div className="text-center fs-5">My Account</div>

          <Form className="" onSubmit={e => updateProfile(e)}>
            <Form.Group className="mb-3 " controlId="firstName">
              <Form.Label className="text-secondary">First Name</Form.Label>
              <Form.Control
                size="sm"
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
                size="sm"
                type="text"
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
                size="sm"
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
                size="sm"
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
                <Button variant="outline-primary" className="me-1" size="sm" type="submit" id="submitBtn">
                  Save Changes
                </Button>
                <Button variant="outline-danger" size="sm" onClick={e => disableEdit()}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline-primary" size="sm" onClick={e => enableEdit()}>
                Edit Profile
              </Button>
            )}
          </Form>

          <ChangePassword />
        </div>
      </div>
    </Container>
  ) : (
    <Container className="account"></Container>
  );
}
