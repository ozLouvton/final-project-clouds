import React, { useEffect, useState } from "react";
import axios from "axios";

const backendURL = "http://server.com";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(backendURL + "/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(backendURL + "/api/users", {
        name,
        email,
      });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div>
      <h2>Final project clouds app</h2>
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Create User</button>
      </form>
      <h3>Users:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
