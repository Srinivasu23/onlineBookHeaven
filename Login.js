import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const { userId, role } = response.data; // Assuming the backend returns userId and role
      alert('Login successful');

      // Save the userId to localStorage
      localStorage.setItem('userId', userId);

      if (username === 'admin@gmail.com') {
        navigate('/admin'); // Redirect to Admin Dashboard if admin
      } else {
        navigate(`/customer-dashboard/${userId}`); // Redirect to Customer Dashboard with userId
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link to="/register" className="link">Register</Link>
      </p>
    </div>
  );
};

export default Login;
