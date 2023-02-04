import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import "./CartCard.css";
export default function CartCard({
  cartId,
  user,
  addItem,
  removeItem,
  deleteCartItem,
  updateQuantity,
  setPlaceOrder,
  placeOrder,
}) {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [itemLeft, setItemLeft] = useState(0);
  const [inCart, setInCart] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const subTotal = price * quantity;

  //add item to localStorage Orders
  // const handleItem = () => {
  //   // setIsOrdered(prev => !prev);
  //   // updateCart(0);
  //   const item = {
  //     id: cartId,
  //     productName: product.productName,
  //     imageUrl: product.imageUrl,
  //     productId: product.productId,
  //     quantity: quantity,
  //     price: price,
  //   };

  //   if (!inCart) {
  //     setInCart(true);
  //     addItem(item);
  //   } else {
  //     setInCart(false);
  //     removeItem(item.id);
  //   }
  // };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setPlaceOrder(
        placeOrder.map(item => {
          if (item._id === cartId) {
            item.quantity--;
          }
          return item;
        })
      );
      updateCart(-1);
    }
  };

  const handleIncrement = () => {
    if (itemLeft > quantity) {
      setQuantity(quantity + 1);
      setPlaceOrder(
        placeOrder.map(item => {
          if (item._id === cartId) {
            item.quantity++;
          }
          return item;
        })
      );
      updateCart(1);
    }
  };

  const addToPlaceOrder = async () => {
    try {
      if (!isOrdered) {
        const add = await fetch(`${process.env.REACT_APP_API_URL}/cart/update/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            isOrdered: true,
          }),
        });
        const res = await add.json();
        if (res !== null) {
          setPlaceOrder([...placeOrder, res]);
          setIsOrdered(true);
        }
      } else {
        const remove = await fetch(`${process.env.REACT_APP_API_URL}/cart/update/${cartId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            isOrdered: false,
          }),
        });
        const res2 = await remove.json();
        if (res2 !== null) {
          setPlaceOrder(
            placeOrder.filter(item => {
              return item._id !== cartId;
            })
          );
          setIsOrdered(false);
        }
      }
    } catch (error) {}
  };

  const updateCart = async num => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/cart/update/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quantity: quantity + num,
          subTotal: quantity * price,
          isOrdered: isOrdered,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("Orders"));
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
        setItemLeft(result.productLeft);
        setIsOrdered(result.data.isOrdered);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [user.id, cartId]);

  return (
    <div className="cart-card ">
      <div className="cart-card-header">
        {isOrdered ? (
          <input type="checkbox" className="check-box" onClick={addToPlaceOrder} defaultChecked={true} />
        ) : (
          <input type="checkbox" className="check-box" onClick={addToPlaceOrder} />
        )}

        <span className=" item-remain">Remaining items: ( {itemLeft} )</span>
      </div>
      <div className="cart-card-body ">
        <div className="row m-0">
          <div className="col-12 col-sm col-md-4 d-flex p-0 ">
            <div className="img-container">
              <img className="" src={product.imageUrl} />
            </div>
            <p className="p-2 "> {product.productName}</p>
          </div>

          <div className="col-12 col-sm col-md product-details px-0 d-flex align-items-center justify-content-center ">
            {price.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
            <div className="button-group border border-secondary ">
              <button size="sm" className="px-2" onClick={handleDecrement}>
                -
              </button>
              <button size="sm" className="px-3  border-start border-end border-secondary">
                {quantity}
              </button>
              <button size="sm" className="px-2 " onClick={handleIncrement}>
                +
              </button>
            </div>
            <div className="d-inline ms-4">
              {subTotal.toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-2 action py-2">
            <Button
              variant="outline-dark"
              className={isOrdered ? "disabled" : ""}
              onClick={() => deleteCartItem([cartId])}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
