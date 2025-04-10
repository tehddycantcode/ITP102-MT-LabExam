document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let products = [];
    let categories = [];
    let currentPage = 1;
    const productsPerPage = 4;
    let filteredProducts = [];
    let cart = [];
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    
    // Apply theme from localStorage
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    }

    // Initialize the page
    initializePage();

    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme', isDarkTheme);
        localStorage.setItem('darkTheme', isDarkTheme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        if (isDarkTheme) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    async function initializePage() {
        try {
            // Fetch products and categories from the server
            await Promise.all([fetchProducts(), fetchCategories()]);
            
            // Initialize filtered products
            filteredProducts = [...products];
            
            // Render products
            renderProducts();
            
            // Render categories
            renderCategories();
            
            // Render featured carousel
            renderFeaturedCarousel();
            
            // Populate category filter
            populateCategoryFilter();
            
            // Setup event listeners
            setupEventListeners();
        } catch (error) {
            console.error('Error initializing page:', error);
            showNotification('Failed to load data. Please refresh the page.', 'error');
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch('get_products.php');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to sample data if fetch fails
            products = getSampleProducts();
            return products;
        }
    }

    async function fetchCategories() {
        try {
            const response = await fetch('get_categories.php');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            categories = await response.json();
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to sample categories if fetch fails
            categories = ["Running", "Casual", "Sports", "Formal", "Sandals", "Boots"];
            return categories;
        }
    }

    // Fallback sample data in case the server is not available
    function getSampleProducts() {
        return [
            {
                id: 1,
                name: "Running Pro",
                description: "High-performance shoes for serious runners. Featuring advanced cushioning technology and breathable mesh upper for maximum comfort during long runs.",
                price: 129.99,
                image: "./images/running pro.jpg", 
                stock: "In Stock",
                category: "Running"
            },
            {
                id: 2,
                name: "Urban Walk",
                description: "Stylish comfort for everyday wear. These versatile shoes combine modern design with all-day comfort, perfect for city life and casual outings.",
                price: 89.99,
                image: "./images/urban walk.jpg", 
                stock: "In Stock",
                category: "Casual"
            },
            {
                id: 3,
                name: "Executive",
                description: "Premium leather for formal occasions. Handcrafted from genuine leather with elegant detailing, these shoes make a statement in any professional setting.",
                price: 159.99,
                image: "./images/executive.jpg", 
                stock: "Low Stock",
                category: "Formal"
            },
            {
                id: 4,
                name: "Trail Master",
                description: "Durable boots for outdoor adventures. Designed with rugged terrain in mind, featuring water-resistant materials and superior grip for hiking and trekking.",
                price: 149.99,
                image: "./images/trail master.jpg", 
                stock: "In Stock",
                category: "Boots"
            },
            {
                id: 5,
                name: "Sport Pro",
                description: "Optimized for court sports performance. Lightweight with enhanced lateral support and non-marking soles, perfect for basketball, tennis, and volleyball.",
                price: 119.99,
                image: "./images/sport pro.jpg", 
                stock: "Out of Stock",
                category: "Sports"
            },
            {
                id: 6,
                name: "Comfort Slip",
                description: "Easy on-off for casual comfort. Featuring memory foam insoles and flexible outsoles, these slip-ons provide exceptional comfort for everyday wear.",
                price: 79.99,
                image: "./images/comfort slip.jpg", 
                stock: "In Stock",
                category: "Casual"
            }
        ];
    }
    

    function renderProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';
        
        if (paginatedProducts.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
            return;
        }
        
        paginatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        renderPagination();
    }

    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        let stockBadgeClass = '';
        if (product.stock === "In Stock") stockBadgeClass = 'in-stock';
        else if (product.stock === "Low Stock") stockBadgeClass = 'low-stock';
        else stockBadgeClass = 'out-of-stock';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                <div class="product-meta">
                    <span class="price">$${parseFloat(product.price).toFixed(2)}</span>
                    <span class="stock-badge ${stockBadgeClass}">${product.stock}</span>
                </div>
            </div>
            <button class="add-to-cart" ${product.stock === "Out of Stock" ? 'disabled' : ''}>
                ${product.stock === "Out of Stock" ? 'Out of Stock' : 'Add to Cart'}
            </button>
        `;
        
        return productCard;
    }

    function renderPagination() {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';
        
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
        pagination.appendChild(prevButton);
        
        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
            });
            pagination.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
        pagination.appendChild(nextButton);
    }

    function renderCategories() {
        const categoryBadges = document.querySelector('.category-badges');
        categoryBadges.innerHTML = '';
        
        categories.forEach(category => {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = category;
            badge.addEventListener('click', () => {
                document.getElementById('categoryFilter').value = category;
                filterProducts();
            });
            categoryBadges.appendChild(badge);
        });
    }

    function renderFeaturedCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        carouselTrack.innerHTML = '';
        
        // Get featured products (first 4 for this example)
        const featuredProducts = products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            
            const productCard = createProductCard(product);
            carouselItem.appendChild(productCard);
            
            carouselTrack.appendChild(carouselItem);
        });
        
        // Setup carousel navigation
        setupCarouselNavigation();
    }

    function setupCarouselNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const track = document.querySelector('.carousel-track');
        const items = document.querySelectorAll('.carousel-item');
        
        if (items.length === 0) return;
        
        const itemWidth = items[0].offsetWidth;
        let position = 0;
        
        prevBtn.addEventListener('click', () => {
            position += itemWidth;
            if (position > 0) position = 0;
            track.style.transform = `translateX(${position}px)`;
        });
        
        nextBtn.addEventListener('click', () => {
            position -= itemWidth;
            const minPosition = -(itemWidth * (items.length - 1));
            if (position < minPosition) position = minPosition;
            track.style.transform = `translateX(${position}px)`;
        });
    }

    function populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchBtn.addEventListener('click', () => {
            filterProducts();
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
        
        // Filter dropdowns
        document.getElementById('categoryFilter').addEventListener('change', filterProducts);
        document.getElementById('priceFilter').addEventListener('change', filterProducts);
        document.getElementById('stockFilter').addEventListener('change', filterProducts);
        
        // Product card click for modal
        document.querySelector('.products-grid').addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(productCard.dataset.id);
                openProductModal(productId);
            }
        });
        
        // Carousel product card click for modal
        document.querySelector('.carousel-track').addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(productCard.dataset.id);
                openProductModal(productId);
            }
        });
        
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart') && !e.target.disabled) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.dataset.id);
                    addToCart(productId);
                }
            }
        });
        
        // Close modal
        document.querySelector('.close-modal').addEventListener('click', closeProductModal);
        
        // Modal background click to close
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('productModal')) {
                closeProductModal();
            }
        });
        
        // Login form validation
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
        
        // Toggle password visibility
        document.querySelector('.toggle-password').addEventListener('click', togglePasswordVisibility);
        
        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            subscribeToNewsletter();
        });
    }

    function filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const stockFilter = document.getElementById('stockFilter').value;
        
        filteredProducts = products.filter(product => {
            // Search term filter
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm);
            
            // Category filter
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            
            // Price filter
            let matchesPrice = true;
            if (priceFilter !== 'all') {
                const [min, max] = priceFilter.split('-');
                if (max) {
                    matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
                } else {
                    matchesPrice = product.price >= parseInt(min.replace('+', ''));
                }
            }
            
            // Stock filter
            const matchesStock = stockFilter === 'all' || product.stock === stockFilter;
            
            return matchesSearch && matchesCategory && matchesPrice && matchesStock;
        });
        
        currentPage = 1;
        renderProducts();
    }

    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const modalBody = document.querySelector('.modal-body');
        
        let stockBadgeClass = '';
        if (product.stock === "In Stock") stockBadgeClass = 'in-stock';
        else if (product.stock === "Low Stock") stockBadgeClass = 'low-stock';
        else stockBadgeClass = 'out-of-stock';
        
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-details">
                <h2 class="modal-title">${product.name}</h2>
                <p class="modal-description">${product.description}</p>
                <div class="modal-price">$${parseFloat(product.price).toFixed(2)}</div>
                <span class="modal-stock stock-badge ${stockBadgeClass}">${product.stock}</span>
                
                <div class="modal-actions">
                    <div class="modal-quantity">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="10">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <button class="modal-add-to-cart" ${product.stock === "Out of Stock" ? 'disabled' : ''}>
                        ${product.stock === "Out of Stock" ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
        
        // Setup quantity buttons
        const quantityInput = modalBody.querySelector('.quantity-input');
        modalBody.querySelector('.minus-btn').addEventListener('click', () => {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
        
        modalBody.querySelector('.plus-btn').addEventListener('click', () => {
            if (quantityInput.value < 10) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            }
        });
        
        // Setup add to cart button
        modalBody.querySelector('.modal-add-to-cart').addEventListener('click', () => {
            if (product.stock !== "Out of Stock") {
                const quantity = parseInt(quantityInput.value);
                addToCart(product.id, quantity);
                closeProductModal();
            }
        });
        
        // Show modal
        document.getElementById('productModal').style.display = 'block';
    }

    function closeProductModal() {
        document.getElementById('productModal').style.display = 'none';
    }

    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product || product.stock === "Out of Stock") return;
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartUI();
        showNotification(`${product.name} added to cart!`);
    }

    function updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotal.textContent = '$0.00';
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Add remove item event listeners
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.id);
                    removeFromCart(itemId);
                });
            });
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
            checkoutBtn.disabled = false;
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        
        notificationMessage.textContent = message;
        notification.className = 'notification show';
        
        if (type === 'error') {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    async function handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        
        let isValid = true;
        
        // Reset errors
        usernameError.style.display = 'none';
        passwordError.style.display = 'none';
        
        // Validate username
        if (username.trim() === '') {
            usernameError.textContent = 'Username is required';
            usernameError.style.display = 'block';
            isValid = false;
        }
        
        // Validate password
        if (password === '') {
            passwordError.textContent = 'Password is required';
            passwordError.style.display = 'block';
            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordError.style.display = 'block';
            isValid = false;
        }
        
        if (isValid) {
            try {
                const response = await fetch('auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Login successful!');
                    
                    // Redirect to dashboard if username is admin
                    if (username.toLowerCase() === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else {
                        // Clear form
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    }
                } else {
                    showNotification(data.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                
                // Fallback for demo purposes if server is not available
                if (username.toLowerCase() === 'admin' && password === 'password123') {
                    showNotification('Login successful!');
                    window.location.href = 'dashboard.html';
                } else {
                    showNotification('Invalid username or password', 'error');
                }
            }
        }
    }

    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.querySelector('.toggle-password i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.classList.remove('fa-eye');
            toggleBtn.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleBtn.classList.remove('fa-eye-slash');
            toggleBtn.classList.add('fa-eye');
        }
    }

    function subscribeToNewsletter() {
        const email = document.getElementById('newsletterEmail').value;
        
        if (email) {
            showNotification('Thank you for subscribing to our newsletter!');
            document.getElementById('newsletterEmail').value = '';
        }
    }

    // Load cart from localStorage on page load
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }

    // Call loadCart on initialization
    loadCart();
});