import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [pdf, setPdf] = useState('');
  const navigate = useNavigate();

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/addbook', {
        title,
        author,
        description,
        pdf,
      });
      alert('Book added successfully');
      console.log(response.data);
      navigate('/admin');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  return (
    <div className="form-container">
      <h2>Add Book</h2>
      <form onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="PDF Link"
          value={pdf}
          onChange={(e) => setPdf(e.target.value)}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
