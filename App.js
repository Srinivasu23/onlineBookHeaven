import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboardFile';
import CustomerDashboard from './components/CustomerDashboard';
import AddBook from './components/AddBook';  
import DeleteBook from './components/DeleteBook'; 
import AddFavorites from './components/AddFavorites';
import './App.css';  
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer-dashboard/:userId" element={<CustomerDashboard />} />
          <Route path="/addfavorites/users/:userId/favorites" element={<AddFavorites />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/deletebook/:bookId" element={<DeleteBook />} />
          {/* Other routes can go here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
