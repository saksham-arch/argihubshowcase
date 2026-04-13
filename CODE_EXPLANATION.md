# AgriAdvisory Hub — Complete Codebase Explanation

> Every file, every key line — fully explained.

> Update note: this file documents the original MySQL-only version. For the current runnable version with PDO, dual MySQL/PostgreSQL support, normalized schema, and test setup, use [docs/IMPLEMENTATION_OVERVIEW.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/docs/IMPLEMENTATION_OVERVIEW.md) and [RUN_AND_DEPLOY.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/RUN_AND_DEPLOY.md).

---

## Table of Contents
1. [db_connect.php](#1-db_connectphp)
2. [register.php](#2-registerphp)
3. [get_products.php](#3-get_productsphp)
4. [script.js](#4-scriptjs)
5. [index.html](#5-indexhtml)
6. [register.html](#6-registerhtml)
7. [products.html](#7-productshtml)
8. [checkout.html](#8-checkouthtml)
9. [style.css](#9-stylecss)
10. [images/ folder](#10-images-folder)

---

## 1. `db_connect.php`
*7 lines. Establishes the connection between PHP and the MySQL database.*

```php
1:  <?php
```
Opens the PHP code block. Everything between `<?php` and `?>` is executed server-side.

```php
2:  $conn = new mysqli("localhost","root","","agriadvisory");
```
Creates a new MySQLi (MySQL Improved) database connection object and assigns it to `$conn`. The four arguments are:
- `"localhost"` — The database server is on the same machine (standard for XAMPP)
- `"root"` — The database username (default XAMPP username)
- `""` — The password (empty string — default for XAMPP with no password set)
- `"agriadvisory"` — The name of the database to connect to

```php
3:  (blank line)
4:  if($conn->connect_error){
```
Checks the `connect_error` property of the `$conn` object. If it is not null/false, the connection failed.

```php
5:  die("Connection Failed: ".$conn->connect_error);
```
`die()` terminates the PHP script immediately and outputs a string. This concatenates `"Connection Failed: "` with the actual error message. This prevents the rest of the app from running on a broken connection.

```php
6:  }
```
Closes the `if` block.

```php
7:  ?>
```
Closes the PHP code block. Any file that does `include "db_connect.php"` will now have the `$conn` variable available.

---

## 2. `register.php`
*20 lines. Receives farmer data via POST and inserts it into the MySQL database.*

```php
1:  <?php
```
Opens the PHP block.

```php
2:  include "db_connect.php";
```
Imports and runs `db_connect.php`. This makes the `$conn` (database connection) variable available in this file's scope.

```php
3:  (blank line)
4:  $fullname = $_POST['fullname'];
```
`$_POST` is a PHP superglobal array containing all data sent via HTTP POST. This reads the value of the field named `fullname` from the form submission and stores it in `$fullname`.

```php
5:  $email = $_POST['email'];
```
Reads the `email` field from the POST data.

```php
6:  $phone = $_POST['phone'];
```
Reads the `phone` field from the POST data.

```php
7:  $password = $_POST['password'];
```
Reads the `password` field. ⚠️ In production, this should be hashed with `password_hash()` before storing.

```php
8:  $address = $_POST['address'];
```
Reads the `address` textarea value from the POST data.

```php
9:  $land = $_POST['land'];
```
Reads the land area (in acres) from the POST data.

```php
10: $service = $_POST['service'];
```
Reads the selected service option (e.g., "Soil Testing" or "Crop Consultation").

```php
11: (blank line)
12: $sql = "INSERT INTO farmers(fullname,email,phone,password,address,land_area,service)
13: VALUES('$fullname','$email','$phone','$password','$address','$land','$service')";
```
Builds a SQL `INSERT` query string as a multi-line PHP string. The values are embedded directly using string interpolation. The column names (line 12) match the `farmers` table schema. ⚠️ This pattern is vulnerable to SQL injection and should use prepared statements in production.

```php
14: (blank line)
15: if($conn->query($sql)){
```
Executes the SQL query using the `$conn` connection object's `query()` method. Returns `true` on success.

```php
16: echo "Success";
```
Sends the plain text string `"Success"` back as the HTTP response body, which JavaScript reads via `.then(res => res.text())`.

```php
17: }else{
```
If the query returned false (execution failed):

```php
18: echo "Error";
```
Sends `"Error"` back as the response body.

```php
19: }
20: ?>
```
Closes the if/else and the PHP block.

---

## 3. `get_products.php`
*13 lines. Fetches all products from the database and returns them as JSON.*

```php
1:  <?php
```
Opens the PHP block.

```php
2:  include "db_connect.php";
```
Imports the database connection. `$conn` is now available.

```php
3:  (blank line)
4:  $result = $conn->query("SELECT * FROM products");
```
Executes a SQL `SELECT *` query to retrieve every row from the `products` table. The result is a `mysqli_result` object stored in `$result`.

```php
5:  (blank line)
6:  $data = [];
```
Initializes an empty PHP array called `$data`. This will hold all the product rows.

```php
7:  (blank line)
8:  while($row = $result->fetch_assoc()){
```
A `while` loop that fetches one row at a time from `$result`. `fetch_assoc()` returns each row as an **associative array** (column names as keys). When there are no more rows, it returns `null` and the loop exits.

```php
9:  $data[] = $row;
```
Appends the current `$row` associative array to the `$data` array. `$data[]` is shorthand for pushing to the end of the array.

```php
10: }
```
Closes the while loop.

```php
11: (blank line)
12: echo json_encode($data);
```
`json_encode()` converts the PHP array `$data` into a valid JSON string. `echo` outputs it as the HTTP response. JavaScript's `fetch().then(res => res.json())` parses this back into a JS array of objects.

```php
13: ?>
```
Closes the PHP block.

---

## 4. `script.js`
*All frontend application logic — cart state, static product catalogue, registration, products, cart rendering, and toasts.*

```javascript
1:  // Initialize cart from localStorage
2:  let cart = JSON.parse(localStorage.getItem("cart")) || [];
```
`localStorage.getItem("cart")` retrieves the stored cart string from the browser's LocalStorage. If it doesn't exist (first visit), it returns `null`. `JSON.parse()` converts the JSON string back to a JavaScript array. The `|| []` short-circuit fallback means if the result is `null` or falsy, start with an empty array `[]`.

```javascript
const STATIC_PRODUCTS = [ ... ];
```
A hardcoded array of 6 agricultural product objects. Each object has `id`, `name`, `price`, `image` (a local path to `images/`), and `description`. This array is used as a fallback when `get_products.php` is unreachable or returns an empty array — so the products page always shows content, even without a running database.

---

### `showToast(message)` — Lines 4–30
```javascript
4:   * TOAST NOTIFICATION SYSTEM
5:   * Replaces the default alert() with a premium floating toast
6:   */
7:  (blank)
8:  function showToast(message) {
```
Defines the reusable toast notification function.

```javascript
9:      // Create toast element if it doesn't exist
10:     let toast = document.querySelector('.toast');
```
`querySelector('.toast')` searches the DOM for an existing element with the class `toast`.

```javascript
11:     if (!toast) {
12:         toast = document.createElement('div');
```
If no toast element exists in the DOM, create a new `<div>` element.

```javascript
13:         toast.className = 'toast';
```
Assigns the CSS class `toast` to the new div, which styles it as a fixed bottom-right notification pill (styled in `style.css`).

```javascript
14:         document.body.appendChild(toast);
```
Appends the toast div to the end of the `<body>` so it's in the DOM and can be shown/hidden.

```javascript
15:     }
16: (blank)
17:     toast.innerText = message;
```
Sets the visible text of the toast to the passed `message` argument.

```javascript
18:     toast.style.display = 'block';
```
Makes the toast visible by switching it from `display: none` to `display: block`.

```javascript
20:     // Auto-hide after 3 seconds
21:     setTimeout(() => {
```
`setTimeout()` schedules a callback to run after a delay. Here the delay is the 3rd argument (3000) — 3000 milliseconds = 3 seconds.

```javascript
22:         toast.style.opacity = '0';
23:         toast.style.transform = 'translateY(20px) scale(0.9)';
```
Starts the exit animation — fades out and moves down + shrinks slightly.

```javascript
24:         setTimeout(() => {
25:             toast.style.display = 'none';
```
After another 400ms (the animation duration), hides the toast completely.

```javascript
26:             toast.style.opacity = '1';
27:             toast.style.transform = 'translateY(0) scale(1)';
```
Resets the transform/opacity so it's ready for the next toast call.

```javascript
28:         }, 400);
29:     }, 3000);
30: }
```
Closes both `setTimeout` callbacks and the function.

---

### Registration Logic — Lines 32–88

```javascript
35: const registrationForm = document.getElementById("form");
```
Gets the `<form id="form">` element from the DOM. Returns `null` if not on `register.html`.

```javascript
36: if (registrationForm) {
```
Guard clause — only runs the registration logic if the form element actually exists on the current page.

```javascript
37:     registrationForm.onsubmit = async function(e) {
```
Attaches an `async` submit handler to the form. `async` allows use of `await` inside.

```javascript
38:         e.preventDefault();
```
Prevents the browser's default form submission behavior (which would reload/navigate the page). We handle submission manually with fetch.

```javascript
41:         const name = document.getElementById("name").value;
42:         const email = document.getElementById("email").value;
43:         const phone = document.getElementById("phone").value;
44:         const pass = document.getElementById("pass").value;
45:         const address = document.getElementById("address").value;
46:         const land = document.getElementById("land").value;
47:         const service = document.getElementById("service").value;
```
Reads the current value of each form input by their `id` attributes.

```javascript
50:         if (name.length < 3) {
51:             showToast("Please enter a valid full name.");
52:             return;
```
Client-side validation: if the name is fewer than 3 characters, show a toast and `return` (stop the function early).

```javascript
54:         if (pass.length < 8) {
55:             showToast("Password must be at least 8 characters.");
56:             return;
```
Validates the password is at least 8 characters.

```javascript
60:         const btn = registrationForm.querySelector('button');
61:         const originalText = btn.innerText;
62:         btn.innerText = "Registering...";
63:         btn.disabled = true;
```
UX loading state: Finds the submit button, saves its original text, changes it to "Registering...", and disables it to prevent double-submission.

```javascript
65:         try {
66:             const response = await fetch("register.php", {
67:                 method: "POST",
68:                 headers: { "Content-Type": "application/x-www-form-urlencoded" },
69:                 body: `fullname=${encodeURIComponent(name)}&email=...`
70:             });
```
`await fetch()` sends a POST HTTP request to `register.php`. The `Content-Type` header tells the server the body is URL-encoded form data. `encodeURIComponent()` safely encodes special characters in user input.

```javascript
72:             const result = await response.text();
```
`await response.text()` reads the response body as a plain text string (either `"Success"` or `"Error"` from PHP).

```javascript
74:             if (result.includes("Success")) {
75:                 document.getElementById("msg").innerText = "🎉 Registration Successful! Welcome to the Hub.";
76:                 registrationForm.reset();
77:                 showToast("Account created successfully!");
```
If the PHP returned "Success": Update the `#msg` element's text, reset all form fields with `reset()`, and show a success toast.

```javascript
78:             } else {
79:                 showToast("Error during registration. Please try again.");
```
If PHP returned "Error", shows an error toast.

```javascript
81:         } catch (error) {
82:             showToast("Network error. Please check your connection.");
```
`try/catch` catches any network-level errors (e.g., server offline, DNS failure).

```javascript
83:         } finally {
84:             btn.innerText = originalText;
85:             btn.disabled = false;
```
`finally` runs regardless of success or failure — always restores the button to its original text and re-enables it.

---

### Product Listing — Lines 90–125

```javascript
93: const prodList = document.getElementById("products");
94: const productsEmptyState = document.getElementById("products-empty");
```
Gets the `<ul id="products">` container and the empty state `<div>` (both on `products.html`).

```javascript
96: if (prodList) {
97:     fetch("get_products.php")
```
Only runs on the products page. Sends a GET request to `get_products.php`.

```javascript
98:         .then(res => res.json())
```
`.then()` chains a callback. `res.json()` parses the response body as JSON and returns a JavaScript array.

```javascript
99:         .then(data => {
100:             if (data.length === 0) {
101:                 if (productsEmptyState) productsEmptyState.style.display = 'block';
102:                 return;
```
If the products array is empty, show the empty state UI and stop further rendering.

```javascript
105:             data.forEach(p => {
106:                 const li = document.createElement("li");
```
Loops through each product object `p`. Creates a `<li>` element for each.

```javascript
107:                 li.innerHTML = `
108:                     <img src="${p.image || 'placeholder URL'}" alt="${p.name}">
109:                     <div>
110:                         <h4>${p.name}</h4>
111:                         <div>₹${p.price}</div>
112:                     </div>
113:                     <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
114:                 `;
```
Sets the inner HTML of the `<li>` using a template literal. `p.image || 'fallback'` shows a placeholder if no image URL is stored. The button's `onclick` calls `addToCart()` with the product's name and price.

```javascript
115:                 prodList.appendChild(li);
```
Adds the newly created `<li>` to the `<ul id="products">` container.

```javascript
118:         .catch(err => {
119:             if (productsEmptyState) {
120:                 productsEmptyState.innerHTML = '<div>⚠️</div><p>Failed to load products...</p>';
121:                 productsEmptyState.style.display = 'block';
```
`.catch()` handles fetch failures (e.g., no PHP server running). Shows a warning in the empty state.

---

### `addToCart(name, price)` — Lines 130–136

```javascript
130: function addToCart(name, price) {
131:     cart.push({ name, price });
```
`cart.push()` adds a new object `{ name: name, price: price }` (ES6 shorthand: `{ name, price }`) to the array.

```javascript
132:     localStorage.setItem("cart", JSON.stringify(cart));
```
`JSON.stringify()` converts the cart array to a JSON string. `localStorage.setItem()` persists it to the browser — survives page navigation and refresh.

```javascript
135:     showToast(`Added ${name} to cart!`);
136: }
```
Gives the user visual feedback by showing a toast notification with the product name.

---

### Cart Rendering — Lines 138–177

```javascript
141: const cartUI = document.getElementById("cart");
142: const totalUI = document.getElementById("total");
143: const cartEmptyState = document.getElementById("cart-empty");
```
Gets the three key elements on `checkout.html`: the cart `<ul>`, the total `<h3>`, and the empty state `<div>`.

```javascript
145: if (cartUI) {
146:     renderCart();
```
Only runs on checkout page. Immediately calls `renderCart()` to display the current cart.

```javascript
149: function renderCart() {
150:     cartUI.innerHTML = "";
```
Clears the existing cart list HTML, so the function can re-render from scratch (used after deletions).

```javascript
151:     let total = 0;
```
Initializes a running total for summing up all item prices.

```javascript
153:     if (cart.length === 0) {
154:         if (cartEmptyState) cartEmptyState.style.display = 'block';
155:         if (totalUI) totalUI.style.display = 'none';
156:         return;
```
If the cart array is empty, show the empty state message, hide the total, and stop execution.

```javascript
159:     if (cartEmptyState) cartEmptyState.style.display = 'none';
160:     if (totalUI) totalUI.style.display = 'block';
```
If there ARE items, make sure the empty state is hidden and the total is visible.

```javascript
162:     cart.forEach((item, index) => {
163:         total += item.price;
```
Loops through every cart item. Accumulates the price into `total`.

```javascript
165:         const li = document.createElement("li");
166:         li.innerHTML = `
167:             <div>
168:                 <span>${item.name}</span>
169:                 <span>₹${item.price}</span>
170:             </div>
171:             <button class="btn-danger" onclick="removeFromCart(${index})">Remove</button>
172:         `;
```
Creates a list item for the cart entry with the name, price, and a "Remove" button. The button passes the current `index` to `removeFromCart()`. The `btn-danger` class makes it red (styled in CSS).

```javascript
173:         cartUI.appendChild(li);
174:     });
```
Adds the cart item `<li>` to the `<ul id="cart">`.

```javascript
176:     if (totalUI) totalUI.innerText = "Total Order Amount: ₹" + total;
177: }
```
Updates the `#total` element's text with the accumulated sum.

---

### `removeFromCart(index)` — Lines 182–190

```javascript
182: function removeFromCart(index) {
183:     const itemName = cart[index].name;
```
Saves the item's name before removing it (used in the toast message).

```javascript
184:     cart.splice(index, 1);
```
`Array.splice(index, deleteCount)` — removes 1 element starting at `index`. This mutates the `cart` array in-place.

```javascript
185:     localStorage.setItem("cart", JSON.stringify(cart));
```
Persists the updated (shorter) cart back to LocalStorage.

```javascript
188:     renderCart();
```
Calls `renderCart()` to re-render the entire cart UI from the updated `cart` array (instead of reloading the page).

```javascript
189:     showToast(`Removed ${itemName} from cart.`);
```
Shows a toast notification confirming what was removed.

```javascript
192: // Global exposure for onclick attributes
193: window.addToCart = addToCart;
194: window.removeFromCart = removeFromCart;
```
Since buttons in dynamically rendered HTML use `onclick="addToCart(...)"` as inline attributes, those functions must be accessible on the global `window` object. Explicitly attaching them to `window` ensures this works even in strict module environments.

---

## 5. `index.html`
*The landing page.*

```html
1:  <!DOCTYPE html>
```
Declares the document as HTML5.

```html
2:  <html lang="en">
```
Root element with language set to English for accessibility and SEO.

```html
3:  <head>
4:    <meta charset="UTF-8">
```
Sets character encoding to UTF-8 (supports all unicode characters including ₹ symbol and emojis).

```html
5:    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Critical for responsive design — tells the browser to match the screen width and start at 1:1 zoom. Without this, mobile browsers would render a zoomed-out desktop view.

```html
6:    <meta name="description" content="AgriAdvisory Hub — Smart farming assistant...">
```
SEO meta description — shown by search engines under the page title in results.

```html
7:    <title>AgriAdvisory Hub — Smart Farming Assistant</title>
```
The browser tab/window title. Also used by search engines as the clickable result link.

```html
8:    <link rel="stylesheet" href="style.css">
```
Links the external stylesheet. The browser loads and applies `style.css` before rendering.

```html
9:  </head>
10: (blank)
11: <body>
```
The visible page content begins here.

```html
13:   <nav>
14:     <a href="index.html" class="active">Home</a>
15:     <a href="register.html">Register</a>
16:     <a href="products.html">Products</a>
17:     <a href="checkout.html">Cart</a>
18:   </nav>
```
Navigation bar. Each `<a>` is a link to a page. The `class="active"` on the current page's link triggers the active green pill styling in CSS.

```html
20:   <header>
21:     <span class="badge">Smart Agriculture Platform</span>
```
The badge is a small pill/label using the `.badge` CSS class (green glow outline). No emoji text — clean plain text.

```html
22:     <h1>AgriAdvisory Hub</h1>
```
The primary page heading. Styled with a large gradient text (green tones) and `fadeInUp` animation.

```html
23:     <p>Your Smart Farming Assistant</p>
```
Sub-headline. Styled as uppercase, letter-spaced, lighter weight secondary text.

```html
24:   </header>
25: (blank)
26:   <div class="section">
```
A glassmorphism card container styled with `.section` — blurred, dark-green translucent background.

```html
27:     <h2>Welcome, Farmer</h2>
```
Section heading — includes a green left-border accent via the `h2::before` CSS pseudo-element.

```html
28:–32: <p> block
```
Introductory paragraph describing the platform's purpose.

```html
34:     <div class="features">
```
CSS Grid container for the feature cards (uses `auto-fit, minmax(240px, 1fr)`).

```html
35:       <div class="feature-card">
36:         <div class="feature-icon"><svg ...></svg></div>
37:         <h3>Crop Recommendations</h3>
38:         <p>Get data-driven insights tailored to your soil, climate...</p>
39:       </div>
```
One feature card. The icon is an inline SVG inside a `.feature-icon` div — styled as a rounded square container with a green glow background. Using inline SVG instead of emoji ensures consistent rendering across all browsers and operating systems. Three more identical cards follow with different SVG icons (Registration, Marketplace, Advisory).

```html
58:   <footer>
59:     <p>© 2026 AgriAdvisory Hub. Built for farmers, by farmers.</p>
60:   </footer>
```
Page footer with copyright text.

---

## 6. `register.html`
*The farmer registration page.*

```html
1–11: (DOCTYPE, html, head)
```
Standard head setup identical to index.html, with a different title and description meta tag.

```html
<nav>
  <a href="register.html" class="active">Register</a>
  ...
</nav>
```
Nav bar with `class="active"` on the Register link so it displays as a filled green pill.

```html
<header>
    <span class="badge">Join the Hub</span>
    <h1>Farmer Registration</h1>
    <p>Create your profile and unlock advisory services</p>
</header>
```
Page header with plain-text badge (no emoji) and page-specific heading.

```html
28:     <div class="section">
29:         <h2>Create Your Account</h2>
30: (blank)
31:         <form id="form">
```
The form element with `id="form"` — this ID is used by `script.js` to detect and attach the submit handler.

```html
32:             <div class="form-group">
33:                 <label for="name">Full Name</label>
34:                 <input type="text" id="name" placeholder="Enter your full name" required>
35:             </div>
```
A `.form-group` wrapper div groups a label and its input. `for="name"` on the label links it to the `id="name"` input (clicking the label focuses the input). `required` triggers HTML5 native validation.

```html
36–45:  Email and Phone form-groups (similar pattern)
```
Email uses `type="email"` for built-in email format validation. Phone uses `type="text"` to allow flexible formats.

```html
47–50: Password form-group
```
`type="password"` masks the input characters.

```html
52–55: Farm Address form-group
```
Uses a `<textarea>` for multi-line text input. Styled to be vertically resizable and minimum 100px tall.

```html
57–60: Land Area form-group
```
`type="number"` enforces numeric input.

```html
62–68: Service dropdown form-group
```
`<select>` dropdown with two `<option>` choices: "Soil Testing" and "Crop Consultation".

```html
<button type="submit" style="margin-top: 16px;">Register Now</button>
```
The submit button. `type="submit"` triggers the form's `onsubmit` event. Plain text — no special characters needed because the button's visual style (gradient, glow, hover lift) conveys the call-to-action.

```html
73:         <p id="msg"></p>
```
An empty paragraph that `script.js` fills with success/error messages after form submission. CSS hides it when empty using `#msg:empty { display: none; }`.

```html
80:     <script src="script.js"></script>
```
Links the JavaScript file. Placed at the bottom of `<body>` so the DOM is fully loaded before the script runs.

---

## 7. `products.html`
*The marketplace page.*

```html
<!-- standard head + nav with 'Products' marked active -->
<header>
    <span class="badge">Agri Marketplace</span>
    <h1>Agricultural Products</h1>
    <p>Seeds, fertilizers and tools for your farm</p>
</header>
```
Plain-text badge — no emoji.

```html
<div class="section">
    <h2>Browse Products</h2>
    <ul id="products"></ul>
```
The empty `<ul>` list has NO content in HTML. It is completely populated at runtime by `script.js` — either from `get_products.php` (database) or from the `STATIC_PRODUCTS` array (fallback).

```html
<div id="products-empty" class="empty-state" style="display:none;">
    <p>No products available right now. Check back soon.</p>
</div>
```
A hidden empty state. `style="display:none;"` hides it by default. `script.js` shows it only if both the server fetch AND the static fallback return nothing — which in practice should never happen given the six built-in products.

---

## 8. `checkout.html`
*The shopping cart page.*

```html
1–25: (standard head + nav with 'Cart' active)
```

```html
27:     <div class="section">
28:         <h2>Your Items</h2>
29: (blank)
30:         <ul id="cart"></ul>
```
Empty cart list — same pattern as products. `script.js` reads LocalStorage and renders cart items here.

```html
<div id="cart-empty" class="empty-state" style="display:none;">
    <p>Your cart is empty. <a href="products.html">Browse products</a></p>
</div>
```
Empty state for the cart. Includes an anchor link for the user to navigate back to the products page. No emoji — clean text with a styled link.

```html
38:         <h3 id="total"></h3>
```
The total order amount display element. Empty in HTML; filled by `script.js` with the computed total. Hidden via CSS when empty.

---

## 9. `style.css`
*The complete design system.*

### Lines 1–2 — Google Fonts Import
```css
1: /* ===== GOOGLE FONTS ===== */
2: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
```
`@import` fetches the Inter font family from Google's CDN. Weights 300–800 are loaded. `&display=swap` ensures text renders immediately with a system font while Inter loads (prevents invisible text flash).

---

### Lines 4–37 — CSS Custom Properties (`:root`)
```css
5:  :root {
6:    --bg-primary: #0a1a0f;
```
`:root` is the highest-level selector (equivalent to `html`). CSS variables defined here are globally accessible. `--bg-primary` is the darkest background — a very deep near-black forest green.

```css
7:    --bg-secondary: #0f261a;
```
Slightly lighter secondary background for nested sections.

```css
8:    --bg-card: rgba(20, 60, 35, 0.45);
```
Card backgrounds use RGBA with 45% opacity — creates the glassmorphism translucent effect.

```css
9:    --bg-card-hover: rgba(30, 80, 50, 0.55);
```
Slightly more opaque and brighter on hover for a lift effect.

```css
10:   --bg-glass: rgba(255, 255, 255, 0.04);
```
Near-invisible white overlay — a very subtle glass sheen for form fields and list items.

```css
12:   --accent-primary: #34d399;
```
Bright emerald green — the primary call-to-action color for buttons, links, active states.

```css
13:   --accent-secondary: #10b981;
```
A slightly darker emerald — used as the second stop in gradient backgrounds.

```css
14:   --accent-glow: rgba(52, 211, 153, 0.25);
```
A semi-transparent version of `--accent-primary` used for glowing shadows and hover overlays.

```css
15:   --accent-dark: #059669;
```
The darkest shade in the green palette — used in gradient headings and decorative bars.

```css
17:   --text-primary: #e8f5e9;
```
Off-white with a green tint — main body text color for maximum readability on dark backgrounds.

```css
18:   --text-secondary: #a7c4b5;
```
Dimmer green-grey — for less important text like labels and nav links.

```css
19:   --text-muted: #5f8a72;
```
Very dim green — for placeholders, footers, and captions.

```css
21:   --border-color: rgba(52, 211, 153, 0.15);
23:   --border-glow: rgba(52, 211, 153, 0.35);
```
Border colors in two intensities — subtle on rest, more saturated on hover.

```css
24–27: Shadow variables (sm, md, lg, glow)
```
Layered shadow values at increasing depths, plus a green glow shadow for hover states.

```css
29–32: Border radius variables (sm: 8px, md: 14px, lg: 20px, xl: 28px)
```
Consistent rounding scale for different component sizes.

```css
34:   --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
35:   --transition-smooth: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
36:   --transition-bounce: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
```
Three transition speeds. The first two use Material Design's standard easing curve. `--transition-bounce` uses an overshoot curve (value > 1) that creates a springy bounce effect.

---

### Lines 39–57 — Reset & Base
```css
40: *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
```
Universal CSS reset. Removes all default browser margin/padding. `box-sizing: border-box` makes padding/border included within declared width/height (essential for predictable layouts).

```css
46–48: html { scroll-behavior: smooth; }
```
Enables smooth scrolling when navigating to anchor links.

```css
50: body { font-family: 'Inter', ...; background: var(--bg-primary); ... }
```
Sets Inter as the font stack with system fallbacks. Applies the dark green background and off-white text color globally. `min-height: 100vh` ensures the page fills at least the full viewport. `overflow-x: hidden` prevents accidental horizontal scroll (common issue with wide animations).

---

### Lines 59–73 — Animated Background
```css
60: body::before { content: ''; position: fixed; ... }
```
Creates a pseudo-element that covers the entire viewport (fixed position, 100% width/height). Since it has no actual content (`content: ''`), it only shows its background.

```css
67–70: background: radial-gradient(ellipse ... )
```
Three overlapping radial gradients of very low opacity green. They're positioned at different corners. Together they create a subtle environmental glow effect. `pointer-events: none` ensures clicks pass through it. `z-index: 0` puts it behind all real content.

---

### Lines 75–137 — Navigation Bar
```css
76: nav { position: sticky; top: 0; z-index: 100; ... }
```
`sticky` keeps the nav visible at the top as the user scrolls. `z-index: 100` keeps it above all page content.

```css
80: background: rgba(10, 26, 15, 0.85);
81: backdrop-filter: blur(20px) saturate(1.5);
```
Semi-transparent background + `backdrop-filter` creates the frosted glass effect. `saturate(1.5)` slightly boosts color behind the blur.

```css
85–88: display: flex; justify-content: center; align-items: center; gap: 8px;
```
Flexbox layout centers nav links horizontally with 8px gap between them.

```css
106: nav a::before { content: ''; position: absolute; inset: 0; background: var(--accent-glow); opacity: 0; transform: scale(0.8); ... }
```
A hidden pseudo-element fills the link area. On hover, it scales to 1 and becomes visible — creating a radial glow behind the link text.

```css
127: nav a.active { color: var(--bg-primary); background: linear-gradient(135deg, ...); }
```
Active links have a solid gradient green background with dark text (inverted from default), making the current page visually obvious.

---

### Lines 139–207 — Header / Hero
```css
140: header { position: relative; text-align: center; padding: 80px 30px 70px; background: linear-gradient(160deg, ...); }
```
Large padded hero area with a diagonal linear-gradient overlay.

```css
154: header::before { ... animation: heroFloat 20s ease-in-out infinite alternate; }
```
A large pseudo-element behind the header (positioned off-screen top-left at `-50%`) contains additional radial gradients. The `heroFloat` animation slowly moves it — creating a subtle living background effect. `infinite alternate` means it plays forward then backward endlessly.

```css
173: header::after { background: linear-gradient(to top, var(--bg-primary), transparent); }
```
A gradient fade at the bottom of the header that transitions into the main background — creating a seamless blend.

```css
184: header h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); background: linear-gradient(...); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
```
`clamp()` makes the font fluid between a min and max based on viewport width. The gradient background applied to the text, with `-webkit-text-fill-color: transparent`, creates gradient-colored text (a popular modern effect).

---

### Lines 209–245 — Keyframe Animations
```css
210: @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
```
Elements start invisible and 30px below, then animate to fully opaque at their natural position.

```css
221: @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
```
Simple opacity fade.

```css
226: @keyframes slideUp
```
Like `fadeInUp` but 40px offset — slightly more dramatic.

```css
237: @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
```
Gentle pulsing scale effect (defined but not applied by default — available for use).

```css
242: @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
```
Shifts a gradient background from -200% to 200% along the X axis — creates a light-sweep sheen effect across buttons on hover.

---

### Lines 247–294 — `.section` Card
```css
248: .section { ... background: var(--bg-card); backdrop-filter: blur(16px); ... border-radius: var(--radius-lg); animation: slideUp 0.6s ... }
```
The main content card. Has glassmorphism (blurred, semi-transparent), rounded corners (20px), border, shadow, and slides up on page load.

```css
264: .section:hover { border-color: var(--border-glow); box-shadow: ..., var(--shadow-glow); transform: translateY(-2px); }
```
On hover: the border brightens, a green glow appears around the card, and it lifts 2px.

```css
280: .section h2::before { content: ''; width: 4px; height: 28px; background: linear-gradient(...); }
```
Adds a decorative vertical green bar before every section heading — a common modern design detail for visual hierarchy.

---

### Lines 296–344 — Form Inputs
```css
297: input, select, textarea { ... background: var(--bg-glass); border: 1px solid var(--border-color); font-family: 'Inter'; ... }
```
All form elements get a consistent transparent glass background, thin green border, Inter font, and smooth transitions.

```css
319: input:focus, select:focus, textarea:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-glow); }
```
Focus states show a bright green border with a 3px glow ring around the field — clear visual indicator of which field is active.

```css
332–339: select { appearance: none; background-image: url("data:image/svg+xml..."); }
```
Removes the browser's default dropdown arrow. Injects a custom green SVG chevron icon as a data URI background image.

---

### Lines 346–400 — Buttons
```css
347: button { ... background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px var(--accent-glow); }
```
Pill-shaped (50px radius) gradient green buttons with a subtle glow shadow.

```css
364: button::after { ... background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%); animation: shimmer 3s infinite; opacity: 0; }
```
An invisible shine layer that becomes visible on hover — sweeping left to right across the button.

```css
375: button:hover { transform: translateY(-2px) scale(1.02); }
```
Lifts and slightly enlarges the button on hover.

```css
384: button:active { transform: translateY(0) scale(0.98); }
```
Slightly depresses the button on click for a tactile press feel.

```css
390: button.btn-danger, li button { background: linear-gradient(135deg, #ef4444, #dc2626); }
```
Delete/Remove buttons use a red gradient instead of green. `li button` targets buttons inside list items (cart remove buttons).

---

### Lines 402–470 — Products Grid
```css
403: #products { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 24px; }
```
CSS Grid with automatic column count — each column is at least 270px wide and grows to fill available space. `auto-fill` vs `auto-fit`: fills the grid track regardless of item count.

```css
430–435: #products li:nth-child(1) { animation-delay: 0.1s; } ... :nth-child(6) { animation-delay: 0.6s; }
```
Staggered entry animation — each product card appears 0.1s after the previous one, creating a cascade effect.

```css
437: #products li:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg), var(--shadow-glow); }
```
Product cards lift 6px on hover with the largest shadow depth and green glow.

---

### Lines 472–512 — Cart List & Total
```css
478: #cart li, li { ... background: var(--bg-glass); display: flex; justify-content: space-between; align-items: center; animation: fadeIn 0.4s; }
```
Cart items are flex rows — name/price on the left, remove button on the right. They fade in when rendered.

```css
501: #total { font-size: 1.4rem; font-weight: 700; color: var(--accent-primary); text-align: right; }
```
The total amount is right-aligned, large, and in the primary green color to draw attention.

---

### Lines 514–557 — Toast & Status
```css
515: .toast { position: fixed; bottom: 30px; right: 30px; ... display: none; animation: toastIn 0.4s; }
```
Fixed positioning keeps the toast in the bottom-right regardless of scroll. Hidden by default (`display: none`), shown by JS.

```css
531: @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
```
The toast appearance animation — rises from below while scaling up.

```css
555: #msg:empty { display: none; }
```
The CSS `:empty` pseudo-class hides `#msg` when it contains no text — prevents an empty styled box from showing on page load.

---

### Lines 559–617 — Footer, Features, Badge
```css
560: footer { text-align: center; padding: 40px 20px; border-top: 1px solid var(--border-color); }
```
Centered footer with a top border separator and muted text.

```css
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
```
Responsive 4-column grid for feature cards. Drops to fewer columns on smaller screens automatically.

```css
.feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md), var(--shadow-glow); }
```
Feature cards lift and glow on hover.

```css
.feature-card .feature-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  background: var(--accent-glow);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-primary);
}
```
A rounded square container for the inline SVG icon. The SVG inherits `currentColor` from the parent's green color. On hover, the container brightens and scales up 8% (`scale(1.08)`).

```css
.badge { display: inline-block; padding: 4px 14px; border-radius: 50px; background: var(--accent-glow); color: var(--accent-primary); }
```
Small pill-shaped labels — used in the header area above the main `h1`.

---

### Form Groups and Empty State
```css
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: 0.85rem; color: var(--text-secondary); }
```
Labels are block-level so they sit above inputs. Small, secondary-colored text.

```css
.empty-state { text-align: center; padding: 50px 30px; color: var(--text-muted); }
```
Centered empty states with muted message text — no emoji icons, just plain descriptive text.

---

### Lines 664–680 — Custom Scrollbar
```css
665: ::-webkit-scrollbar { width: 8px; }
669: ::-webkit-scrollbar-track { background: var(--bg-primary); }
673: ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
678: ::-webkit-scrollbar-thumb:hover { background: var(--accent-glow); }
```
Removes the default ugly grey scrollbar and replaces it with a thin (8px), dark, rounded scrollbar that glows green on hover. Applies to Webkit-based browsers (Chrome, Edge, Safari).

---

### Lines 682–737 — Responsive Media Queries

#### Tablet (≤ 768px) — Lines 683–718
```css
683: @media (max-width: 768px) {
684:   nav { padding: 0 16px; gap: 4px; height: 56px; flex-wrap: wrap; }
```
Reduces nav padding and height, allows links to wrap onto a second row if needed.

```css
697:   header { padding: 50px 20px 50px; }
```
Reduces header padding for smaller screens.

```css
701:   .section { margin: 24px 16px; padding: 28px 20px; }
```
Reduces section card margins and padding.

```css
706:   #products { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
```
Product columns shrink to minimum 200px (showing 2 or more columns on tablet).

```css
711:   .features { grid-template-columns: 1fr; }
```
Feature cards stack into a single column on tablet.

#### Mobile (≤ 480px) — Lines 720–737
```css
720: @media (max-width: 480px) {
721:   header h1 { font-size: 1.8rem; }
```
Hard-caps the hero heading at 1.8rem on tiny screens (overrides the `clamp()` minimum).

```css
725:   nav { gap: 2px; }
729:   nav a { font-size: 0.75rem; padding: 5px 10px; }
```
Further shrinks nav links for small phone screens.

```css
734:   #products { grid-template-columns: 1fr; }
```
Products show as a single full-width column on mobile.

---

## 10. `images/` folder

The `images/` directory holds 6 PNG product photographs used by the static fallback catalogue. These are local files — no external image URLs needed.

| File | Product |
|------|---------|
| `seeds_paddy.png` | Premium Paddy Seeds — kraft paper bag on green fabric |
| `fertilizer_npk.png` | NPK Fertilizer bag — white woven bag, open top |
| `garden_tools.png` | Hand tool set — trowel and cultivator on green burlap |
| `sprayer_pump.png` | Knapsack sprayer — HDPE tank with yellow nozzle |
| `drip_irrigation.png` | Drip kit — flat-lay of tubing, emitters and connectors |
| `soil_tester.png` | Soil pH/moisture meter — silver probe on dark soil |

All images are square-cropped PNGs. The `<img>` tag in each product card uses `object-fit: cover` to display them uniformly at `120 x 120px` regardless of the actual image dimensions.

The `get_products.php` endpoint can also return an `image` field — if a database product has a valid image path or URL, it takes priority over the static image path.

---

*AgriAdvisory Hub — Complete Codebase Documentation. 2026*
