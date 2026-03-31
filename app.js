const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST be first

const express = require('express');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const userRoute = require('./routes/user.routes');
const fileRoute = require('./routes/file.routes');
const path = require('path');

connectToDB();

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── ROUTES ────────────────────────────────────────────
app.use('/user', userRoute);
app.use('/file', fileRoute);

// ── HOME PAGE (protected) ─────────────────────────────
app.get('/home', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/user/login'); // ✅ not logged in → go to login
  res.render('home'); // ✅ render home.ejs
});

// ── ROOT → redirect to login ──────────────────────────
app.get('/', (req, res) => {
  res.redirect('/user/login');
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
