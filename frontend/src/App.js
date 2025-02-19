import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  return (
    <Router>
      <div className='container'>
        <h1>User Management</h1>

        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/update/:id" element={<UpdatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

function UserList() {
  const navigate = useNavigate();

  // Users list state 
  const [users, setUsers] = useState([]);
  // User state
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });


  // Get all users from back-end using axios
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  // Fetch user when app mountss
  useEffect(() => {
    getUsers();
  })

  // Add new user
  const addUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users', newUser);
      setUsers([...users, response.data]);

      // Clear the form
      setNewUser({ name: '', email: '', phone: '' });

      // Refresh users list
      getUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete('http://localhost:5000/users/' + id);
      setUsers(users.filter(user => user._id !== id));

      // Refresh users list
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  return (
    <div>
      <h2>Users List</h2>
      <table border="1" width={'580px'}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => navigate(`/update/${user._id}`)}>Edit</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <h2>Add User</h2>

      <form onSubmit={addUser}>
        <input type="text" placeholder="Name" value={newUser.name} required onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input type="email" placeholder="Email" value={newUser.email} required onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input type="tel" placeholder="Phone" value={newUser.phone} required onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function UpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Updated user state
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '', phone: '' });


  // Get one user from back-end using axios
  const getUser = async (id) => {
    try {
      const response = await axios.get('http://localhost:5000/users/' + id);
      setUpdatedUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  // Get user when component mounts
  useEffect(() => {
    getUser(id);
  }, [id]);

  // Update user
  const updateUser = async (e) => {
    e.preventDefault();

    try {
      await axios.put('http://localhost:5000/users/' + id, updatedUser);

      // Clear the form
      setUpdatedUser({ name: '', email: '', phone: '' });

      // Redirect to users list
      navigate(`/`);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }


  return (
    <div>
      <button onClick={() => navigate(`/`)}>Back</button> &nbsp; <h2>Update User</h2>
      <form onSubmit={updateUser}>
        <input type="text" placeholder="Name" value={updatedUser.name} required onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })} />
        <input type="email" placeholder="Email" value={updatedUser.email} required onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })} />
        <input type="tel" placeholder="Phone" value={updatedUser.phone} required onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
