document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
        
        // Update theme radio button in settings
        if (document.getElementById('darkTheme')) {
            document.getElementById('darkTheme').checked = true;
        }
    }

    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDark);
        
        const themeIcon = this.querySelector('i');
        if (isDark) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            if (document.getElementById('darkTheme')) {
                document.getElementById('darkTheme').checked = true;
            }
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            if (document.getElementById('lightTheme')) {
                document.getElementById('lightTheme').checked = true;
            }
        }
        
        // Update charts when theme changes
        updateChartsTheme();
    });

    // Animate counters
    animateCounters();

    // Initialize charts
    initCharts();

    // Load sample data
    loadSampleData();

    // Add event listeners
    setupEventListeners();

    // Add event listener to close modals
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function () {
            console.log('Close button clicked');
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none'; // Hide the modal
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none'; 
            }
        });
    });
});

// Sample data for the dashboard
const sampleProducts = [
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
    },
    {
        id: 7,
        name: "Slides",
        description: "Open-toe footwear with loose heel that holds on to the foot from the front. Perfect for beach days and casual summer outings.",
        price: 69.99,
        image: "./images/slides.avif",
        stock: "In Stock",
        category: "Sandals"
    },
    {
        id: 8,
        name: "Female Heels",
        description: "Raised sole to elevate wearer's foot and enhance their appearance. Elegant design with comfortable padding for extended wear.",
        price: 129.99,
        image: "./images/heels.jpg",
        stock: "Out of Stock",
        category: "Formal"
    }
];

const sampleOrders = [
    {
        id: "ORD-10001",
        customer: "John Dexter",
        date: "2025-04-08",
        total: 129.99,
        status: "delivered",
        payment: "Credit Card",
        items: [
            { id: 1, name: "Running Pro", price: 129.99, quantity: 1 }
        ],
        shipping: {
            address: "123 Main St, Anytown, AN 12345",
            method: "Standard Shipping",
            tracking: "TRK123456789"
        }
    },
    {
        id: "ORD-10002",
        customer: "Lori Lay",
        date: "2025-04-09",
        total: 239.98,
        status: "shipped",
        payment: "PayPal",
        items: [
            { id: 2, name: "Urban Walk", price: 89.99, quantity: 1 },
            { id: 6, name: "Comfort Slip", price: 79.99, quantity: 1 },
            { id: 7, name: "Slides", price: 69.99, quantity: 1 }
        ],
        shipping: {
            address: "456 Oak Ave, Somewhere, SW 67890",
            method: "Express Shipping",
            tracking: "TRK987654321"
        }
    },
    {
        id: "ORD-10003",
        customer: "Victor Magtanggol",
        date: "2025-04-10",
        total: 159.99,
        status: "processing",
        payment: "Credit Card",
        items: [
            { id: 3, name: "Executive", price: 159.99, quantity: 1 }
        ],
        shipping: {
            address: "789 Pine Rd, Elsewhere, EL 54321",
            method: "Standard Shipping",
            tracking: ""
        }
    },
    {
        id: "ORD-10004",
        customer: "Emily Willis",
        date: "2025-04-10",
        total: 149.99,
        status: "pending",
        payment: "Pending",
        items: [
            { id: 4, name: "Trail Master", price: 149.99, quantity: 1 }
        ],
        shipping: {
            address: "321 Cedar Ln, Nowhere, NW 13579",
            method: "Standard Shipping",
            tracking: ""
        }
    },
    {
        id: "ORD-10005",
        customer: "Michael Jordan",
        date: "2025-04-11",
        total: 199.98,
        status: "cancelled",
        payment: "Refunded",
        items: [
            { id: 5, name: "Sport Pro", price: 119.99, quantity: 1 },
            { id: 7, name: "Slides", price: 69.99, quantity: 1 }
        ],
        shipping: {
            address: "654 Maple Dr, Anytown, AN 12345",
            method: "Express Shipping",
            tracking: ""
        }
    }
];

const sampleCustomers = [
    {
        id: 1,
        name: "John Dexter",
        email: "john.dex@yahoo.com",
        phone: "(555) 123-4567",
        orders: 5,
        totalSpent: 649.95,
        status: "active"
    },
    {
        id: 2,
        name: "Lori Lay",
        email: "lori.lay@gmail.com",
        phone: "(555) 987-6543",
        orders: 3,
        totalSpent: 239.98,
        status: "active"
    },
    {
        id: 3,
        name: "Victor Magtanggol",
        email: "victor.hammer@yahoo.com",
        phone: "(555) 456-7890",
        orders: 1,
        totalSpent: 159.99,
        status: "active"
    },
    {
        id: 4,
        name: "Emily Willis",
        email: "emily.willis@ph.com",
        phone: "(555) 789-0123",
        orders: 2,
        totalSpent: 299.98,
        status: "inactive"
    },
    {
        id: 5,
        name: "Michael Jordan",
        email: "michael.jordan@gmail.com",
        phone: "(555) 234-5678",
        orders: 8,
        totalSpent: 1249.92,
        status: "vip"
    },
    {
        id: 6,
        name: "Sarah Nabati",
        email: "sarah.binati@gmail.com",
        phone: "(555) 345-6789",
        orders: 4,
        totalSpent: 499.96,
        status: "active"
    },
    {
        id: 7,
        name: "Bruce Lee",
        email: "bruce.lee@yahoo.com",
        phone: "(555) 567-8901",
        orders: 6,
        totalSpent: 899.94,
        status: "vip"
    },
    {
        id: 8,
        name: "Lisa Mae",
        email: "lisa.garcia@yahoo.com",
        phone: "(555) 678-9012",
        orders: 2,
        totalSpent: 259.98,
        status: "inactive"
    }
];

function loadSampleData() {
    // Load inventory data
    loadInventoryData();
    
    // Load orders data
    loadOrdersData();
    
    // Load customers data
    loadCustomersData();
}

function loadInventoryData() {
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    if (!inventoryTableBody) return;

    inventoryTableBody.innerHTML = '';

    sampleProducts.forEach(product => {
        const row = document.createElement('tr');

        let stockClass = '';
        if (product.stock === "In Stock") stockClass = 'in-stock';
        else if (product.stock === "Low Stock") stockClass = 'low-stock';
        else stockClass = 'out-of-stock';

        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="status-badge ${stockClass}">${product.stock}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        inventoryTableBody.appendChild(row);
    });

    // Attach event listeners for edit and delete buttons
    document.querySelectorAll('#inventoryTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            console.log('Edit button clicked for product ID:', this.getAttribute('data-id'));
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('#inventoryTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            console.log('Delete button clicked for product ID:', this.getAttribute('data-id'));
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });

    // Setup inventory pagination
    setupPagination('inventoryPagination', sampleProducts.length, 10, 1);
}

function loadOrdersData() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    ordersTableBody.innerHTML = '';
    
    // Update order counts
    updateOrderCounts();
    
    sampleOrders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = order.status;
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${formatDate(order.date)}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(order.status)}</span></td>
            <td>${order.payment}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${order.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${order.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${order.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    // Setup orders pagination
    setupPagination('ordersPagination', sampleOrders.length, 10, 1);
    
    // Add event listeners for order actions
    document.querySelectorAll('#ordersTableBody .view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            openOrderDetailsModal(orderId);
        });
    });
}

function updateOrderCounts() {
    // Count orders by status
    const pendingCount = sampleOrders.filter(order => order.status === 'pending').length;
    const processingCount = sampleOrders.filter(order => order.status === 'processing').length;
    const shippedCount = sampleOrders.filter(order => order.status === 'shipped').length;
    const deliveredCount = sampleOrders.filter(order => order.status === 'delivered').length;
    
    // Update the count elements
    document.getElementById('pendingOrdersCount').textContent = pendingCount;
    document.getElementById('processingOrdersCount').textContent = processingCount;
    document.getElementById('shippedOrdersCount').textContent = shippedCount;
    document.getElementById('deliveredOrdersCount').textContent = deliveredCount;
}

function loadCustomersData() {
    const customersTableBody = document.getElementById('customersTableBody');
    if (!customersTableBody) return;

    customersTableBody.innerHTML = '';

    sampleCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>$${customer.totalSpent.toFixed(2)}</td>
            <td><span class="status-badge ${customer.status}">${capitalizeFirstLetter(customer.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${customer.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${customer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${customer.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        customersTableBody.appendChild(row);
    });

    // Attach event listeners for view buttons
    document.querySelectorAll('#customersTableBody .view-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = parseInt(this.getAttribute('data-id'));
            viewCustomerDetails(customerId);
        });
    });
}

function updateCustomerCounts() {
    // Count customers by status
    const totalCustomers = sampleCustomers.length;
    const activeCustomers = sampleCustomers.filter(customer => customer.status === 'active').length;
    const vipCustomers = sampleCustomers.filter(customer => customer.status === 'vip').length;
    
    // Update the count elements
    document.getElementById('totalCustomersCount').textContent = totalCustomers;
    document.getElementById('activeCustomersCount').textContent = activeCustomers;
    document.getElementById('vipCustomersCount').textContent = vipCustomers;
    document.getElementById('newCustomersCount').textContent = Math.floor(totalCustomers * 0.15); // Simulate 15% new customers
}

function setupPagination(containerId, totalItems, itemsPerPage, currentPage) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        return;
    }
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            setupPagination(containerId, totalItems, itemsPerPage, currentPage - 1);
        }
    });
    container.appendChild(prevButton);
    
    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            setupPagination(containerId, totalItems, itemsPerPage, 1);
        });
        container.appendChild(firstPageButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            container.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.toggle('active', i === currentPage);
        pageButton.addEventListener('click', () => {
            setupPagination(containerId, totalItems, itemsPerPage, i);
        });
        container.appendChild(pageButton);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            container.appendChild(ellipsis);
        }
        
        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            setupPagination(containerId, totalItems, itemsPerPage, totalPages);
        });
        container.appendChild(lastPageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            setupPagination(containerId, totalItems, itemsPerPage, currentPage + 1);
        }
    });
    container.appendChild(nextButton);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        
        const updateCount = () => {
            const count = parseInt(counter.innerText);
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        updateCount();
    });
}

let salesChart, sizeChart;

function initCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 85, 90],
                backgroundColor: 'rgba(58, 123, 213, 0.2)',
                borderColor: '#3a7bd5',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: '#3a7bd5',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: document.body.classList.contains('dark-theme') ? 
                            'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Size Chart
    const sizeCtx = document.getElementById('sizeChart').getContext('2d');
    sizeChart = new Chart(sizeCtx, {
        type: 'doughnut',
        data: {
            labels: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
            datasets: [{
                data: [18, 32, 45, 52, 48, 36, 16],
                backgroundColor: [
                    '#3a7bd5',
                    '#6fa1e0',
                    '#f7b731',
                    '#2ecc71',
                    '#e74c3c',
                    '#9b59b6',
                    '#34495e'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '70%'
        }
    });
}

function updateChartsTheme() {
    if (!salesChart) return;
    
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update chart colors based on theme
    salesChart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    salesChart.update();
}

function setupEventListeners() {
    // Navigation between sections
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            if (!sectionId) return;
            
            // Update active nav item
            document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected section
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Sales period change
    document.getElementById('salesPeriod').addEventListener('change', function() {
        // This would normally fetch new data based on the selected period
        // For demo purposes, we'll just show a notification
        const period = this.value;
        showNotification(`Sales data updated for ${period} view`);
    });

    // Refresh button
    document.querySelector('.refresh-btn').addEventListener('click', function() {
        this.classList.add('rotating');
        setTimeout(() => {
            this.classList.remove('rotating');
            loadSampleData();
            showNotification('Data refreshed successfully');
        }, 1000);
    });
    
    // Add Product button
    document.getElementById('addProductBtn').addEventListener('click', function() {
        openProductModal();
    });
    
    // Cancel Product button
    document.getElementById('cancelProductBtn').addEventListener('click', function() {
        closeProductModal();
    });
    
    // Product form submission
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Add Customer button
    document.getElementById('addCustomerBtn').addEventListener('click', function() {
        openCustomerModal();
    });
    
    // Cancel Customer button
    document.getElementById('cancelCustomerBtn').addEventListener('click', function() {
        closeCustomerModal();
    });
    
    // Customer form submission
    document.getElementById('customerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCustomer();
    });
    
    // Close modals when clicking on X or outside
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Product image preview
    document.getElementById('productImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Inventory filters
    document.getElementById('inventorySearchBtn').addEventListener('click', function() {
        filterInventory();
    });
    
    document.getElementById('inventorySearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterInventory();
        }
    });
    
    document.getElementById('inventoryCategoryFilter').addEventListener('change', filterInventory);
    document.getElementById('inventoryStockFilter').addEventListener('change', filterInventory);
    
    // Order filters
    document.getElementById('orderSearchBtn').addEventListener('click', function() {
        filterOrders();
    });
    
    document.getElementById('orderSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterOrders();
        }
    });
    
    document.getElementById('orderStatusFilter').addEventListener('change', filterOrders);
    document.getElementById('orderDateFilter').addEventListener('change', filterOrders);
    
    // Customer filters
    document.getElementById('customerSearchBtn').addEventListener('click', function() {
        filterCustomers();
    });
    
    document.getElementById('customerSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterCustomers();
        }
    });
    
    document.getElementById('customerStatusFilter').addEventListener('change', filterCustomers);
    
    // Settings tabs
    document.querySelectorAll('.settings-nav li').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-settings-tab');
            
            // Update active tab
            document.querySelectorAll('.settings-nav li').forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected tab content
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(`${tabId}-settings`).classList.add('active');
        });
    });
    
    // Settings form submissions
    document.getElementById('generalSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGeneralSettings();
    });
    
    document.getElementById('accountSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAccountSettings();
    });
    
    document.getElementById('storeSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveStoreSettings();
    });
    
    // Edit product buttons
    document.querySelectorAll('#inventoryTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    // Delete product buttons
    document.querySelectorAll('#inventoryTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
    
    // Edit customer buttons
    document.querySelectorAll('#customersTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            editCustomer(customerId);
        });
    });
    
    // Delete customer buttons
    document.querySelectorAll('#customersTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            deleteCustomer(customerId);
        });
    });
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const categoryFilter = document.getElementById('inventoryCategoryFilter').value;
    const stockFilter = document.getElementById('inventoryStockFilter').value;

    const filteredProducts = sampleProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                              product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStock = stockFilter === 'all' || product.stock === stockFilter;

        return matchesSearch && matchesCategory && matchesStock;
    });

    const inventoryTableBody = document.getElementById('inventoryTableBody');
    inventoryTableBody.innerHTML = '';

    if (filteredProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="no-results">No products found matching your criteria.</td>`;
        inventoryTableBody.appendChild(row);
        return;
    }

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');

        let stockClass = '';
        if (product.stock === "In Stock") stockClass = 'in-stock';
        else if (product.stock === "Low Stock") stockClass = 'low-stock';
        else stockClass = 'out-of-stock';

        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="status-badge ${stockClass}">${product.stock}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        inventoryTableBody.appendChild(row);
    });

    // Reattach event listeners
    document.querySelectorAll('#inventoryTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('#inventoryTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;
    
    const filteredOrders = sampleOrders.filter(order => {
        // Search term filter
        const matchesSearch = order.id.toLowerCase().includes(searchTerm) || 
                            order.customer.toLowerCase().includes(searchTerm);
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        // Date filter
        const matchesDate = !dateFilter || order.date === dateFilter;
        
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Update orders table with filtered orders
    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="no-results">No orders found matching your criteria.</td>`;
        ordersTableBody.appendChild(row);
        return;
    }
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        
        let statusClass = order.status;
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${formatDate(order.date)}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(order.status)}</span></td>
            <td>${order.payment}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${order.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${order.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${order.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    // Setup pagination for filtered results
    setupPagination('ordersPagination', filteredOrders.length, 10, 1);
    
    // Re-attach event listeners
    document.querySelectorAll('#ordersTableBody .view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            openOrderDetailsModal(orderId);
        });
    });
}

function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const statusFilter = document.getElementById('customerStatusFilter').value;
    
    const filteredCustomers = sampleCustomers.filter(customer => {
        // Search term filter
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm) || 
                            customer.email.toLowerCase().includes(searchTerm) ||
                            customer.phone.includes(searchTerm);
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    // Update customers table with filtered customers
    const customersTableBody = document.getElementById('customersTableBody');
    customersTableBody.innerHTML = '';
    
    if (filteredCustomers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="no-results">No customers found matching your criteria.</td>`;
        customersTableBody.appendChild(row);
        return;
    }
    
    filteredCustomers.forEach(customer => {
        const row = document.createElement('tr');
        
        let statusClass = customer.status;
        
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>$${customer.totalSpent.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(customer.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${customer.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${customer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${customer.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        
        customersTableBody.appendChild(row);
    });
    
    // Setup pagination for filtered results
    setupPagination('customersPagination', filteredCustomers.length, 10, 1);
    
    // Re-attach event listeners
    document.querySelectorAll('#customersTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            editCustomer(customerId);
        });
    });
    
    document.querySelectorAll('#customersTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            deleteCustomer(customerId);
        });
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = modal.querySelector('.modal-header h2');
    const form = document.getElementById('productForm');
    
    // Reset form
    form.reset();
    document.getElementById('imagePreview').innerHTML = '<span>No image selected</span>';
    
    if (productId) {
        // Edit existing product
        const product = sampleProducts.find(p => p.id === productId);
        if (!product) return;
        
        modalTitle.textContent = 'Edit Product';
        
        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        
        // Show product image
        document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        
        // Store product ID for update
        form.setAttribute('data-id', productId);
    } else {
        // Add new product
        modalTitle.textContent = 'Add New Product';
        form.removeAttribute('data-id');
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function saveProduct() {
    const form = document.getElementById('productForm');
    const productId = form.getAttribute('data-id');
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: document.getElementById('productStock').value,
        image: document.getElementById('imagePreview').querySelector('img')?.src || 
               `https://via.placeholder.com/100x100?text=${encodeURIComponent(document.getElementById('productName').value)}`
    };
    
    if (productId) {
        // Update existing product
        const index = sampleProducts.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            sampleProducts[index] = { ...sampleProducts[index], ...productData };
            showNotification('Product updated successfully');
        }
    } else {
        // Add new product
        const newId = sampleProducts.length > 0 ? Math.max(...sampleProducts.map(p => p.id)) + 1 : 1;
        sampleProducts.push({
            id: newId,
            ...productData
        });
        showNotification('Product added successfully');
    }
    
    // Reload inventory data
    loadInventoryData();
    
    // Close modal
    closeProductModal();
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = sampleProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            sampleProducts.splice(index, 1);
            loadInventoryData();
            showNotification('Product deleted successfully');
        }
    }
}

function openCustomerModal(customerId = null) {
    const modal = document.getElementById('customerModal');
    const modalTitle = modal.querySelector('.modal-header h2');
    const form = document.getElementById('customerForm');
    
    // Reset form
    form.reset();
    
    if (customerId) {
        // Edit existing customer
        const customer = sampleCustomers.find(c => c.id === customerId);
        if (!customer) return;
        
        modalTitle.textContent = 'Edit Customer';
        
        // Fill form with customer data
        const nameParts = customer.name.split(' ');
        document.getElementById('customerFirstName').value = nameParts[0] || '';
        document.getElementById('customerLastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerStatus').value = customer.status;
        
        // Store customer ID for update
        form.setAttribute('data-id', customerId);
    } else {
        // Add new customer
        modalTitle.textContent = 'Add New Customer';
        form.removeAttribute('data-id');
    }
    
    modal.style.display = 'block';
}

function closeCustomerModal() {
    document.getElementById('customerModal').style.display = 'none';
}

function saveCustomer() {
    const form = document.getElementById('customerForm');
    const customerId = form.getAttribute('data-id');
    
    const firstName = document.getElementById('customerFirstName').value;
    const lastName = document.getElementById('customerLastName').value;
    
    const customerData = {
        name: `${firstName} ${lastName}`.trim(),
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        status: document.getElementById('customerStatus').value,
        orders: 0,
        totalSpent: 0
    };
    
    if (customerId) {
        // Update existing customer
        const index = sampleCustomers.findIndex(c => c.id === parseInt(customerId));
        if (index !== -1) {
            // Preserve orders and totalSpent
            customerData.orders = sampleCustomers[index].orders;
            customerData.totalSpent = sampleCustomers[index].totalSpent;
            
            sampleCustomers[index] = { ...sampleCustomers[index], ...customerData };
            showNotification('Customer updated successfully');
        }
    } else {
        // Add new customer
        const newId = sampleCustomers.length > 0 ? Math.max(...sampleCustomers.map(c => c.id)) + 1 : 1;
        sampleCustomers.push({
            id: newId,
            ...customerData
        });
        showNotification('Customer added successfully');
    }
    
    // Reload customers data
    loadCustomersData();
    
    // Close modal
    closeCustomerModal();
}

function editCustomer(customerId) {
    openCustomerModal(customerId);
}

function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        const index = sampleCustomers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            sampleCustomers.splice(index, 1);
            loadCustomersData();
            showNotification('Customer deleted successfully');
        }
    }
}

function openOrderDetailsModal(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    const modalContent = document.getElementById('orderDetailsContent');
    
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) return;
    
    let itemsHtml = '';
    let subtotal = 0;
    
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    const shipping = 10.00; // Sample shipping cost
    const tax = subtotal * 0.08; // Sample tax rate (8%)
    const total = subtotal + shipping + tax;
    
    modalContent.innerHTML = `
        <div class="order-details">
            <div class="order-info">
                <div class="order-info-group">
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span></p>
                    <p><strong>Payment Method:</strong> ${order.payment}</p>
                </div>
                <div class="order-info-group">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customer}</p>
                    <p><strong>Shipping Address:</strong> ${order.shipping.address}</p>
                    <p><strong>Shipping Method:</strong> ${order.shipping.method}</p>
                    ${order.shipping.tracking ? `<p><strong>Tracking Number:</strong> ${order.shipping.tracking}</p>` : ''}
                </div>
            </div>
            
            <h3>Order Items</h3>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-right">Subtotal:</td>
                        <td>$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-right">Shipping:</td>
                        <td>$${shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-right">Tax (8%):</td>
                        <td>$${tax.toFixed(2)}</td>
                    </tr>
                    <tr class="order-total">
                        <td colspan="3" class="text-right">Total:</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="order-actions">
                <button class="btn secondary-btn">Print Order</button>
                <button class="btn primary-btn">Update Status</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function saveGeneralSettings() {
    // In a real application, this would save to a database
    // For demo purposes, we'll just show a notification
    showNotification('General settings saved successfully');
}

function saveAccountSettings() {
    // Validate password if changing
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
            showNotification('Current password is required', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
    }
    
    showNotification('Account settings saved successfully');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function saveStoreSettings() {
    showNotification('Store settings saved successfully');
}

function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.dashboard-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'dashboard-notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = 'dashboard-notification';
    
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Helper functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



const style = document.createElement('style');
style.textContent = `
    .dashboard-notification {
        position: fixed;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 10px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        transition: top 0.3s ease;
        z-index: 1000;
    }
    
    .dashboard-notification.show {
        top: 20px;
    }
    
    .dashboard-notification.error {
        background-color: var(--danger-color);
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .rotating {
        animation: rotate 1s linear;
    }
`;
document.head.appendChild(style);

function fixSettingsNavigation() {
    document.querySelectorAll(".settings-nav li").forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.getAttribute("data-settings-tab")
        if (!tabId) return
  
        document.querySelectorAll(".settings-nav li").forEach((li) => li.classList.remove("active"))
        this.classList.add("active")
  
        document.querySelectorAll(".settings-tab").forEach((tab) => {
          tab.classList.remove("active")
        })
  
        const targetTab = document.getElementById(`${tabId}-settings`)
        if (targetTab) {
          targetTab.classList.add("active")
        } else {
          console.error(`Settings tab with ID "${tabId}-settings" not found`)
        }
      })
    })
  
    const settingsTabs = document.querySelectorAll(".settings-tab")
    const activeTab = document.querySelector(".settings-tab.active")
  
    if (settingsTabs.length > 0 && !activeTab) {
      const firstTab = settingsTabs[0]
      firstTab.classList.add("active")
  
      const tabId = firstTab.id.replace("-settings", "")
      const navItem = document.querySelector(`.settings-nav li[data-settings-tab="${tabId}"]`)
      if (navItem) {
        navItem.classList.add("active")
      }
    }
  }
  
  // Mock functions for settings saving and theme updating
  function saveGeneralSettings() {
    console.log("General settings saved (mock function)")
  }
  
  function saveAccountSettings() {
    console.log("Account settings saved (mock function)")
  }
  
  function saveStoreSettings() {
    console.log("Store settings saved (mock function)")
  }
  
  function updateChartsTheme() {
    console.log("Charts theme updated (mock function)")
  }
  

  function initializeSettingsForms() {

    const generalSettingsForm = document.getElementById("generalSettingsForm")
    if (generalSettingsForm) {
      generalSettingsForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveGeneralSettings()
      })
    }
  
    const accountSettingsForm = document.getElementById("accountSettingsForm")
    if (accountSettingsForm) {
      accountSettingsForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveAccountSettings()
      })
    }
  
    const storeSettingsForm = document.getElementById("storeSettingsForm")
    if (storeSettingsForm) {
      storeSettingsForm.addEventListener("submit", (e) => {
        e.preventDefault()
        saveStoreSettings()
      })
    }
  
    const themeOptions = document.querySelectorAll('input[name="theme"]')
    themeOptions.forEach((option) => {
      option.addEventListener("change", function () {
        const isDark = this.value === "dark"
        document.body.classList.toggle("dark-theme", isDark)
        localStorage.setItem("darkTheme", isDark)
  
        const themeIcon = document.querySelector(".theme-toggle i")
        if (themeIcon) {
          if (isDark) {
            themeIcon.classList.replace("fa-moon", "fa-sun")
          } else {
            themeIcon.classList.replace("fa-sun", "fa-moon")
          }
        }
  
        updateChartsTheme()
      })
    })
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    fixSettingsNavigation()
 
    initializeSettingsForms()
  
   
    const settingsNavItem = document.querySelector('.sidebar-nav li[data-section="settings"]')
    if (settingsNavItem) {
      settingsNavItem.addEventListener("click", () => {
        setTimeout(fixSettingsNavigation, 100)
      })
    }
  })

document.querySelectorAll('.close-modal').forEach(closeBtn => {
    console.log('Close button found:', closeBtn);
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function viewCustomerDetails(customerId) {
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (!customer) {
        console.error('Customer not found');
        return;
    }

    const customerDetailsModal = document.getElementById('customerDetailsModal');
    const customerDetailsContent = document.getElementById('customerDetailsContent');

    if (!customerDetailsModal || !customerDetailsContent) {
        console.error('Customer details modal or content not found');
        return;
    }

    // Populate the modal with customer details
    customerDetailsContent.innerHTML = `
        <h3>${customer.name}</h3>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
        <p><strong>Status:</strong> ${capitalizeFirstLetter(customer.status)}</p>
        <p><strong>Orders:</strong> ${customer.orders}</p>
        <p><strong>Total Spent:</strong> $${customer.totalSpent.toFixed(2)}</p>
        <p><strong>Notes:</strong> ${customer.notes || 'None'}</p>
    `;

    // Show the modal
    customerDetailsModal.style.display = 'block';
}

// Customer Details Modal
const customerDetailsModalHTML = `
<div id="customerDetailsModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Customer Details</h2>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body" id="customerDetailsContent">
            <!-- Customer details will be dynamically loaded here -->
        </div>
    </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', customerDetailsModalHTML);

function filterInventoryByStock() {
    const stockFilter = document.getElementById('inventoryStockFilter').value;

    const filteredProducts = sampleProducts.filter(product => {
        // Filter by stock status
        return stockFilter === 'all' || product.stock === stockFilter;
    });

    const inventoryTableBody = document.getElementById('inventoryTableBody');
    inventoryTableBody.innerHTML = '';

    if (filteredProducts.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="no-results">No products found matching your criteria.</td>`;
        inventoryTableBody.appendChild(row);
        return;
    }

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');

        let stockClass = '';
        if (product.stock === "In Stock") stockClass = 'in-stock';
        else if (product.stock === "Low Stock") stockClass = 'low-stock';
        else stockClass = 'out-of-stock';

        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="status-badge ${stockClass}">${product.stock}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        inventoryTableBody.appendChild(row);
    });

    // Reattach event listeners for edit and delete buttons
    document.querySelectorAll('#inventoryTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });

    document.querySelectorAll('#inventoryTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}

function filterOrdersByStatus() {
    const statusFilter = document.getElementById('orderStatusFilter').value;

    const filteredOrders = sampleOrders.filter(order => {
        // Filter by order status
        return statusFilter === 'all' || order.status === statusFilter;
    });

    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = '';

    if (filteredOrders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="no-results">No orders found matching your criteria.</td>`;
        ordersTableBody.appendChild(row);
        return;
    }

    filteredOrders.forEach(order => {
        const row = document.createElement('tr');

        let statusClass = order.status;

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${formatDate(order.date)}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${capitalizeFirstLetter(order.status)}</span></td>
            <td>${order.payment}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${order.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${order.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${order.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;

        ordersTableBody.appendChild(row);
    });

    // Reattach event listeners for action buttons
    document.querySelectorAll('#ordersTableBody .view-btn').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = parseInt(this.getAttribute('data-id'));
            viewOrderDetails(orderId);
        });
    });

    document.querySelectorAll('#ordersTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = parseInt(this.getAttribute('data-id'));
            editOrder(orderId);
        });
    });

    document.querySelectorAll('#ordersTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const orderId = parseInt(this.getAttribute('data-id'));
            deleteOrder(orderId);
        });
    });
}

function filterCustomersByStatus() {
    const statusFilter = document.getElementById('customerStatusFilter').value;

    const filteredCustomers = sampleCustomers.filter(customer => {
        // Filter by customer status
        return statusFilter === 'all' || customer.status === statusFilter;
    });

    const customersTableBody = document.getElementById('customersTableBody');
    customersTableBody.innerHTML = '';

    if (filteredCustomers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="no-results">No customers found matching your criteria.</td>`;
        customersTableBody.appendChild(row);
        return;
    }

    filteredCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.orders}</td>
            <td>$${customer.totalSpent.toFixed(2)}</td>
            <td><span class="status-badge ${customer.status}">${capitalizeFirstLetter(customer.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${customer.id}" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${customer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${customer.id}" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        `;
        customersTableBody.appendChild(row);
    });

    // Reattach event listeners for action buttons
    document.querySelectorAll('#customersTableBody .view-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = parseInt(this.getAttribute('data-id'));
            viewCustomerDetails(customerId);
        });
    });

    document.querySelectorAll('#customersTableBody .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = parseInt(this.getAttribute('data-id'));
            editCustomer(customerId);
        });
    });

    document.querySelectorAll('#customersTableBody .delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const customerId = parseInt(this.getAttribute('data-id'));
            deleteCustomer(customerId);
        });
    });
}
