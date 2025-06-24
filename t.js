// Sample products data
const products = [
    { id: 1, name: "Laptop", price: 999.99, description: "High-performance laptop", image: "https://via.placeholder.com/300" },
    { id: 2, name: "Smartphone", price: 699.99, description: "Latest smartphone model", image: "https://via.placeholder.com/300" },
    { id: 3, name: "Headphones", price: 199.99, description: "Noise-cancelling headphones", image: "https://via.placeholder.com/300" },
    { id: 4, name: "Smartwatch", price: 249.99, description: "Fitness tracking smartwatch", image: "https://via.placeholder.com/300" }
];

// DOM elements
const productGrid = document.querySelector('.product-grid');
const orderFormSection = document.getElementById('order-form');
const orderForm = document.getElementById('orderForm');
const orderConfirmationSection = document.getElementById('order-confirmation');
const orderTrackingSection = document.getElementById('order-tracking');
const orderIdSpan = document.getElementById('order-id');
const trackOrderBtn = document.getElementById('track-order');
const newOrderBtn = document.getElementById('new-order');
const trackBtn = document.getElementById('track-btn');
const trackingIdInput = document.getElementById('tracking-id');
const orderDetailsDiv = document.getElementById('order-details');

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="order-btn" data-id="${product.id}">Order Now</button>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to order buttons
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            showOrderForm(product);
        });
    });
}

// Show order form with selected product
function showOrderForm(product) {
    document.getElementById('product').value = product.name;
    orderFormSection.classList.remove('hidden');
    productGrid.classList.add('hidden');
    window.scrollTo(0, 0);
}

// Handle form submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        product: document.getElementById('product').value,
        quantity: parseInt(document.getElementById('quantity').value),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        status: "Processing",
        date: new Date().toISOString()
    };
    
    try {
        // In a real app, you would send this to your backend
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        // For demo purposes, we'll generate a random ID
        const orderId = result.orderId || Math.floor(Math.random() * 1000000);
        orderIdSpan.textContent = orderId;
        
        orderFormSection.classList.add('hidden');
        orderConfirmationSection.classList.remove('hidden');
        
        // Store order ID in localStorage for demo
        localStorage.setItem('currentOrderId', orderId);
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('There was an error submitting your order. Please try again.');
    }
});

// Track order button
trackOrderBtn.addEventListener('click', () => {
    orderConfirmationSection.classList.add('hidden');
    orderTrackingSection.classList.remove('hidden');
    trackingIdInput.value = localStorage.getItem('currentOrderId') || '';
});

// New order button
newOrderBtn.addEventListener('click', () => {
    orderConfirmationSection.classList.add('hidden');
    productGrid.classList.remove('hidden');
    orderForm.reset();
});

// Track button
trackBtn.addEventListener('click', async () => {
    const orderId = trackingIdInput.value.trim();
    if (!orderId) return;
    
    try {
        // In a real app, you would fetch from your backend
        const response = await fetch(`/api/orders/${orderId}`);
        const order = await response.json();
        
        if (order) {
            orderDetailsDiv.innerHTML = `
                <h3>Order #${orderId}</h3>
                <p><strong>Product:</strong> ${order.product}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p><strong>Customer:</strong> ${order.name}</p>
                <p><strong>Shipping to:</strong> ${order.address}</p>
            `;
            orderDetailsDiv.classList.remove('hidden');
        } else {
            orderDetailsDiv.innerHTML = `<p>Order not found. Please check your order ID.</p>`;
            orderDetailsDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        orderDetailsDiv.innerHTML = `<p>There was an error fetching your order details.</p>`;
        orderDetailsDiv.classList.remove('hidden');
    }
});

// Initialize the page
displayProducts();