// === CART FUNCTIONALITY === //
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartOverlay = document.createElement("div");
cartOverlay.classList.add("cart-overlay");
document.body.appendChild(cartOverlay);
const closeCart = document.querySelector("#cart-close");

// Open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.classList.add("cart-open");
};

// Close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.classList.remove("cart-open");
};

// Close cart by clicking outside
cartOverlay.onclick = () => {
  cart.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.classList.remove("cart-open");
};

// === CLEAR ALL FUNCTIONALITY === //
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("clear-all")) {
    clearAllCartItems();
  }
});

// Function to clear all cart items
function clearAllCartItems() {
  const cartContent = document.querySelector(".cart-content");
  const cartItems = cartContent.querySelectorAll(".cart-box");
  
  if (cartItems.length === 0) {
    return;
  }
  
  const confirmed = confirm('Are you sure you want to remove all items from your cart?');
  if (confirmed) {
    cartItems.forEach(item => item.remove());
    updateTotal();
  }
}

// ONLY keep cart-remove in global listener
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-remove")) {
    e.target.closest(".cart-box").remove();
    updateTotal();
  }
});

// Calculate total
function updateTotal() {
  const prices = document.querySelectorAll(".cart-price");
  const quantities = document.querySelectorAll(".number");
  let total = 0;
  prices.forEach((price, i) => {
    const value = parseFloat(price.textContent.replace("R", ""));
    const qty = parseInt(quantities[i].textContent);
    total += value * qty;
  });
  document.querySelector(".total-price").textContent = "R" + total.toFixed(2);
  
  // Update cart badge
  const cartContent = document.querySelector(".cart-content");
  const itemCount = cartContent.querySelectorAll(".cart-box").length;
  const badge = document.querySelector(".cart-item-count");
  
  if (itemCount > 0) {
    badge.textContent = itemCount;
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

// === CONTACT FORM FUNCTIONALITY === //
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const name = document.querySelector("#fullname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const cell = document.querySelector("#cell").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    // Simple validation
    if (!name || !email || !cell || !subject || !message) {
      alert("Please fill in all fields before sending.");
      return;
    }

    alert(`Thank you, ${name}! Your message has been sent successfully. 🎉`);
    contactForm.reset();
  });
}

// === ADD TO CART SYSTEM === //
const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    console.log('Add to cart clicked');
    const productBox = e.target.closest(".product-box");
    const title = productBox.querySelector(".product-title").textContent;
    const price = productBox.querySelector(".price").textContent;
    const imgSrc = productBox.querySelector("img").src;

    addProductToCart(title, price, imgSrc);
  });
});

// === FUNCTION: Add Product To Cart === //
function addProductToCart(title, price, imgSrc) {
  const cartContent = document.querySelector(".cart-content");

  // Check if the item already exists
  const existingItems = cartContent.querySelectorAll(".cart-product-title");
  for (let item of existingItems) {
    if (item.textContent === title) {
      // If already in cart, increase quantity by 1
      const qtyElement = item.closest(".cart-box").querySelector(".number");
      qtyElement.textContent = parseInt(qtyElement.textContent) + 1;
      updateTotal();
      return;
    }
  }

  // Create new cart item box (starts with quantity 1)
  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
    <img src="${imgSrc}" class="cart-img">
    <div class="cart-detail">
      <h2 class="cart-product-title">${title}</h2>
      <span class="cart-price">${price}</span>
      <div class="cart-quantity">
        <button class="decrement">-</button>
        <span class="number">1</span>
        <button class="increment">+</button>
      </div>
    </div>
    <i class="ri-delete-bin-5-line cart-remove"></i>
  `;

  // Add new item to cart
  cartContent.appendChild(cartBox);

  // Add event listeners to THIS specific cart item
  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();
    updateTotal();
  });

  cartBox.querySelector(".increment").addEventListener("click", () => {
    const number = cartBox.querySelector(".number");
    number.textContent = parseInt(number.textContent) + 1;
    updateTotal();
  });

  cartBox.querySelector(".decrement").addEventListener("click", () => {
    const number = cartBox.querySelector(".number");
    const newValue = parseInt(number.textContent) - 1;
    if (newValue > 0) {
      number.textContent = newValue;
    } else {
      cartBox.remove();
    }
    updateTotal();
  });
  
  updateTotal();
}

// === Buy Button Event Listener === //
document.querySelector(".btn-buy").addEventListener("click", () => {
  const cartContent = document.querySelector(".cart-content");
  const cartItems = cartContent.querySelectorAll(".cart-box");
  
  if (cartItems.length > 0) {
    alert('Order placed successfully!');
    cartContent.innerHTML = '';
    updateTotal();
    cart.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
  } else {
    alert('Your cart is empty!');
  }
});