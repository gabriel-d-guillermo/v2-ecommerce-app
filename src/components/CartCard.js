import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
export default function CartCard({ cartId, user }) {
  //   const { _id, cartId, imageUrl, price, createdOn, productName } = item;
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [subTotal, setSubtotal] = useState(0);

  //   let total = setSubtotal(quantity * price);
  const handleDecrement = () => {
    setQuantity(quantity - 1);
  };
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
    const updateCart = async () => {
      try {
        const update = await fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quantity: quantity,
            subTotal: quantity * price,
          }),
        });
        const data = await update.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (quantity !== 0) updateCart();
  }, [quantity]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const fetchdata = await fetch(`${process.env.REACT_APP_API_URL}/cart/${user.id}/${cartId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await fetchdata.json();
        setProduct(data);
        setQuantity(data.quantity);
        setPrice(data.price);
        setSubtotal(data.subTotal);
        // setSubtotal(data.price * data.quantity);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);
  console.log(product);
  return (
    <div className="cart-card bg-white mb-3 border p-2 ">
      <div className="img-container">
        <img className="" src={product.imageUrl} />
      </div>
      {/* {product.createdOn} */}

      <div className="btn-group">
        <Button onClick={handleDecrement}>-</Button>
        <Button>{quantity}</Button>
        <Button onClick={handleIncrement}>+</Button>
      </div>

      <p> {product.productName}</p>
      {price * quantity}
    </div>
  );
}
