// server.js
const express = require('express');
const connectDB = require('./database');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // เพื่ออ่านข้อมูล JSON จาก body ของ request

// Routes
app.use('/api/products', productRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Warehouse Management API is running');
});

// Define the port to run the server
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
