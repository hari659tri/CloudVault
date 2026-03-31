const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ── REGISTER GET ─────────────────────────────────────
router.get("/register", (req, res) => {
  res.render("register");
});

// ── REGISTER POST ─────────────────────────────────────
router.post('/register',
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('firstName').trim().isLength({ min: 3 }),
  body('lastName').trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Invalid Data' });
    }
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ firstName, lastName, email, password: hashPassword });
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/home'); // ✅ redirect to home after register
  }
);

// ── LOGIN GET ─────────────────────────────────────────
router.get('/login', (req, res) => {
  res.render('login');
});

// ── LOGIN POST ────────────────────────────────────────
router.post('/login',
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Invalid data' });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password.trim(), user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.cookie('token', token, { httpOnly: true }); // ✅ save token in cookie
    res.redirect('/home'); // ✅ redirect to home after login
  }
);

// ── LOGOUT ────────────────────────────────────────────
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login');
});

module.exports = router;
