const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// public route for authentication
app.use('/auth', require('./routes/auth'));

// auth middleware for protected routes
app.use(require('./middleware/auth'));

// users routes
app.use('/users', require('./routes/users'));

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});