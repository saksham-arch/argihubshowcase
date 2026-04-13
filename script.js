// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Static product catalogue — shown when the database has no entries
const STATIC_PRODUCTS = [
    {
        id: 1,
        name: "Premium Paddy Seeds (1 kg)",
        price: 249,
        image: "images/seeds_paddy.png",
        description: "High-yield HYV paddy seeds suitable for Kharif season."
    },
    {
        id: 2,
        name: "NPK Fertilizer 5 kg Bag",
        price: 595,
        image: "images/fertilizer_npk.png",
        description: "Balanced 19-19-19 granulated fertilizer for all crops."
    },
    {
        id: 3,
        name: "Stainless Steel Hand Tool Set",
        price: 385,
        image: "images/garden_tools.png",
        description: "Trowel and cultivator set with hardwood handles."
    },
    {
        id: 4,
        name: "Knapsack Sprayer 16 L",
        price: 990,
        image: "images/sprayer_pump.png",
        description: "HDPE backpack sprayer with adjustable brass nozzle."
    },
    {
        id: 5,
        name: "Drip Irrigation Kit (50 plants)",
        price: 1250,
        image: "images/drip_irrigation.png",
        description: "Complete drip kit — mainline, emitters and connectors."
    },
    {
        id: 6,
        name: "Digital Soil pH and Moisture Tester",
        price: 749,
        image: "images/soil_tester.png",
        description: "Instant-read dual meter for soil pH and moisture levels."
    }
];

/* ============================================================
   TOAST NOTIFICATION
   Replaces native alert() with a styled floating notification
   ============================================================ */
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px) scale(0.9)';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 400);
    }, 3000);
}

/* ============================================================
   FARMER REGISTRATION
   ============================================================ */
const registrationForm = document.getElementById("form");

if (registrationForm) {
    registrationForm.onsubmit = async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const pass = document.getElementById("pass").value;
        const address = document.getElementById("address").value.trim();
        const land = document.getElementById("land").value;
        const service = document.getElementById("service").value;

        // Client-side validation
        if (name.length < 3) {
            showToast("Please enter a valid full name (min 3 characters).");
            return;
        }
        if (pass.length < 8) {
            showToast("Password must be at least 8 characters.");
            return;
        }

        // Loading state
        const btn = registrationForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Registering...";
        btn.disabled = true;

        try {
            const response = await fetch("register.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: [
                    `fullname=${encodeURIComponent(name)}`,
                    `email=${encodeURIComponent(email)}`,
                    `phone=${encodeURIComponent(phone)}`,
                    `password=${encodeURIComponent(pass)}`,
                    `address=${encodeURIComponent(address)}`,
                    `land=${encodeURIComponent(land)}`,
                    `service=${encodeURIComponent(service)}`
                ].join("&")
            });

            const result = await response.text();
            const msgEl = document.getElementById("msg");

            if (result.includes("Success")) {
                msgEl.innerText = "Registration successful! Welcome to AgriAdvisory Hub.";
                registrationForm.reset();
                showToast("Account created successfully.");
            } else {
                msgEl.innerText = "Registration failed. Please try again.";
                showToast("Error during registration. Please try again.");
            }
        } catch (error) {
            showToast("Network error. Please check your connection.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}

/* ============================================================
   PRODUCTS — fetch from DB, fall back to static catalogue
   ============================================================ */
const prodList = document.getElementById("products");
const productsEmptyState = document.getElementById("products-empty");

if (prodList) {
    loadProducts();
}

async function loadProducts() {
    try {
        const response = await fetch("get_products.php");
        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        const products = await response.json();
        renderProducts(Array.isArray(products) && products.length > 0 ? products : STATIC_PRODUCTS);
    } catch (error) {
        renderProducts(STATIC_PRODUCTS);
    }
}

function renderProducts(products) {
    prodList.innerHTML = "";

    if (!products || products.length === 0) {
        if (productsEmptyState) productsEmptyState.style.display = 'block';
        return;
    }

    if (productsEmptyState) productsEmptyState.style.display = 'none';

    products.forEach((p, index) => {
        const li = document.createElement("li");
        li.style.animationDelay = `${index * 0.1}s`;
        li.innerHTML = `
            <img src="${p.image || 'images/seeds_paddy.png'}" alt="${p.name}">
            <div style="width: 100%; text-align: left; padding: 0 4px;">
                <h4 style="margin: 0 0 4px; font-size: 1rem; color: var(--text-primary); line-height: 1.4;">${p.name}</h4>
                <p style="margin: 0 0 6px; font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">${p.description || ""}</p>
                <div style="color: var(--accent-primary); font-weight: 700; font-size: 1.05rem;">Rs. ${p.price}</div>
            </div>
            <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})" style="width: 100%; margin-top: 4px;">Add to Cart</button>
        `;
        prodList.appendChild(li);
    });
}

/* ============================================================
   ADD TO CART
   ============================================================ */
function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`${name} added to cart.`);
}

/* ============================================================
   CART PAGE
   ============================================================ */
const cartUI = document.getElementById("cart");
const totalUI = document.getElementById("total");
const cartEmptyState = document.getElementById("cart-empty");

if (cartUI) {
    renderCart();
}

function renderCart() {
    cartUI.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        if (cartEmptyState) cartEmptyState.style.display = 'block';
        const layout = document.getElementById('checkout-layout');
        if (layout) layout.style.display = 'none';
        if (totalUI) totalUI.style.display = 'none';
        return;
    }

    if (cartEmptyState) cartEmptyState.style.display = 'none';
    const layout = document.getElementById('checkout-layout');
    if (layout) layout.style.display = 'grid';
    if (totalUI) totalUI.style.display = 'block';

    cart.forEach((item, index) => {
        total += Number(item.price);

        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <span style="display: block; font-size: 0.95rem; color: var(--text-primary); font-weight: 500;">${item.name}</span>
                <span style="font-size: 0.9rem; color: var(--accent-primary); font-weight: 600;">Rs. ${item.price}</span>
            </div>
            <button class="btn-danger" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartUI.appendChild(li);
    });

    if (totalUI) totalUI.innerText = "Total: Rs. " + total;
}

/* ============================================================
   REMOVE FROM CART
   ============================================================ */
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    showToast(`Removed "${itemName}" from cart.`);
}

// Expose to global scope for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

/* ============================================================
   PLACE ORDER — submits cart + delivery details to place_order.php
   ============================================================ */
const orderForm = document.getElementById("order-form");

if (orderForm) {
    orderForm.onsubmit = async function (e) {
        e.preventDefault();

        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }

        const custName = document.getElementById("cust-name").value.trim();
        const custPhone = document.getElementById("cust-phone").value.trim();
        const custAddress = document.getElementById("cust-address").value.trim();
        const payMode = document.getElementById("payment-mode").value;

        if (custName.length < 2) {
            showToast("Please enter your full name.");
            return;
        }
        if (custPhone.length < 6) {
            showToast("Please enter a valid phone number.");
            return;
        }

        const btn = document.getElementById("place-order-btn");
        const originalText = btn.innerText;
        btn.innerText = "Placing Order...";
        btn.disabled = true;

        const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
        const itemsJSON = JSON.stringify(cart.map(i => ({ name: i.name, price: i.price })));

        try {
            const res = await fetch("place_order.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: [
                    `customer_name=${encodeURIComponent(custName)}`,
                    `phone=${encodeURIComponent(custPhone)}`,
                    `address=${encodeURIComponent(custAddress)}`,
                    `payment_mode=${encodeURIComponent(payMode)}`,
                    `items=${encodeURIComponent(itemsJSON)}`,
                    `total=${total}`
                ].join("&")
            });

            const result = await res.json();

            if (result.status === "success") {
                // Clear cart
                cart = [];
                localStorage.removeItem("cart");

                // Hide checkout panels, show success
                const layout = document.getElementById("checkout-layout");
                if (layout) layout.style.display = "none";

                const successPanel = document.getElementById("order-success");
                if (successPanel) successPanel.style.display = "block";

                const refEl = document.getElementById("order-ref");
                if (refEl) refEl.innerText = `Order ID: #${result.order_id}`;

                showToast("Order placed successfully!");
            } else {
                const msgEl = document.getElementById("order-msg");
                if (msgEl) msgEl.innerText = result.message || "Something went wrong. Please try again.";
                showToast(result.message || "Order failed. Please try again.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        } catch (err) {
            showToast("Network error. Please check your connection.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}
