const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const cors = require('cors');

const app = express();


app.use(express.json());

app.use(cors());


mongoose.connect('mongodb://localhost:27017/bookheaven',
    // {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true}
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });


app.post('/addbook', async (req, res) => {
  const { title, author, description, pdf } = req.body;

  try {

    if (!title || !author || !description || !pdf) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    
    const book = new Book({
      title,
      author,
      description,
      pdf
    });

    await book.save();
    const books = await Book.find();
    res.status(201).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password ,confirmPassword } = req.body;

  try {
    
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    
    const user = new User({
      username,
      email,
      password,
      confirmPassword
    });

    await user.save();
    return res.status(201).json({ message: 'User  registered successfully', users: await User.find() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user is an admin
  if (username === 'admin@gmail.com' && password === 'admin') {
    return res.status(200).json({
      userId: null, // Admin doesn't have a userId in the database
      message: 'Login successful! Redirecting to admin dashboard...',
    });
  }

  // Check for regular users in the database
  User.findOne({ email: username, password: password })
    .then(user => {
      if (user) {
        return res.status(200).json({
          userId: user._id, // Send userId to frontend
          message: 'Login successful! Welcome back!',
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    });
});

  app.get('/allbooks', async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error });
    }
  });
  app.delete('/deletebook/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book deleted successfully', deletedBook });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book', error });
    }
  });
  // Route to add a book to a user's favorites
app.post('/addfavorites/users/:userId/favorites', async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;

  try {
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (!user.favorites.includes(bookId)) {
      user.favorites.push(bookId);
      await user.save();
      return res.status(200).json({ message: 'Book added to favorites', favorites: user.favorites });
    }

    res.status(400).json({ message: 'Book is already in favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites', error });
  }
});
app.get('/users/:userId/favorites', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites'); // Populate favorites
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    res.status(500).json({ message: 'Error fetching favorites', error });
  }
});
// Backend: Remove book from favorites
app.delete('/removefavorites/users/:userId/favorites', async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId } = req.body; // Extract bookId from request body

    // Update user document to remove the bookId from favorites
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: bookId } }, // MongoDB $pull operator
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Book removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(5000, () => console.log('Listening on port 5000'));