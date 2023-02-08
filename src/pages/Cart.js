import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import UserContext from "../UserContext";
import CartCard from "../components/CartCard";
import Swal from "sweetalert2";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, setCart, user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  const updateCartItems = async () => {
    try {
      const cart = await fetch(`${process.env.REACT_APP_API_URL}/cart/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await cart.json();
      setCart(data);
    } catch (error) {
      console.log(error);
    }
  };

  //delete items from cart
  const deleteCartItem = async cartId => {
    try {
      const deleteItem = await fetch(`${process.env.REACT_APP_API_URL}/cart/delete/${cartId}`, {
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
        setCart(data);
        return true;
      } else {
        Swal.fire({
          position: "top",
          icon: "warning",
          title: "Something went wrong!",
          showConfirmButton: true,
        });
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrders = async order => {
    try {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(order),
      });

      if (data !== false) {
        const ids = orders.map(item => {
          return item._id;
        });
        const deleteItems = await deleteCartItem(ids);
        if (deleteItems) {
          Swal.fire({
            position: "top",
            icon: "success",
            text: "Transaction Success!!",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get cart item that has been selected
  useEffect(() => {
    setOrders(
      cart.filter(item => {
        return item.isOrdered === true;
      })
    );
  }, [cart]);

  if (user.id !== undefined && user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  if (user.id === null && user.isAdmin === null) {
    return <Navigate to="/" />;
  }
  return user.id !== undefined && !user.isAdmin ? (
    <Container fluid={"lg"} className="cart pb-5 px-4">
      <div className="cart-wrapper row mt-5 ">
        <div className="card-container col p-0 mb-2">
          {cart.map(items => {
            return (
              <CartCard
                key={items._id}
                cartId={items._id}
                user={user.id}
                deleteCartItem={deleteCartItem}
                setOrders={setOrders}
                orders={orders}
                updateCartItems={updateCartItems}
              />
            );
          })}
        </div>
        <div className="order-container">
          <div className="order-card ">
            <Orders orders={orders} cart={cart} user={user} placeOrders={placeOrders} navigate={navigate} />
          </div>
        </div>
      </div>
    </Container>
  ) : (
    <Container className="cart"></Container>
  );
}

function Orders({ orders, cart, user, placeOrders, navigate }) {
  const length = orders.length;
  const multiply = orders.map(item => {
    return item.quantity * item.price;
  });

  const total = multiply.reduce((acc, curr) => acc + curr, 0);
  const products = orders.map(item => {
    return {
      productId: item.productId,
      productName: item.productName,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      price: item.price,
      subTotal: item.price * item.quantity,
    };
  });

  const handleOrder = () => {
    const data = {
      userId: user.id,
      products: products,
      totalAmount: total,
    };
    if (user.address === null) {
      Swal.fire({
        position: "top",
        icon: "warning",
        title: "Your Action Cannot Be Processed!",
        text: "Address and mobile number is empty",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Update Account",
      }).then(result => {
        if (result.isConfirmed) {
          navigate("/account");
        }
      });
      return;
    } else {
      placeOrders(data);
    }
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
          onClick={handleOrder}
          className={total === 0 ? "disabled ms-3" : "ms-3"}
        >
          Place Order
        </Button>
      </p>
    </div>
  );
}
