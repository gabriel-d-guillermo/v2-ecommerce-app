import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../UserContext";

export default function Logout() {
  const { unsetUser, setUser, setCart } = useContext(UserContext);

  //delete token
  unsetUser();

  useEffect(() => {
    setUser({ id: null, isAdmin: null, address: null });
    setCart([]);
  }, [setUser, setCart]);

  return <Navigate to="/" />;
}
