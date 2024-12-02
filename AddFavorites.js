import React, { useState } from 'react';
import axios from 'axios';

const AddFavorites = ({ userId, bookId }) => {
  const handleAddToFavorites = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/addfavorites/users/${userId}/favorites`,
        { bookId }
      );
      alert('Book added to favorites');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add book to favorites');
    }
  };

  return (
    <button onClick={handleAddToFavorites}>Add to Favorites</button>
  );
};

export default AddFavorites;
