import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerDashboard.css'; 

const CustomerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Retrieve userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      alert('User ID is missing. Please log in again.');
      return;
    }

    // Fetch all books
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allbooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    // Fetch favorite books
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}/favorites`);
        setFavorites(response.data.favorites || []);
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      }
    };

    fetchBooks();
    fetchFavorites();
  }, [userId]);

  const handleAddToFavorites = async (bookId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/addfavorites/users/${userId}/favorites`,
        { bookId }
      );
      alert(response.data.message);
      if (response.data.message === 'Book added to favorites') {
        setFavorites((prevFavorites) => [...prevFavorites, bookId]);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/removefavorites/users/${userId}/favorites`,
        { data: { bookId } } // Send bookId in request body
      );
      alert(response.data.message);
      if (response.data.message === 'Book removed from favorites') {
        setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== bookId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites');
    }
  };

  const toggleFavoritesView = () => setShowFavorites((prev) => !prev);

  const displayedBooks = showFavorites
    ? books.filter((book) => favorites.includes(book._id))
    : books;

  return (
    <div className="customer-dashboard">
      <h2>Customer Dashboard</h2>
      <button onClick={toggleFavoritesView} className="toggle-favorites-btn">
        {showFavorites ? 'Show All Books' : 'Show Favorites'}
      </button>
      <div className="books-grid">
        {displayedBooks.map((book) => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p>{book.description}</p>
            <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="view-link">
              View PDF
            </a>
            {showFavorites ? (
              <button
                className="remove-from-favorites-btn"
                onClick={() => handleRemoveFromFavorites(book._id)}
              >
                Remove from Favorites
              </button>
            ) : (
              <button
                className="add-to-favorites-btn"
                onClick={() => handleAddToFavorites(book._id)}
              >
                Add to Favorites
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
