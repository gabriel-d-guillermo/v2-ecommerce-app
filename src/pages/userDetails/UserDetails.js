import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import "./UserDetails.css";

export default function UserDetails() {
  const { userId } = useParams();

  const [userOrders, setUserOrders] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    const getData = async () => {
      try {
        const fetchUserData = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const fetchUserOrders = await fetch(`${process.env.REACT_APP_API_URL}/orders/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await fetchUserData.json();
        const orders = await fetchUserOrders.json();
        setUserOrders(orders);
        setUserDetails({ ...data });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getData();
  }, [userId]);

  if (loading) {
    return (
      <Container className="users">
        <Loading />
      </Container>
    );
  }
  return (
    <Container className="user-details">
      <div className="details ">
        <div>
          <div className="detail-group">
            User Full Name : {userDetails.firstName} {userDetails.lastName}
          </div>
        </div>
        <div className="user-orders">
          {userOrders.length === 0 ? (
            <div>
              <h5 className="text-center">No orders to display!</h5>
            </div>
          ) : (
            <ul className="order-details">
              {userOrders.map(order => {
                const date = new Date(order.purchasedOn);
                return (
                  <li key={order._id}>
                    <Orders data={order} date={date} />
                    <hr />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}

function Orders({ data, date }) {
  return (
    <>
      <p>
        Purchased On: <u>{`${date.toDateString()} / ${date.toLocaleTimeString()}`}</u>
      </p>
      <ul className="product-list">
        {data.products.map(product => {
          return (
            <li key={product.productId}>
              {product.productName} - {""}
              <span>
                {product.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PHP",
                })}{" "}
                x {product.quantity}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
