const STORAGE_KEYS = {
    cart: "agri_cart",
    farmers: "agri_demo_farmers",
    currentFarmer: "agri_current_farmer",
    orders: "agri_demo_orders"
};

const STATIC_PRODUCTS = [
    {
        product_id: 1,
        name: "Premium Paddy Seeds (1 kg)",
        price: 249,
        image: "images/seeds_paddy.png",
        description: "High-yield HYV paddy seeds suitable for Kharif season.",
        category: "Seeds",
        supplier_name: "Green Harvest Inputs",
        stock_status: "in_stock"
    },
    {
        product_id: 2,
        name: "NPK Fertilizer 5 kg Bag",
        price: 595,
        image: "images/fertilizer_npk.png",
        description: "Balanced 19-19-19 granulated fertilizer for all crops.",
        category: "Nutrition",
        supplier_name: "Agro Nutrients Co.",
        stock_status: "in_stock"
    },
    {
        product_id: 3,
        name: "Stainless Steel Hand Tool Set",
        price: 385,
        image: "images/garden_tools.png",
        description: "Trowel and cultivator set with hardwood handles.",
        category: "Tools",
        supplier_name: "Farm Essentials Depot",
        stock_status: "in_stock"
    },
    {
        product_id: 4,
        name: "Knapsack Sprayer 16 L",
        price: 990,
        image: "images/sprayer_pump.png",
        description: "HDPE backpack sprayer with adjustable brass nozzle.",
        category: "Equipment",
        supplier_name: "Precision Spray Tech",
        stock_status: "low_stock"
    },
    {
        product_id: 5,
        name: "Drip Irrigation Kit (50 plants)",
        price: 1250,
        image: "images/drip_irrigation.png",
        description: "Complete drip kit with mainline, emitters and connectors.",
        category: "Irrigation",
        supplier_name: "WaterWise Systems",
        stock_status: "in_stock"
    },
    {
        product_id: 6,
        name: "Digital Soil pH and Moisture Tester",
        price: 749,
        image: "images/soil_tester.png",
        description: "Instant-read dual meter for soil pH and moisture levels.",
        category: "Diagnostics",
        supplier_name: "AgriSense Labs",
        stock_status: "in_stock"
    }
];

const DEFAULT_FARMERS = [
    {
        farmer_id: 1,
        fullname: "Raghav Patil",
        email: "raghav.patil@example.com",
        phone: "+91 9876543210",
        address: "Nashik, Maharashtra",
        land_area: "6.5",
        service: "Crop Consultation",
        preferred_language: "English",
        created_at: "2026-04-10"
    }
];

const DEFAULT_ORDERS = [
    {
        order_id: 1012,
        customer_name: "Raghav Patil",
        phone: "+91 9876543210",
        address: "Nashik, Maharashtra",
        payment_mode: "Cash on Delivery",
        payment_status: "pending",
        total: 844,
        status: "confirmed",
        created_at: "2026-04-12 09:40",
        items: [
            { name: "Premium Paddy Seeds (1 kg)", quantity: 1, price: 249 },
            { name: "NPK Fertilizer 5 kg Bag", quantity: 1, price: 595 }
        ]
    }
];

const WEATHER_FEED = [
    {
        weather_data_id: 1,
        location: "Nashik",
        temperature: "29 C",
        humidity: "58%",
        rainfall: "2 mm",
        soil_moisture: "31%",
        weather_condition: "Partly Cloudy",
        fetched_at: "Today, 7:30 AM",
        field_signal: "Transplanting window open through late afternoon.",
        wind: "8 km/h",
        pressure: "1008 hPa",
        risk: "stable"
    },
    {
        weather_data_id: 2,
        location: "Satara",
        temperature: "26 C",
        humidity: "66%",
        rainfall: "12 mm",
        soil_moisture: "42%",
        weather_condition: "Light Rain",
        fetched_at: "Today, 7:35 AM",
        field_signal: "Delay foliar spray and avoid field traffic in low patches.",
        wind: "11 km/h",
        pressure: "1005 hPa",
        risk: "watch"
    },
    {
        weather_data_id: 3,
        location: "Pune Rural",
        temperature: "31 C",
        humidity: "47%",
        rainfall: "0 mm",
        soil_moisture: "25%",
        weather_condition: "Dry Heat",
        fetched_at: "Today, 7:40 AM",
        field_signal: "Protect young crop stands with morning irrigation and mulch.",
        wind: "14 km/h",
        pressure: "1009 hPa",
        risk: "stress"
    }
];

const ADVISORIES = [
    {
        advisory_id: 1,
        farmer: "Raghav Patil",
        soil_type: "Loamy",
        season: "Kharif",
        recommended_crop: "Paddy",
        recommendation_score: "92.5",
        generated_at: "Today, 8:10 AM",
        summary: "Maintain shallow standing water for transplantation and schedule the first nitrogen split within the next 5 days.",
        action_window: "Next 48 hours",
        field_focus: "Nursery transfer and fertilizer staging",
        moisture_note: "Current soil profile is supportive but should not move into prolonged standing water."
    },
    {
        advisory_id: 2,
        farmer: "Asha More",
        soil_type: "Black Soil",
        season: "Rabi",
        recommended_crop: "Wheat",
        recommendation_score: "88.0",
        generated_at: "Today, 8:15 AM",
        summary: "Prepare for wheat sowing with pre-irrigation and seed treatment because current soil moisture is favorable.",
        action_window: "This week",
        field_focus: "Pre-sowing irrigation and seed treatment",
        moisture_note: "Soil moisture reserves are strong enough to support a clean first pass for seedbed preparation."
    },
    {
        advisory_id: 3,
        farmer: "Demo Cluster",
        soil_type: "Sandy Loam",
        season: "Summer",
        recommended_crop: "Groundnut",
        recommendation_score: "84.5",
        generated_at: "Today, 8:20 AM",
        summary: "Use mulching and morning irrigation scheduling because afternoon evapotranspiration is trending high.",
        action_window: "Immediate",
        field_focus: "Mulch coverage and irrigation timing",
        moisture_note: "Heat load is the dominant variable, so water retention discipline matters more than volume."
    }
];

const NOTIFICATIONS = [
    { notification_id: 1, type: "Advisory", message: "Your Kharif crop advisory has been refreshed with morning weather data.", created_at: "15 min ago", is_read: false },
    { notification_id: 2, type: "Marketplace", message: "NPK Fertilizer stock is available again from Agro Nutrients Co.", created_at: "1 hour ago", is_read: false },
    { notification_id: 3, type: "Analytics", message: "Weekly farm activity summary is ready for review.", created_at: "Yesterday", is_read: true }
];

const ANALYTICS = [
    { analytics_id: 1, label: "Estimated seasonal yield", value: "21.4 q/acre", context: "Based on current irrigation and fertilizer history" },
    { analytics_id: 2, label: "Water efficiency", value: "83%", context: "Improved after drip kit adoption" },
    { analytics_id: 3, label: "Farm activity status", value: "4 active tasks", context: "Weeding, irrigation, soil test follow-up, seed dispatch" }
];

const USER_SESSIONS = [
    { session_id: 1, session_token: "session-raghav-001", login_at: "Today, 6:45 AM", expires_at: "In 6 days", status: "active" },
    { session_id: 2, session_token: "session-raghav-archive", login_at: "Apr 10, 8:10 PM", expires_at: "Expired", status: "expired" }
];

const LANGUAGE_PREFERENCES = [
    { preference_id: 1, language_code: "EN", language_name: "English", created_at: "Primary interface" },
    { preference_id: 2, language_code: "HI", language_name: "Hindi", created_at: "SMS alerts enabled" },
    { preference_id: 3, language_code: "MR", language_name: "Marathi", created_at: "Voice support preferred" }
];

function getStoredJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function setStoredJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
    return getStoredJSON(STORAGE_KEYS.cart, []);
}

function setCart(cart) {
    setStoredJSON(STORAGE_KEYS.cart, cart);
}

function getDemoFarmers() {
    const farmers = getStoredJSON(STORAGE_KEYS.farmers, DEFAULT_FARMERS);
    if (!Array.isArray(farmers) || farmers.length === 0) {
        setStoredJSON(STORAGE_KEYS.farmers, DEFAULT_FARMERS);
        return [...DEFAULT_FARMERS];
    }
    return farmers;
}

function getCurrentFarmer() {
    const current = getStoredJSON(STORAGE_KEYS.currentFarmer, null);
    return current || getDemoFarmers()[0];
}

function setCurrentFarmer(farmer) {
    setStoredJSON(STORAGE_KEYS.currentFarmer, farmer);
}

function getDemoOrders() {
    const orders = getStoredJSON(STORAGE_KEYS.orders, DEFAULT_ORDERS);
    if (!Array.isArray(orders)) {
        setStoredJSON(STORAGE_KEYS.orders, DEFAULT_ORDERS);
        return [...DEFAULT_ORDERS];
    }
    return orders;
}

function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.style.display = "block";
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0) scale(1)";

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px) scale(0.9)";
        setTimeout(() => {
            toast.style.display = "none";
        }, 400);
    }, 3000);
}

function renderProducts(products) {
    const prodList = document.getElementById("products");
    const productsEmptyState = document.getElementById("products-empty");
    if (!prodList) return;

    prodList.innerHTML = "";

    if (!products || products.length === 0) {
        if (productsEmptyState) productsEmptyState.style.display = "block";
        return;
    }

    if (productsEmptyState) productsEmptyState.style.display = "none";

    products.forEach((product, index) => {
        const li = document.createElement("li");
        li.style.animationDelay = `${index * 0.08}s`;
        li.innerHTML = `
            <img src="${product.image || "images/seeds_paddy.png"}" alt="${product.name}">
            <div class="product-meta">
                <div class="mini-pill">${product.category || "General"}</div>
                <h4>${product.name}</h4>
                <p>${product.description || ""}</p>
                <div class="product-foot">
                    <span class="product-price">Rs. ${product.price}</span>
                    <span class="product-stock">${(product.stock_status || "in_stock").replace("_", " ")}</span>
                </div>
            </div>
            <button onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price})">Add to Cart</button>
        `;
        prodList.appendChild(li);
    });
}

async function loadProducts() {
    try {
        const response = await fetch("get_products.php");
        if (!response.ok) throw new Error("Unable to load products");
        const products = await response.json();
        renderProducts(Array.isArray(products) && products.length > 0 ? products : STATIC_PRODUCTS);
    } catch (error) {
        renderProducts(STATIC_PRODUCTS);
        const status = document.getElementById("products-status");
        if (status) {
            status.innerText = "Demo mode: showing the built-in static marketplace catalog.";
        }
    }
}

function addToCart(name, price) {
    const cart = getCart();
    cart.push({ name, price });
    setCart(cart);
    showToast(`${name} added to cart.`);
}

function removeFromCart(index) {
    const cart = getCart();
    const itemName = cart[index]?.name || "Item";
    cart.splice(index, 1);
    setCart(cart);
    renderCart();
    showToast(`Removed "${itemName}" from cart.`);
}

function renderCart() {
    const cartUI = document.getElementById("cart");
    const totalUI = document.getElementById("total");
    const cartEmptyState = document.getElementById("cart-empty");
    const layout = document.getElementById("checkout-layout");
    if (!cartUI) return;

    const cart = getCart();
    cartUI.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        if (cartEmptyState) cartEmptyState.style.display = "block";
        if (layout) layout.style.display = "none";
        if (totalUI) totalUI.style.display = "none";
        return;
    }

    if (cartEmptyState) cartEmptyState.style.display = "none";
    if (layout) layout.style.display = "grid";
    if (totalUI) totalUI.style.display = "block";

    cart.forEach((item, index) => {
        total += Number(item.price);
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <span style="display:block;font-size:0.95rem;color:var(--text-primary);font-weight:600;">${item.name}</span>
                <span style="font-size:0.88rem;color:var(--accent-primary);font-weight:600;">Rs. ${item.price}</span>
            </div>
            <button class="btn-danger" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartUI.appendChild(li);
    });

    if (totalUI) totalUI.innerText = `Total: Rs. ${total}`;
}

function saveDemoRegistration(data) {
    const farmers = getDemoFarmers();
    const farmer = {
        farmer_id: Date.now(),
        fullname: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        land_area: data.land,
        service: data.service,
        preferred_language: data.language,
        created_at: new Date().toLocaleString()
    };
    farmers.unshift(farmer);
    setStoredJSON(STORAGE_KEYS.farmers, farmers);
    setCurrentFarmer(farmer);
}

function saveDemoOrder(payload) {
    const orders = getDemoOrders();
    const orderId = Math.floor(Date.now() / 1000);
    const grouped = payload.items.reduce((acc, item) => {
        const existing = acc.find((entry) => entry.name === item.name);
        if (existing) {
            existing.quantity += 1;
        } else {
            acc.push({ name: item.name, quantity: 1, price: item.price });
        }
        return acc;
    }, []);

    const order = {
        order_id: orderId,
        customer_name: payload.customer_name,
        phone: payload.phone,
        address: payload.address,
        payment_mode: payload.payment_mode,
        payment_status: payload.payment_mode === "Cash on Delivery" ? "pending" : "paid",
        total: payload.total,
        status: "demo_saved",
        created_at: new Date().toLocaleString(),
        items: grouped
    };

    orders.unshift(order);
    setStoredJSON(STORAGE_KEYS.orders, orders);
    return orderId;
}

function renderRegistrationSummary() {
    const currentFarmer = getCurrentFarmer();
    const status = document.getElementById("register-status");
    if (status && currentFarmer) {
        status.innerText = `Demo profile ready for ${currentFarmer.fullname}. Registrations fall back to local demo storage if the database is unavailable.`;
    }
}

function renderDashboard() {
    const farmer = getCurrentFarmer();
    const orders = getDemoOrders();

    const profile = document.getElementById("profile-summary");
    if (profile && farmer) {
        profile.innerHTML = `
            <div class="metric-strip">
                <div><span class="label">Farmer</span><strong>${farmer.fullname}</strong></div>
                <div><span class="label">Service</span><strong>${farmer.service}</strong></div>
                <div><span class="label">Land area</span><strong>${farmer.land_area} acres</strong></div>
                <div><span class="label">Language</span><strong>${farmer.preferred_language}</strong></div>
            </div>
            <div class="detail-list">
                <div><span>Email</span><strong>${farmer.email}</strong></div>
                <div><span>Phone</span><strong>${farmer.phone}</strong></div>
                <div><span>Address</span><strong>${farmer.address}</strong></div>
                <div><span>Joined</span><strong>${farmer.created_at}</strong></div>
            </div>
        `;
    }

    renderList("notification-list", NOTIFICATIONS, item => `
        <li>
            <div>
                <span class="list-kicker">${item.type}</span>
                <strong>${item.message}</strong>
                <small>${item.created_at}</small>
            </div>
            <span class="status-pill ${item.is_read ? "muted" : "fresh"}">${item.is_read ? "Read" : "New"}</span>
        </li>
    `);

    renderList("language-list", LANGUAGE_PREFERENCES, item => `
        <li>
            <div>
                <strong>${item.language_name}</strong>
                <small>${item.language_code}</small>
            </div>
            <span class="status-pill">${item.created_at}</span>
        </li>
    `);

    renderList("session-list", USER_SESSIONS, item => `
        <li>
            <div>
                <strong>${item.session_token}</strong>
                <small>${item.login_at} • expires ${item.expires_at}</small>
            </div>
            <span class="status-pill ${item.status === "active" ? "fresh" : "muted"}">${item.status}</span>
        </li>
    `);

    renderList("analytics-list", ANALYTICS, item => `
        <li>
            <div>
                <span class="list-kicker">${item.label}</span>
                <strong>${item.value}</strong>
                <small>${item.context}</small>
            </div>
        </li>
    `);

    renderList("dashboard-orders", orders.slice(0, 4), item => `
        <li>
            <div>
                <strong>Order #${item.order_id}</strong>
                <small>${item.created_at} • ${item.payment_mode}</small>
            </div>
            <span class="status-pill">${item.status}</span>
        </li>
    `);
}

function renderWeatherAdvisory() {
    const board = document.getElementById("climate-board");
    const current = WEATHER_FEED[0];

    if (board && current) {
        board.innerHTML = `
            <div class="climate-lead ${current.risk}">
                <div class="climate-topline">
                    <span class="mini-pill">Primary field outlook</span>
                    <span class="risk-flag ${current.risk}">${current.risk}</span>
                </div>
                <h2>${current.location} field conditions are ${current.weather_condition.toLowerCase()}.</h2>
                <p>${current.field_signal}</p>
                <div class="climate-numbers">
                    <div><span>Temp</span><strong>${current.temperature}</strong></div>
                    <div><span>Humidity</span><strong>${current.humidity}</strong></div>
                    <div><span>Wind</span><strong>${current.wind}</strong></div>
                    <div><span>Pressure</span><strong>${current.pressure}</strong></div>
                </div>
            </div>
            <div class="climate-sidecard">
                <span class="list-kicker">Field note</span>
                <h3>Moisture is usable, but timing matters more than volume.</h3>
                <p>Use the coolest part of the day for irrigation and keep mechanical activity away from wet zones after rainfall events.</p>
                <div class="signal-stack">
                    <div><span>Rainfall</span><strong>${current.rainfall}</strong></div>
                    <div><span>Soil moisture</span><strong>${current.soil_moisture}</strong></div>
                    <div><span>Updated</span><strong>${current.fetched_at}</strong></div>
                </div>
            </div>
        `;
    }

    const weatherGrid = document.getElementById("weather-grid");
    if (weatherGrid) {
        weatherGrid.innerHTML = WEATHER_FEED.map(item => `
            <article class="weather-card ${item.risk}">
                <div class="weather-card-head">
                    <div class="mini-pill">${item.location}</div>
                    <span class="risk-flag ${item.risk}">${item.risk}</span>
                </div>
                <h3>${item.weather_condition}</h3>
                <p class="weather-note">${item.field_signal}</p>
                <div class="metric-grid compact">
                    <div><span>Temperature</span><strong>${item.temperature}</strong></div>
                    <div><span>Humidity</span><strong>${item.humidity}</strong></div>
                    <div><span>Rainfall</span><strong>${item.rainfall}</strong></div>
                    <div><span>Soil moisture</span><strong>${item.soil_moisture}</strong></div>
                </div>
                <div class="weather-meta">
                    <span>${item.wind}</span>
                    <span>${item.pressure}</span>
                    <span>${item.fetched_at}</span>
                </div>
            </article>
        `).join("");
    }

    const advisoryList = document.getElementById("advisory-list");
    if (advisoryList) {
        advisoryList.innerHTML = ADVISORIES.map(item => `
            <li class="advisory-card">
                <div class="advisory-main">
                    <div class="advisory-head">
                        <div>
                            <span class="list-kicker">${item.soil_type} • ${item.season}</span>
                            <strong>${item.recommended_crop} recommendation</strong>
                        </div>
                        <span class="score-badge">${item.recommendation_score}</span>
                    </div>
                    <p>${item.summary}</p>
                    <div class="advisory-meta-grid">
                        <div><span>Action window</span><strong>${item.action_window}</strong></div>
                        <div><span>Field focus</span><strong>${item.field_focus}</strong></div>
                        <div><span>Generated</span><strong>${item.generated_at}</strong></div>
                    </div>
                </div>
                <div class="advisory-footnote">
                    <span class="list-kicker">Moisture note</span>
                    <p>${item.moisture_note}</p>
                </div>
            </li>
        `).join("");
    }
}

function renderAdmin() {
    const farmers = getDemoFarmers();
    const orders = getDemoOrders();
    const metrics = document.getElementById("admin-metrics");
    if (metrics) {
        metrics.innerHTML = `
            <article class="insight-card"><span class="list-kicker">Farmers</span><h3>${farmers.length}</h3><p>Profiles available in this demo workspace.</p></article>
            <article class="insight-card"><span class="list-kicker">Products</span><h3>${STATIC_PRODUCTS.length}</h3><p>Marketplace SKUs currently visible to users.</p></article>
            <article class="insight-card"><span class="list-kicker">Orders</span><h3>${orders.length}</h3><p>Recent order records saved locally for demo mode.</p></article>
        `;
    }

    renderTable("admin-farmers", farmers, farmer => `
        <tr>
            <td>${farmer.fullname}</td>
            <td>${farmer.service}</td>
            <td>${farmer.preferred_language}</td>
            <td>${farmer.land_area} acres</td>
            <td>${farmer.email}</td>
        </tr>
    `);

    renderTable("admin-products", STATIC_PRODUCTS, product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.supplier_name}</td>
            <td>Rs. ${product.price}</td>
            <td>${product.stock_status.replace("_", " ")}</td>
        </tr>
    `);

    renderTable("admin-orders", orders, order => `
        <tr>
            <td>#${order.order_id}</td>
            <td>${order.customer_name}</td>
            <td>${order.payment_mode}</td>
            <td>${order.status}</td>
            <td>Rs. ${order.total}</td>
        </tr>
    `);
}

function renderList(id, items, template) {
    const element = document.getElementById(id);
    if (!element) return;
    element.innerHTML = items.map(template).join("");
}

function renderTable(id, rows, template) {
    const body = document.getElementById(id);
    if (!body) return;
    body.innerHTML = rows.map(template).join("");
}

function setupRegistration() {
    const registrationForm = document.getElementById("form");
    if (!registrationForm) return;

    renderRegistrationSummary();

    registrationForm.onsubmit = async function (event) {
        event.preventDefault();

        const payload = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            password: document.getElementById("pass").value,
            address: document.getElementById("address").value.trim(),
            land: document.getElementById("land").value,
            service: document.getElementById("service").value,
            language: document.getElementById("language").value
        };

        if (payload.name.length < 3) {
            showToast("Please enter a valid full name.");
            return;
        }

        if (payload.password.length < 8) {
            showToast("Password must be at least 8 characters.");
            return;
        }

        const btn = registrationForm.querySelector('button[type="submit"]');
        const msgEl = document.getElementById("msg");
        const originalText = btn.innerText;
        btn.innerText = "Registering...";
        btn.disabled = true;

        try {
            const response = await fetch("register.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: [
                    `fullname=${encodeURIComponent(payload.name)}`,
                    `email=${encodeURIComponent(payload.email)}`,
                    `phone=${encodeURIComponent(payload.phone)}`,
                    `password=${encodeURIComponent(payload.password)}`,
                    `address=${encodeURIComponent(payload.address)}`,
                    `land=${encodeURIComponent(payload.land)}`,
                    `service=${encodeURIComponent(payload.service)}`,
                    `preferred_language=${encodeURIComponent(payload.language)}`
                ].join("&")
            });

            const result = await response.text();
            if (!response.ok || !result.includes("Success")) {
                throw new Error(result || "Registration unavailable");
            }

            msgEl.innerText = "Registration saved successfully.";
            registrationForm.reset();
            showToast("Account created successfully.");
        } catch (error) {
            saveDemoRegistration(payload);
            msgEl.innerText = "Database unavailable. Saved in local demo mode so you can continue the showcase.";
            registrationForm.reset();
            showToast("Saved in demo mode.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}

function setupCheckout() {
    const orderForm = document.getElementById("order-form");
    if (!orderForm) return;

    renderCart();

    orderForm.onsubmit = async function (event) {
        event.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }

        const payload = {
            customer_name: document.getElementById("cust-name").value.trim(),
            phone: document.getElementById("cust-phone").value.trim(),
            address: document.getElementById("cust-address").value.trim(),
            payment_mode: document.getElementById("payment-mode").value,
            items: cart,
            total: cart.reduce((sum, item) => sum + Number(item.price), 0)
        };

        if (payload.customer_name.length < 2 || payload.phone.length < 6 || payload.address.length < 4) {
            showToast("Please complete all delivery details.");
            return;
        }

        const btn = document.getElementById("place-order-btn");
        const originalText = btn.innerText;
        btn.innerText = "Placing Order...";
        btn.disabled = true;

        try {
            const response = await fetch("place_order.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: [
                    `customer_name=${encodeURIComponent(payload.customer_name)}`,
                    `phone=${encodeURIComponent(payload.phone)}`,
                    `address=${encodeURIComponent(payload.address)}`,
                    `payment_mode=${encodeURIComponent(payload.payment_mode)}`,
                    `items=${encodeURIComponent(JSON.stringify(payload.items))}`,
                    `total=${payload.total}`
                ].join("&")
            });

            const result = await response.json();
            if (!response.ok || result.status !== "success") {
                throw new Error(result.message || "Order unavailable");
            }

            completeOrder(result.order_id, false);
        } catch (error) {
            const demoOrderId = saveDemoOrder(payload);
            completeOrder(demoOrderId, true);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    };
}

function completeOrder(orderId, demoMode) {
    setCart([]);
    const layout = document.getElementById("checkout-layout");
    const successPanel = document.getElementById("order-success");
    const refEl = document.getElementById("order-ref");
    const subline = document.getElementById("order-success-note");

    if (layout) layout.style.display = "none";
    if (successPanel) successPanel.style.display = "block";
    if (refEl) refEl.innerText = `Order ID: #${orderId}`;
    if (subline) {
        subline.innerText = demoMode
            ? "This order was stored in local demo mode because no database connection is active."
            : "The order was saved successfully.";
    }
    showToast(demoMode ? "Order saved in demo mode." : "Order placed successfully!");
}

function initPage() {
    setupRegistration();
    setupCheckout();

    if (document.getElementById("products")) loadProducts();
    if (document.getElementById("profile-summary")) renderDashboard();
    if (document.getElementById("weather-grid")) renderWeatherAdvisory();
    if (document.getElementById("admin-metrics")) renderAdmin();
    if (document.getElementById("cart")) renderCart();
}

window.addEventListener("DOMContentLoaded", initPage);
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
