import { useState, useContext } from "react";
import { Button, Container } from "react-bootstrap";
import UserContext from "../UserContext";
import CartCard from "../components/CartCard";
import "./Cart.css";

export default function Cart() {
  if (localStorage.getItem("Orders") === null) {
    localStorage.setItem("Orders", "[]");
  }
  const { cart, setCart, user } = useContext(UserContext);
  const [orders, setOrders] = useState(localStorage.getItem("Orders"));

  //add nwe item to Orders storage
  const addItem = newItem => {
    const items = JSON.parse(localStorage.getItem("Orders"));

    if (items !== null) {
      items.push(newItem);
      localStorage.setItem("Orders", JSON.stringify(items));
    } else {
      localStorage.setItem("Orders", JSON.stringify(newItem));
    }
    setOrders(localStorage.getItem("Orders"));
  };

  //remove item from Orders storage
  const removeItem = itemId => {
    const items = JSON.parse(localStorage.getItem("Orders"));

    const newItem = items.filter(item => {
      return item.id !== itemId;
    });
    localStorage.setItem("Orders", JSON.stringify(newItem));
    setOrders(localStorage.getItem("Orders"));
  };

  //update item quantity
  const updateQuantity = (itemId, quantity) => {
    const items = JSON.parse(localStorage.getItem("Orders"));

    const update = items.map(item => {
      if (item.id === itemId) {
        item.quantity = item.quantity + quantity;
      }
      return item;
    });

    localStorage.setItem("Orders", JSON.stringify(update));
    setOrders(localStorage.getItem("Orders"));
  };

  //delete items from cart
  const deleteCart = async id => {
    try {
      const deleteCart = await fetch(`${process.env.REACT_APP_API_URL}/cart/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await deleteCart.json();
      if (result) {
        const newCart = cart.filter(item => {
          return item._id !== id;
        });
        setCart(newCart);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container fluid={"lg"} className="cart pb-5 px-4">
      <div className="cart-wrapper row mt-5 ">
        <div className="card-container col p-0 mb-2">
          {cart.map(items => {
            return (
              <CartCard
                key={items._id}
                cartId={items._id}
                user={user.id}
                addItem={addItem}
                removeItem={removeItem}
                deleteCart={deleteCart}
                updateQuantity={updateQuantity}
              />
            );
          })}
        </div>
        <div className="order-container">
          <div className="order-card ">
            <Orders data={orders} cart={cart} />
          </div>
        </div>
      </div>
    </Container>
  );
}
function Orders({ data, cart }) {
  const items = JSON.parse(data);
  const length = items.length;
  const multiply = items.map(item => {
    return item.quantity * item.price;
  });

  const sum = multiply.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="order-amount px-3 py-2">
      <p className="mb-0">
        <span> Selected Item/s :</span> ({length}) out of ({cart.length})
      </p>
      <hr className="mt-0" />
      <p className="text-end">
        Total amount : {""}
        {sum.toLocaleString("en-US", {
          style: "currency",
          currency: "PHP",
        })}
        <Button variant="outline-success" size="sm" className={sum === 0 ? "disabled ms-3" : "ms-3"}>
          Place Order
        </Button>
      </p>
    </div>
  );
}
