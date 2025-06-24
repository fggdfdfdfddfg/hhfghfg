const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// In-memory database for demo purposes
let orders = {};
let orderCounter = 1;

// API Routes
app.post('/api/orders', (req, res) => {
    const orderId = orderCounter++;
    const order = {
        ...req.body,
        id: orderId,
        status: 'Processing',
        date: new Date().toISOString()
    };
    
    orders[orderId] = order;
    
    res.json({
        success: true,
        orderId: orderId
    });
});

app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const order = orders[orderId];
    
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});