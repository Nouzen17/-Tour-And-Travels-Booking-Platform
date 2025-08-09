// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// === Load environment variables ===
dotenv.config();

// === Constants ===
const PORT = process.env.PORT || 1670;
const MONGO_URI = process.env.MONGO_URI || 'your_mongodb_connection_string';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
app.use(express.json());

// === Connect to MongoDB ===
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// === User Model ===
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'user' or 'admin'
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// === Middleware: Token Required ===
const tokenRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token is missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ message: 'Your account is blocked. Contact admin.' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

// === Middleware: Admin Only ===
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// === Routes ===

// DELETE User
app.delete('/api/admin/users/:id', tokenRequired, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// BLOCK User
app.put('/api/admin/users/:id/block', tokenRequired, adminOnly, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UNBLOCK User
app.put('/api/admin/users/:id/unblock', tokenRequired, adminOnly, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
