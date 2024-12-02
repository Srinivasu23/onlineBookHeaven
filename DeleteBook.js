import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './DeleteBook.css'; // Optional: Add your styles here

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Fetch all books from the server when the component mounts
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
  const handleDeleteBook = async () => {
    if (!selectedBookId) {
      alert('No book selected for deletion');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/deletebook/${selectedBookId}`);
      alert('Book deleted successfully');
      console.log(response.data);
      
      // Remove the deleted book from the UI without a page reload
      setBooks(books.filter((book) => book._id !== selectedBookId));
      setSelectedBookId(null); // Reset the selected book ID
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Book</h2>
      <p>Select a book to delete:</p>

      {/* Dropdown or List of books to select for deletion */}
      <select
        onChange={(e) => setSelectedBookId(e.target.value)}
        value={selectedBookId || ''}
        className="book-dropdown"
      >
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title} - {book.author}
          </option>
        ))}
      </select>

      <button onClick={handleDeleteBook} disabled={!selectedBookId} className="delete-btn">
        Delete Book
      </button>
    </div>
  );
};

export default DeleteBook;
