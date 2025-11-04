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

// Quantity increment/decrement
document.addEventListener("click", (e) => {
  if (e.target.id === "increment") {
    const number = e.target.parentElement.querySelector(".number");
    number.textContent = parseInt(number.textContent) + 1;
    updateTotal();
  }
  if (e.target.id === "decrement") {
    const number = e.target.parentElement.querySelector(".number");
    if (parseInt(number.textContent) > 1) {
      number.textContent = parseInt(number.textContent) - 1;
      updateTotal();
    }
  }
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
  document.querySelector(".cart-item-count").style.visibility = total > 0 ? "visible" : "hidden";
}

// === FORM HANDLING === //
const enquiryForm = document.querySelector("#enquiry-form");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully. 🍰");
    enquiryForm.reset();
  });
}
