let cart = [];

const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartCount = document.getElementById("cart-count");
const emptyCart = document.getElementById("empty-cart");
const cartItems = document.getElementById("cart-items");
const cartFooter = document.getElementById("cart-footer");
const totalPrice = document.getElementById("total-price");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const modal = document.getElementById("order-modal");
const modalItems = document.getElementById("modal-items");
const modalTotalPrice = document.getElementById("modal-total-price");
const startNewOrderBtn = document.getElementById("start-new-order-btn");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));
    const category = button.getAttribute("data-category");

    addToCart(name, price, category);

    // Show quantity controls and hide add to cart button
    const card = button.closest(".card");
    button.style.display = "none";
    const quantityControls = card.querySelector(".quantity-controls");
    quantityControls.classList.add("active");
  });
});

// Handle quantity controls
document.querySelectorAll(".quantity-controls").forEach((controls) => {
  const minusBtn = controls.querySelector(".minus-btn");
  const plusBtn = controls.querySelector(".plus-btn");
  const display = controls.querySelector(".quantity-display");
  const productName = controls.getAttribute("data-name");

  plusBtn.addEventListener("click", () => {
    const item = cart.find((i) => i.name === productName);
    if (item) {
      const card = controls.closest(".card");
      const button = card.querySelector(".add-to-cart");
      const price = parseFloat(button.getAttribute("data-price"));
      const category = button.getAttribute("data-category");
      addToCart(productName, price, category);
      display.textContent = item.quantity;
    }
  });

  minusBtn.addEventListener("click", () => {
    const item = cart.find((i) => i.name === productName);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        display.textContent = item.quantity;
        updateCart();
      } else {
        // Remove from cart and show add to cart button again
        cart = cart.filter((i) => i.name !== productName);
        controls.classList.remove("active");
        const card = controls.closest(".card");
        const button = card.querySelector(".add-to-cart");
        button.style.display = "block";
        display.textContent = "1";
        updateCart();
      }
    }
  });
});

function addToCart(name, price, category) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, category, quantity: 1 });
  }

  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);

  // Reset the product card
  const card = document.querySelector(`[data-product="${name}"]`);
  if (card) {
    const addButton = card.querySelector(".add-to-cart");
    const quantityControls = card.querySelector(".quantity-controls");
    const display = quantityControls.querySelector(".quantity-display");

    addButton.style.display = "block";
    quantityControls.classList.remove("active");
    display.textContent = "1";
  }

  updateCart();
}

function updateCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.innerHTML = "";
    cartFooter.style.display = "none";
  } else {
    emptyCart.style.display = "none";
    cartFooter.style.display = "block";

    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
              <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-details">
                  <span class="cart-item-quantity">${item.quantity}x</span>
                  <span class="cart-item-price">@ ${item.price.toFixed(
                    2
                  )}</span>
                  <span class="cart-item-total">${(
                    item.price * item.quantity
                  ).toFixed(2)}</span>
                </div>
              </div>
              <button class="cart-item-remove" onclick="removeFromCart('${
                item.name
              }')">×</button>
            </div>
          `
      )
      .join("");

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    totalPrice.textContent = `${total.toFixed(2)}`;
  }

  // Update all quantity displays
  cart.forEach((item) => {
    const card = document.querySelector(`[data-product="${item.name}"]`);
    if (card) {
      const display = card.querySelector(".quantity-display");
      if (display) {
        display.textContent = item.quantity;
      }
    }
  });
}

confirmOrderBtn.addEventListener("click", () => {
  showOrderConfirmation();
});

function showOrderConfirmation() {
  modalItems.innerHTML = cart
    .map(
      (item) => `
          <div class="modal-item">
            <div class="modal-item-info">
              <div class="modal-item-details">
                <h4>${item.name}</h4>
                <div>
                  <span class="modal-item-quantity">${item.quantity}x</span>
                  <span class="modal-item-unit-price">@ ${item.price.toFixed(
                    2
                  )}</span>
                </div>
              </div>
            </div>
            <div class="modal-item-total">${(
              item.price * item.quantity
            ).toFixed(2)}</div>
          </div>
        `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  modalTotalPrice.textContent = `${total.toFixed(2)}`;

  modal.classList.add("active");
}

startNewOrderBtn.addEventListener("click", () => {
  // Reset all cards
  document.querySelectorAll(".card").forEach((card) => {
    const addButton = card.querySelector(".add-to-cart");
    const quantityControls = card.querySelector(".quantity-controls");
    const display = quantityControls.querySelector(".quantity-display");

    addButton.style.display = "block";
    quantityControls.classList.remove("active");
    display.textContent = "1";
  });

  cart = [];
  updateCart();
  modal.classList.remove("active");
});
