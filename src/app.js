const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Middleware
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms | Body: :body | Query: :query | Headers: :headers', { stream: accessLogStream }));
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('query', (req) => JSON.stringify(req.query));
morgan.token('headers', (req) => JSON.stringify(req.headers));

// Routes
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');

app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrowings', borrowingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
