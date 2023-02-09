import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditModal({ data }) {
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

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
      });
  };

  useEffect(() => {
    if (oldPassword !== "" && newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword) {
      setIsActive(true);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  return (
    <>
      <Button size="sm" className="btn btn-secondary mt-3" onClick={handleShow}>
        Change Password
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Form className="">
          <Modal.Header>
            <Modal.Title className="text-danger ">Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3 " controlId="password">
              <Form.Label className="text-secondary">Enter Current Password</Form.Label>
              <Form.Control
                type="password"
                className="profile-input text-secondary"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="new-password">
              <Form.Label className="text-secondary">Enter New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                className="profile-input text-secondary"
                onChange={e => setNewPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirm-password">
              <Form.Label className="text-secondary">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                className="profile-input text-secondary"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value.trim())}
                autoComplete="off"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={e => cancel(e)}>
              Cancel
            </Button>
            {isActive ? (
              <Button variant="primary" onClick={e => confirm(e)}>
                Change Password
              </Button>
            ) : (
              <Button variant="primary" disabled>
                Change Password
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
