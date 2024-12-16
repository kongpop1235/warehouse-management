const express = require('express');
const connectDB = require('./database');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productOrderHistoryRoutes = require('./routes/productOrderHistoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-order-history', productOrderHistoryRoutes);
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
    res.send('Warehouse Management API is running');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
