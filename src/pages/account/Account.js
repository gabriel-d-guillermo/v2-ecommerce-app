import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

import UserContext from "../../UserContext";
import Swal from "sweetalert2";
import "./Account.css";
import ChangePassword from "../../components/changePassword/ChangePassword";

export default function Account() {
  const { user, setUser } = useContext(UserContext);
  const [isActive, setIsActive] = useState(false);
  const [defaultData, setDefaultData] = useState({});
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobileNo: "",
  });

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
          data.address = "";
          data.mobileNo = "";
          const { firstName, lastName, address, mobileNo } = data;
          setDefaultData({ firstName, lastName, address, mobileNo });
          setProfile({ firstName, lastName, address, mobileNo });
        } else {
          const { firstName, lastName, address, mobileNo } = data;
          setDefaultData({ firstName, lastName, address, mobileNo });
          setProfile({ firstName, lastName, address, mobileNo });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateProfile = e => {
    e.preventDefault();

    if (
      profile.firstName.trim() === "" ||
      profile.lastName.trim() === "" ||
      profile.address.trim() === "" ||
      profile.mobileNo.trim() === ""
    ) {
      Swal.fire({
        title: "Warning!!",
        text: "Cannot process an empty field",
        icon: "warning",
        position: "top",
        showConfirmButton: true,
      });
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/users/details/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        address: profile.address.trim(),
        mobileNo: profile.mobileNo.trim(),
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
            address: profile.address,
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
    setProfile(defaultData);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    userDetails();
  }, []);

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
              <div className="input-wrapper">
                <Form.Control
                  size="sm"
                  type="text"
                  className="profile-input text-secondary"
                  value={profile.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                  required
                  disabled
                  autoComplete="off"
                />
                {!isActive && <i className="fa-solid fa-lock"></i>}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="text-secondary">Last Name</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  size="sm"
                  type="text"
                  value={profile.lastName}
                  className="profile-input text-secondary"
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                  required
                  disabled
                  autoComplete="off"
                />
                {!isActive && <i className="fa-solid fa-lock"></i>}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label className="text-secondary">Address</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  size="sm"
                  type="Text"
                  className="profile-input text-secondary"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  required
                  disabled={!isActive}
                  autoComplete="off"
                />
                {!isActive && <i className="fa-solid fa-lock"></i>}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobileNo">
              <Form.Label className="text-secondary">Mobile Number</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  size="sm"
                  type="number"
                  className="profile-input text-secondary"
                  value={profile.mobileNo}
                  onChange={e => setProfile({ ...profile, mobileNo: e.target.value })}
                  required
                  disabled
                  autoComplete="off"
                />
                {!isActive && <i className="fa-solid fa-lock"></i>}
              </div>
            </Form.Group>

            {isActive ? (
              <>
                <Button variant="outline-primary" className="me-1" size="sm" type="submit" id="submitBtn">
                  Save Changes
                </Button>
                <Button variant="outline-danger" size="sm" type="button" onClick={e => disableEdit()}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline-primary" type="button" size="sm" onClick={e => enableEdit()}>
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
