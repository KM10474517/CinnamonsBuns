// CART FUNCTIONALITY //
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartIcon = document.getElementById('cart-icon');
const cartElement = document.querySelector('.cart');
const cartClose = document.getElementById('cart-close');
const cartContent = document.querySelector('.cart-content');
const totalPrice = document.querySelector('.total-price');
const clearAllBtn = document.querySelector('.clear-all');
const btnBuy = document.querySelector('.btn-buy');

// Create cart overlay
const cartOverlay = document.createElement('div');
cartOverlay.classList.add('cart-overlay');
document.body.appendChild(cartOverlay);

// Cart open/close functionality
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartElement.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.classList.add('cart-open');
    });
}

if (cartClose) {
    cartClose.addEventListener('click', () => {
        cartElement.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.classList.remove('cart-open');
    });
}

cartOverlay.addEventListener('click', () => {
    cartElement.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.classList.remove('cart-open');
});

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector('.cart-item-count');
    if (badge) {
        badge.textContent = count;
        
        if (count > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Add to cart functionality
function initAddToCartButtons() {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productBox = this.closest('.product-box');
            const title = productBox.querySelector('.product-title').textContent;
            const price = parseFloat(productBox.querySelector('.price').textContent.replace('R', ''));
            const imgSrc = productBox.querySelector('img').src;
            const imgAlt = productBox.querySelector('img').alt;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.title === title);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    title: title,
                    price: price,
                    imgSrc: imgSrc,
                    imgAlt: imgAlt,
                    quantity: 1
                });
            }
            
            // Update localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            updateCart();
            
            // Show added to cart animation
            showAddToCartAnimation(this);
            showToastMessage(`${title} added to cart!`);
        });
    });
}

// Show add to cart animation
function showAddToCartAnimation(button) {
    button.classList.add('added');
    setTimeout(() => {
        button.classList.remove('added');
    }, 1000);
}

// Update cart UI
function updateCart() {
    if (!cartContent) return;
    
    cartContent.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-box');
        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.imgAlt}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${item.title}</div>
                <div class="cart-price">R${item.price.toFixed(2)}</div>
                <div class="cart-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-fill cart-remove" data-index="${index}"></i>
        `;
        
        cartContent.appendChild(cartItem);
    });
    
    if (totalPrice) {
        totalPrice.textContent = `R${total.toFixed(2)}`;
    }
    
    // Add event listeners for quantity buttons and remove
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Quantity functions
function decreaseQuantity(e) {
    const index = e.target.getAttribute('data-index');
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
}

function increaseQuantity(e) {
    const index = e.target.getAttribute('data-index');
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
}

function removeFromCart(e) {
    const index = e.target.getAttribute('data-index');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
}

// Clear all items from cart
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            if (confirm('Are you sure you want to clear all items from your cart?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCart();
                showToastMessage('Cart cleared successfully');
            }
        }
    });
}

// Buy button functionality
if (btnBuy) {
    btnBuy.addEventListener('click', () => {
        if (cart.length === 0) {
            showToastMessage('Your cart is empty!', 'error');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Thank you for your order! Total: R${total.toFixed(2)}\nYou will be redirected to the checkout page.`);
        
        // Clear cart after successful order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCart();
        
        // Close cart
        cartElement.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.classList.remove('cart-open');
    });
}

// TOAST MESSAGES //
function showToastMessage(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `
        <i class="ri-${type === 'success' ? 'checkbox-circle' : 'error-warning'}-line"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// FORM VALIDATION //
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<div class="loading-spinner-small"></div> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    if (this.id === 'contact-form' || this.id === 'enquiry-form') {
                        showSuccessModal();
                    } else {
                        showToastMessage('Message sent successfully! We will get back to you soon.');
                    }
                    
                    // Reset form
                    this.reset();
                }, 2000);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    // Clear previous errors
    inputs.forEach(input => clearError(input));
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentNode.querySelector('.error-message');
    
    // Clear previous error
    clearError(field);
    
    // Check required fields
    if (field.hasAttribute('required') && value === '') {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if ((field.type === 'tel' || field.id === 'cell') && value !== '') {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    field.style.borderColor = '#ff4757';
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup?.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    field.style.borderColor = '';
}

// MODAL FUNCTIONALITY //
function initModal() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Keyboard close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        showToastMessage('Thank you for your message! We will get back to you soon.');
    }
}

// ACCORDION FUNCTIONALITY //
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion, .faq-accordion, .catering-accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item, .faq-item, .catering-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header, .faq-question, .catering-header');
            
            if (header) {
                header.addEventListener('click', () => {
                    // Close all other items in this accordion
                    items.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    });
}

// SEARCH AND FILTER FUNCTIONALITY //
function initSearchFilter() {
    const searchInput = document.getElementById('product-search');
    const productContainer = document.getElementById('product-container');
    const noResults = document.getElementById('no-results');
    
    if (!searchInput || !productContainer) return;
    
    const products = document.querySelectorAll('.product-box');
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;
        
        products.forEach(product => {
            const productName = product.getAttribute('data-name')?.toLowerCase() || 
                              product.querySelector('.product-title').textContent.toLowerCase();
            const matchesSearch = productName.includes(searchTerm);
            
            // Show/hide product
            if (matchesSearch) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
    
    searchInput.addEventListener('input', filterProducts);
}

// GALLERY FUNCTIONALITY //
function initGallery() {
    initGalleryFilters();
}

function initGalleryFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('gallery-search');
    const sortSelect = document.getElementById('sort-gallery');
    const galleryContainer = document.getElementById('gallery-container');
    const noResults = document.getElementById('no-gallery-results');

    console.log('Initializing gallery filters...');

    // Get all gallery items and sections
    const galleryItems = document.querySelectorAll('.gallery');
    const sections = document.querySelectorAll('.in-store');

    console.log('Gallery items found:', galleryItems.length);
    console.log('Sections found:', sections.length);

    // Category filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const filterValue = this.value;
            console.log('Category filter changed to:', filterValue);
            filterGalleryItems();
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            console.log('Search input:', this.value);
            filterGalleryItems();
        });
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Sort changed to:', this.value);
            sortGalleryItems(this.value);
        });
    }

    // Main filter function that combines category and search
    function filterGalleryItems() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        
        console.log('Filtering - Search:', searchTerm, 'Category:', categoryValue);

        let totalVisibleItems = 0;
        let totalVisibleSections = 0;

        // Filter sections and their items
        sections.forEach(section => {
            const sectionCategory = section.getAttribute('data-category');
            const sectionItems = section.querySelectorAll('.gallery');
            let sectionVisibleItems = 0;

            // Check if section should be visible based on category
            const sectionMatchesCategory = categoryValue === 'all' || sectionCategory === categoryValue;

            // Filter items within section
            sectionItems.forEach(item => {
                const itemName = item.getAttribute('data-name') ? item.getAttribute('data-name').toLowerCase() : '';
                const itemDescription = item.querySelector('.description') ? item.querySelector('.description').textContent.toLowerCase() : '';

                // Check if item matches search term
                const matchesSearch = searchTerm === '' || 
                                    itemName.includes(searchTerm) || 
                                    itemDescription.includes(searchTerm);
                
                // Check if item matches category filter
                const matchesCategory = categoryValue === 'all' || sectionCategory === categoryValue;
                
                const shouldShow = matchesSearch && matchesCategory;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                    sectionVisibleItems++;
                    totalVisibleItems++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Show/hide section based on whether it has visible items
            if (sectionVisibleItems > 0 && sectionMatchesCategory) {
                section.style.display = 'block';
                totalVisibleSections++;
                
                // Show the section heading
                const sectionHeading = section.querySelector('h2');
                if (sectionHeading) {
                    sectionHeading.style.display = 'block';
                }
            } else {
                section.style.display = 'none';
                
                // Hide the section heading
                const sectionHeading = section.querySelector('h2');
                if (sectionHeading) {
                    sectionHeading.style.display = 'none';
                }
            }

            console.log('Section:', sectionCategory, 'Visible items:', sectionVisibleItems);
        });
        
        console.log('Total visible items:', totalVisibleItems, 'Total visible sections:', totalVisibleSections);
        checkGalleryResults(totalVisibleItems);
    }

    function checkGalleryResults(visibleCount) {
        console.log('Checking results - Visible items:', visibleCount);
        
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            console.log('No results message:', noResults.style.display);
        }
    }

    function sortGalleryItems(sortBy) {
        console.log('Sorting gallery items by:', sortBy);

        // For this structure, we'll sort within each section
        sections.forEach(section => {
            const galleryWrapper = section.querySelector('.gallery-wrapper');
            const galleryItems = Array.from(section.querySelectorAll('.gallery'));
            
            if (!galleryWrapper) return;

            galleryItems.sort((a, b) => {
                const aName = a.getAttribute('data-name') || '';
                const bName = b.getAttribute('data-name') || '';
                const aCategory = a.getAttribute('data-category') || '';
                const bCategory = b.getAttribute('data-category') || '';

                switch(sortBy) {
                    case 'name':
                        return aName.localeCompare(bName);
                    case 'name-desc':
                        return bName.localeCompare(aName);
                    case 'category':
                        return aCategory.localeCompare(bCategory);
                    default:
                        return 0;
                }
            });

            // Clear wrapper and append sorted items
            galleryWrapper.innerHTML = '';
            galleryItems.forEach(item => {
                galleryWrapper.appendChild(item);
            });

            // Re-apply animations
            galleryItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        });

        // Re-filter after sorting to maintain current filter state
        filterGalleryItems();
    }

    // Initialize filter states based on URL parameters
    function initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const sort = urlParams.get('sort');
        const search = urlParams.get('search');

        console.log('Initializing from URL:', { category, sort, search });

        if (category && categoryFilter) {
            categoryFilter.value = category;
        }

        if (sort && sortSelect) {
            sortSelect.value = sort;
        }

        if (search && searchInput) {
            searchInput.value = search;
        }

        // Apply filters after setting values
        filterGalleryItems();
        if (sort && sortSelect) {
            sortGalleryItems(sort);
        }
    }

    // Update URL when filters change
    function updateURL() {
        const urlParams = new URLSearchParams();
        
        if (categoryFilter && categoryFilter.value !== 'all') {
            urlParams.set('category', categoryFilter.value);
        }
        
        if (sortSelect && sortSelect.value !== 'default') {
            urlParams.set('sort', sortSelect.value);
        }
        
        if (searchInput && searchInput.value) {
            urlParams.set('search', searchInput.value);
        }

        const newURL = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newURL);
    }

    // Add URL update to filter events
    if (categoryFilter) {
        categoryFilter.addEventListener('change', updateURL);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', updateURL);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(updateURL, 500));
    }

    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize from URL on page load
    initializeFromURL();
    
    // Initial filter check
    filterGalleryItems();
}

function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// SHOP PAGE FUNCTIONALITY //
function initShopPage() {
    const searchInput = document.getElementById('shop-search');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-products');
    const productsContainer = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const loadMoreBtn = document.getElementById('load-more');
    const viewButtons = document.querySelectorAll('.view-btn');

    if (!productsContainer) return;

    // Sample products data - in a real app, this would come from a database
    const products = [
        {
            id: 1,
            name: "Classic Roll",
            category: "cinnamon-rolls",
            price: 30,
            image: "Images/cinnamonroll1.jpg",
            description: "Our signature cinnamon roll with cream cheese frosting",
            bestSeller: true,
            featured: true
        },
        {
            id: 2,
            name: "Biscoff Roll",
            category: "cinnamon-rolls",
            price: 40,
            image: "Images/cinnamonroll4.jpg",
            description: "Cinnamon roll with Biscoff spread and caramel drizzle",
            bestSeller: true,
            featured: true
        },
        {
            id: 3,
            name: "Red Roll",
            category: "cinnamon-rolls",
            price: 40,
            image: "Images/cinnamonroll5.jpg",
            description: "Red velvet cinnamon roll with cream cheese frosting",
            bestSeller: true,
            featured: true
        },
        {
            id: 4,
            name: "Chocolate Chip Cookie",
            category: "cookies",
            price: 20,
            image: "Images/chocchipcookie.jpg",
            description: "Classic chocolate chip cookie with melty chocolate",
            bestSeller: true,
            featured: true
        },
        {
            id: 5,
            name: "Vanilla Cookie",
            category: "cookies",
            price: 20,
            image: "Images/vanillacookie.jpg",
            description: "Soft vanilla sugar cookie with sprinkles",
            bestSeller: true,
            featured: true
        },
        {
            id: 6,
            name: "Carrot Cake",
            category: "cakes",
            price: 50,
            image: "Images/carrotcake1.jpg",
            description: "Moist spiced carrot cake with cream cheese frosting",
            bestSeller: true,
            featured: true
        }
    ];

    let currentProducts = [...products];
    let itemsToShow = 12;
    let currentView = 'grid';

    // Initial render
    renderProducts(currentProducts.slice(0, itemsToShow));

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts();
        });
    }

    // Filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (sortSelect) sortSelect.value = 'featured';
            filterProducts();
        });
    }

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            itemsToShow += 12;
            renderProducts(currentProducts.slice(0, itemsToShow));
            
            if (itemsToShow >= currentProducts.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // View toggle functionality
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                
                // Update active button
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update view
                productsContainer.className = `products-container ${view}-view`;
                currentView = view;
                
                // Re-render products with new view
                renderProducts(currentProducts.slice(0, itemsToShow));
            });
        });
    }

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const sortBy = sortSelect ? sortSelect.value : 'featured';

        // Filter products
        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || product.category === category;
            
            return matchesSearch && matchesCategory;
        });

        // Sort products
        filteredProducts = sortProducts(filteredProducts, sortBy);

        currentProducts = filteredProducts;
        itemsToShow = 12;
        renderProducts(currentProducts.slice(0, itemsToShow));
        
        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = currentProducts.length > itemsToShow ? 'block' : 'none';
        }
        
        // Show/hide no results message
        if (noProducts) {
            noProducts.style.display = filteredProducts.length === 0 ? 'block' : 'none';
        }
        
        updateActiveFilters();
    }

    function sortProducts(products, sortBy) {
        switch(sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'name':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'best-seller':
                return [...products].sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
            default:
                return [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }

    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';
        
        productsToRender.forEach(product => {
            const productElement = createProductElement(product);
            productsContainer.appendChild(productElement);
        });
        
        // Re-initialize add to cart buttons
        initAddToCartButtons();
    }

    function createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = `product-box ${product.bestSeller ? 'best-seller' : ''} ${currentView === 'list' ? 'list-view' : ''}`;
        productDiv.setAttribute('data-product-id', product.id);
        
        productDiv.innerHTML = `
            <div class="img-box">
                <img src="${product.image}" alt="${product.name} - ${product.description}" loading="lazy">
                ${product.bestSeller ? '<span class="best-seller-badge">Best Seller</span>' : ''}
                <div class="product-overlay">
                    <button class="quick-view-btn" data-product-id="${product.id}">
                        <i class="ri-eye-line"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="price-and-cart">
                    <span class="price">R${product.price}</span>
                    <button class="add-cart" data-product-id="${product.id}">
                        <i class="ri-shopping-basket-line"></i>
                    </button>
                </div>
            </div>
        `;
        
        return productDiv;
    }

    function updateActiveFilters() {
        const activeFilters = document.getElementById('active-filters');
        if (!activeFilters) return;
        
        const filters = [];
        
        if (searchInput && searchInput.value) filters.push(`Search: "${searchInput.value}"`);
        if (categoryFilter && categoryFilter.value !== 'all') filters.push(`Category: ${categoryFilter.options[categoryFilter.selectedIndex].text}`);
        
        if (filters.length > 0) {
            activeFilters.innerHTML = `
                <strong>Active Filters:</strong> ${filters.join(' • ')}
                <button class="clear-filter" id="clear-filters-btn">Clear All</button>
            `;
            activeFilters.style.display = 'block';
            
            // Add event listener to clear filters button
            document.getElementById('clear-filters-btn').addEventListener('click', function() {
                if (clearFiltersBtn) clearFiltersBtn.click();
            });
        } else {
            activeFilters.style.display = 'none';
        }
    }
}

// ANIMATIONS AND TRANSITIONS //
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.product-box, .story-card, .form-container, .gallery, .team-member, .timeline-item').forEach(el => {
        observer.observe(el);
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// TIMELINE FUNCTIONALITY //
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// === CONTACT TABS FUNCTIONALITY === //
function initContactTabs() {
    const contactTabs = document.querySelectorAll('.contact-tab');
    const tabPanes = document.querySelectorAll('.contact-tab-pane');
    
    if (!contactTabs.length) return;
    
    contactTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            contactTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current tab and pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Auto-fill subject for catering button
    const cateringBtn = document.querySelector('.btn-catering');
    if (cateringBtn) {
        cateringBtn.addEventListener('click', function() {
            const enquiryType = document.getElementById('enquiry-type');
            const subject = document.getElementById('subject');
            
            if (enquiryType) enquiryType.value = 'catering';
            if (subject) subject.value = 'Catering Enquiry';
            
            // Switch to catering tab
            document.querySelector('.contact-tab[data-tab="catering"]').click();
            
            // Scroll to form
            document.querySelector('.enhanced-form-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// MAP FUNCTIONALITY //
function initMap() {
    const mapContainer = document.getElementById('bakery-map') || document.getElementById('interactive-map');
    if (!mapContainer) return;
    
    try {
        // Initialize the map with Rosebank College Braamfontein coordinates
        const map = L.map(mapContainer).setView([-26.1925, 28.0306], 16);
        
        // Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Bakery marker
        const bakeryIcon = L.divIcon({
            html: '<i class="ri-map-pin-time-fill"></i>',
            iconSize: [40, 40],
            className: 'bakery-marker'
        });
        
        // Pin marker
        L.marker([-26.1925, 28.0306], {icon: bakeryIcon}).addTo(map);
        
    } catch (error) {
        console.warn('Map initialization failed:', error);
    }
}

// LOADING STATES //
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// LAZY LOADING //
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// INITIALIZE EVERYTHING ON DOM LOAD //
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    updateCartCount();
    updateCart();
    
    // Initialize core functionalities
    initAddToCartButtons();
    initFormValidation();
    initModal();
    initAccordion();
    initSearchFilter();
    initAnimations();
    initLazyLoading();
    
    // Page-specific initializations
    if (document.querySelector('.map-section') || document.querySelector('#interactive-map')) {
        initMap();
    }
    
    if (document.querySelector('.gallery-controls')) {
        console.log('Gallery page detected, initializing gallery...');
        initGallery();
    }
    
    if (document.querySelector('.timeline')) {
        initTimeline();
    }
    
    if (document.querySelector('.contact-tabs')) {
        initContactTabs();
    }
    
    if (document.querySelector('#products-container')) {
        initShopPage();
    }
    
    console.log('All JavaScript functionalities initialized successfully!');
});

// ERROR HANDLING //
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Export functions for global access
window.getCart = function() {
    return cart;
};

window.updateCartFromExternal = function() {
    updateCartCount();
    updateCart();
};

// Dynamic content loading (example for future implementation)
function loadDynamicContent(url, containerId) {
    showLoading();
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            hideLoading();
        })
        .catch(error => {
            console.error('Error loading content:', error);
            hideLoading();
            showToastMessage('Error loading content. Please try again.', 'error');
        });
}