import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Optional: Add your styles here

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Hook for redirection

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allbooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  // Handle book deletion
  const handleDeleteBook = async (bookId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deletebook/${bookId}`);
      alert('Book deleted successfully');
      
      // Update the UI by removing the deleted book
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  // Redirect to "view all books" page after adding a new book
  const handleAddBook = async (newBook) => {
    try {
      await axios.post('http://localhost:5000/addbook', newBook);
      alert('Book added successfully');
      
      // After adding, redirect to the page that lists all books
      navigate('/admin');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-options">
        <Link to="/addbook">
          <button>Add Book</button>
        </Link>
        {/* <Link to="/deletebook">
          <button>Delete Book</button>
        </Link> */}
      </div>
      <h3>All Books</h3>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.description}</p>
            <a href={book.pdf} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
            <button onClick={() => handleDeleteBook(book._id)} className="delete-btn">
              Delete Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
