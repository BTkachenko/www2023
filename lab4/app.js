const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Note = require('./noteModel');
const authMiddleware = require('./authMiddleware');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to the database');
      const PORT = process.env.PORT || 3000;
      app.use(express.static(path.join(__dirname, 'public')));
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error('Database connection error:', error);
    });


const app = express();

app.use(bodyParser.json());

const User = require('./userModel');

app.post('/register', async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).json({ message: 'Email already in use' });
  }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: 'Email or password is incorrect' });
  }

  const isPasswordCorrect = await user.comparePasswords(req.body.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Email or password is incorrect' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

app.get('/note', authMiddleware, async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.get('/note/:id', authMiddleware, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

app.post('/note', authMiddleware, async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content
  });
  const savedNote = await newNote.save();
  res.json(savedNote);
});

app.put('/note/:id', authMiddleware, async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  res.json(updatedNote);
});

app.delete('/note/:id', authMiddleware, async (req, res) => {
  const deletedNote = await Note.findByIdAndRemove(req.params.id);
  res.json(deletedNote);
});


