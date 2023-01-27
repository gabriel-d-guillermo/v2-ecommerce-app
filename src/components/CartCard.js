import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./CartCard.css";
export default function CartCard({ cartId, user, addItem, removeItem }) {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [itemLeft, setItemLeft] = useState(0);
  const [inCart, setInCart] = useState(false);

  const local = JSON.parse(localStorage.getItem("Orders"));
  // console.log(local);
  const find = () => {
    if (local !== null) {
      let res = local.find(item => {
        return item.id === cartId;
      });
      if (res === undefined) {
        setInCart(false);
      } else {
        setInCart(true);
      }
    }
  };

  //add item to localStorage Orders
  const handleItem = () => {
    const item = {
      id: cartId,
      quantity: quantity,
      price: price,
    };
    // console.log(inCart);
    if (!inCart) {
      setInCart(true);
      addItem(item);
    } else {
      setInCart(false);
      removeItem(item.id);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      updateCart(-1);
    }
  };

  const handleIncrement = () => {
    if (itemLeft > quantity) {
      setQuantity(quantity + 1);
      updateCart(1);
    }
  };

  const updateCart = num => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quantity: quantity + num,
          subTotal: quantity * price,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const fetchdata = await fetch(`${process.env.REACT_APP_API_URL}/cart/${user.id}/${cartId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await fetchdata.json();

        setProduct(result.data);
        setQuantity(result.data.quantity);
        setPrice(result.data.price);
        // setSubtotal(result.data.subTotal);
        setItemLeft(result.productLeft);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
    find();
  }, []);

  return (
    <div className="cart-card ">
      <div className="cart-card-header">
        {inCart ? (
          <input type="checkbox" className="check-box" onClick={handleItem} defaultChecked={true} />
        ) : (
          <input type="checkbox" className="check-box" onClick={handleItem} />
        )}
        <h6 className="d-inline mx-auto"> {itemLeft}</h6>
      </div>
      <div className="cart-card-body">
        <div className="img-container">
          <img className="" src={product.imageUrl} />
        </div>

        <div className="product-details">
          <p> {product.productName}</p>
          <div className="product-summary">
            {price.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
            <div className="button-group border border-secondary">
              <button size="sm" onClick={handleDecrement}>
                -
              </button>
              <button size="sm" className="px-3  border-start border-end border-secondary">
                {quantity}
              </button>
              <button size="sm" onClick={handleIncrement}>
                +
              </button>
            </div>
            <div>
              <small>Sub Total: </small>₱{price * quantity}
            </div>
          </div>
        </div>
        <div className="action">
          <Button variant="outline-dark">Delete Item</Button>
        </div>
      </div>
    </div>
  );
}
