import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./ProductModal.css";
import Swal from "sweetalert2";

export default function ProductModal(prop) {
  const { data, show, handleModalClose, addNewProduct, updateProduct } = prop;
  const [product, setProduct] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [title, settitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      setProduct("");
      setProductDescription("");
      setProductImage("");
      setProductPrice("");
      setProductQuantity("");
      settitle("Add New Product");
      setIsEdit(false);
    } else {
      setProduct(data.productName);
      setProductDescription(data.description);
      setProductImage(data.imageUrl);
      setProductPrice(data.price);
      setProductQuantity(data.quantity);
      settitle(data.productName);
      setIsEdit(true);
    }
  }, [data]);

  const hasEmptyProperty = obj => {
    return Object.values(obj).some(value => value === "");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // console.log(data._id);

    const productData = {
      name: product.trim(),
      description: productDescription.trim(),
      price: productPrice,
      imageUrl: productImage.trim(),
      quantity: productQuantity,
    };
    //check if there is an empty value
    if (hasEmptyProperty(productData)) {
      Swal.fire({
        position: "top",
        icon: "warning",
        title: "Cannot be process",
        text: "Form has an empty field!!",
        showConfirmButton: true,
      });
    } else {
      if (isEdit) {
        updateProduct(data._id, productData);
      }
      if (!isEdit) {
        addNewProduct(productData);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={false}>
      <Modal.Header className="px-3 py-2" closeButton>
        <h5>{title}</h5>
      </Modal.Header>
      <Form onSubmit={e => handleSubmit(e)}>
        <Modal.Body>
          <figure>
            <img src={productImage} alt="product" />
          </figure>

          <Form.Group className="mb-2" controlId="imageUrl">
            <Form.Label className="mb-1">Image Url</Form.Label>
            <Form.Control
              size="sm"
              value={productImage}
              type="url"
              onChange={e => setProductImage(e.target.value)}
              placeholder="Image Url. . ."
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="productname">
            <Form.Label className="mb-1">Name</Form.Label>
            <Form.Control
              size="sm"
              value={product}
              type="text"
              onChange={e => setProduct(e.target.value)}
              placeholder="Name. . ."
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="productDescription">
            <Form.Label className="mb-1">Description</Form.Label>
            <textarea
              className="form-control"
              value={productDescription}
              onChange={e => setProductDescription(e.target.value)}
              placeholder="Description. . ."
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="productQuantity">
            <Form.Label className="mb-1">Quantity</Form.Label>
            <Form.Control
              size="sm"
              value={productQuantity}
              type="number"
              onChange={e => setProductQuantity(e.target.value)}
              placeholder="Quantity"
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="productPrice">
            <Form.Label className="mb-1">Price</Form.Label>
            <Form.Control
              size="sm"
              value={productPrice}
              type="number"
              onChange={e => setProductPrice(e.target.value)}
              placeholder="Price. . ."
              autoComplete="off"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="danger" size="sm" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
