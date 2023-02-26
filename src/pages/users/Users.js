import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleViewCount = () => {
    setViewCount(viewCount + 10);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    const getData = async () => {
      try {
        const getUsers = await fetch(`${process.env.REACT_APP_API_URL}/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await getUsers.json();
        for (const items of result) {
          if (items.address === null) items.address = "not set";
          if (items.mobileNo === null) items.mobileNo = "not set";
        }
        setUsers(
          result.sort((a, b) => {
            let fa = a.firstName.toLowerCase(),
              fb = b.firstName.toLowerCase();

            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
            return 0;
          })
        );

        setViewCount(10);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (search.trim().length > 0) {
      const result = users.filter(
        user =>
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.address.toLowerCase().includes(search.toLowerCase()) ||
          user.mobileNo.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
      if (result.length > 0) {
        setFilterUser([...result]);
      }
    } else {
      setFilterUser(users);
    }
  }, [search, users]);

  if (loading) {
    return (
      <Container className="users">
        <Loading />
      </Container>
    );
  }
  return (
    <Container fluid="xl" className="users pt-5">
      <div className="table-wrapper bg-white">
        <div className="table-wrapper-header ">
          <input
            type="search"
            className="form-control form-control-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search . . ."
          />
        </div>
        <div className="table-wrapper-body">
          <table className=" table w-100 ">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Mobile No.</th>
                <th>Orders</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <TableBody data={filterUser} count={viewCount} />
          </table>
        </div>
      </div>
      {filterUser.length !== 0 && filterUser.length > viewCount && (
        <div className="my-5 text-center">
          <Button variant="outline-light" onClick={handleViewCount}>
            View More <i className="fa-solid fa-arrow-down"></i>
          </Button>
        </div>
      )}
    </Container>
  );
}

function TableBody({ data, count }) {
  return (
    <tbody>
      {data.slice(0, count).map(user => {
        return (
          <tr key={user._id}>
            <td className="last-name">{user.lastName}</td>
            <td className="first-name">{user.firstName}</td>
            <td>{user.email}</td>
            <td>{user.address || "not set"}</td>
            <td>{user.mobileNo || "not set"}</td>
            {/* <td>{JSON.stringify(user.isAdmin)}</td> */}
            <td>
              <Link to={`/users/${user._id}`} className="btn btn-sm btn-success">
                <i className="fa-solid fa-eye"></i>
              </Link>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
