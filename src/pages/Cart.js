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
  // const newCart = [...cart];
  // console.log(newCart);
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
  const deleteCartItem = async cartId => {
    try {
      const items = JSON.parse(localStorage.getItem("Orders"));
      const deleteItem = await fetch(`${process.env.REACT_APP_API_URL}/cart/delete/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await deleteItem.json();
      console.log(result);
      if (result) {
        const newCart = cart.filter(item => {
          return item._id !== cartId[0];
        });
        // localStorage.setItem("Orders", JSON.stringify(newCart));
        setCart(newCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = async order => {
    try {
      const items = JSON.parse(localStorage.getItem("Orders"));
      const data = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(order),
      });

      if (data !== false) {
        const ids = items.map(item => {
          return item.id;
        });

        const deleteItem = await fetch(`${process.env.REACT_APP_API_URL}/cart/delete/${ids}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await deleteItem.json();

        if (result) {
          const cart = await fetch(`${process.env.REACT_APP_API_URL}/cart/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await cart.json();
          localStorage.setItem("Orders", "[]");
          setOrders(localStorage.getItem("Orders"));
          setCart(data);
        }
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
                deleteCartItem={deleteCartItem}
                updateQuantity={updateQuantity}
              />
            );
          })}
        </div>
        <div className="order-container">
          <div className="order-card ">
            <Orders data={orders} cart={cart} userId={user.id} placeOrder={placeOrder} />
          </div>
        </div>
      </div>
    </Container>
  );
}

function Orders({ data, cart, userId, placeOrder }) {
  const items = JSON.parse(data);
  console.log(items);
  const length = items.length;
  const multiply = items.map(item => {
    return item.quantity * item.price;
  });
  // console.log(items);
  const total = multiply.reduce((acc, curr) => acc + curr, 0);
  const products = items.map(item => {
    return {
      productId: item.productId,
      productName: item.productName,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      price: item.price,
      subTotal: item.price * item.quantity,
    };
  });
  // console.log(products);
  const createOrder = () => {
    const data = {
      userId: userId,
      products: products,
      totalAmount: total,
    };
    placeOrder(data);
  };
  return (
    <div className="order-amount px-3 py-2">
      <p className="mb-0">
        <span> Selected Item/s :</span> ({length}) out of ({cart.length})
      </p>
      <hr className="mt-0" />
      <p className="text-end">
        Total amount : {""}
        {total.toLocaleString("en-US", {
          style: "currency",
          currency: "PHP",
        })}
        <Button
          variant="outline-success"
          size="sm"
          onClick={createOrder}
          className={total === 0 ? "disabled ms-3" : "ms-3"}
        >
          Place Order
        </Button>
      </p>
    </div>
  );
}
