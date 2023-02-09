import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "./ChangePassword.css";
export default function EditModal({ data }) {
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // console.log([oldPassword,newPassword,confirmPassword])
  const confirm = e => {
    e.preventDefault();
    setShow(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change my Password!",
    }).then(result => {
      if (result.isConfirmed) {
        changePassword();
      } else {
        setShow(true);
      }
    });
  };

  const cancel = e => {
    e.preventDefault();
    setShow(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsActive(false);
    setShowPassword(false);
  };

  const changePassword = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/changePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        password: oldPassword,
        newPassword: newPassword,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data === true) {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Your Password has successfully been changed!",
          });
          setIsActive(false);
          setShowPassword(false);
        } else {
          Swal.fire({
            title: "Current Password is incorrect!",
            icon: "error",
            text: "Please check your current password!",
          });
        }
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsActive(false);
        setShowPassword(false);
      });
  };

  useEffect(() => {
    if (oldPassword !== "" && newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  return (
    <>
      <Button size="sm" variant="outline-dark" className=" mt-3" onClick={handleShow}>
        Change Password
      </Button>

      <Modal className="my-modal pt-5" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Form className="">
          <Modal.Header>
            <h5 className="text-danger ">Change Password</h5>
          </Modal.Header>
          <Modal.Body className="p-3">
            <Form.Group className="mb-3 " controlId="password">
              <Form.Label className="text-secondary">Enter Current Password</Form.Label>
              <Form.Control
                size="sm"
                type={showPassword ? "text" : "password"}
                className="profile-input text-secondary"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="new-password">
              <Form.Label className="text-secondary">Enter New Password</Form.Label>
              <Form.Control
                size="sm"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                className="profile-input text-secondary"
                onChange={e => setNewPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="confirm-password">
              <Form.Label className="text-secondary">Confirm Password</Form.Label>
              <Form.Control
                size="sm"
                type={showPassword ? "text" : "password"}
                className="profile-input text-secondary"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3 text-secondary" controlId="checkbox">
              <Form.Check type="checkbox" onClick={() => setShowPassword(!showPassword)} label="Show password" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="outline-danger" onClick={e => cancel(e)}>
              Cancel
            </Button>
            {isActive ? (
              <Button size="sm" variant="outline-success" onClick={e => confirm(e)}>
                Change Password
              </Button>
            ) : (
              <Button size="sm" variant="outline-secondary" disabled>
                Change Password
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
