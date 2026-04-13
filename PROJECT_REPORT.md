# AgriAdvisory Hub — Complete Project Report

> A smart farming assistant platform that empowers farmers with crop advisory, farm registration, and an agricultural marketplace.

> Update note: this report captures the original mini-project baseline. The current runnable build now also includes a normalized full schema, PostgreSQL support for Railway, PHPUnit tests, deployment files, and updated backend docs in [docs/IMPLEMENTATION_OVERVIEW.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/docs/IMPLEMENTATION_OVERVIEW.md) and [RUN_AND_DEPLOY.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/RUN_AND_DEPLOY.md).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [Project Architecture](#5-project-architecture)
6. [File Structure](#6-file-structure)
7. [Product Catalogue](#7-product-catalogue)
8. [Features and Functionality](#8-features-and-functionality)
9. [Pages Explained](#9-pages-explained)
10. [Database Design](#10-database-design)
11. [UI/UX Design System](#11-uiux-design-system)
12. [User Flow](#12-user-flow)
13. [Server-Side Logic (PHP)](#13-server-side-logic-php)
14. [Client-Side Logic (JavaScript)](#14-client-side-logic-javascript)
15. [Responsive Design](#15-responsive-design)
16. [Animations and Micro-interactions](#16-animations-and-micro-interactions)
17. [Security Considerations](#17-security-considerations)
18. [Future Enhancements](#18-future-enhancements)
19. [How to Run Locally](#19-how-to-run-locally)

---

## 1. Project Overview

**AgriAdvisory Hub** is a full-stack web application built to serve the agricultural community. It acts as a one-stop digital platform combining:

- Smart **crop advisory** services
- **Farmer registration** and profiling
- An **agri-marketplace** for seeds, fertilizers, and tools — with a static product fallback that works without a database
- A **shopping cart** with LocalStorage persistence

The platform targets modern and rural farmers who need centralized access to farming resources and expert consultation, delivered through a fast, responsive, and visually premium interface.

---

## 2. Problem Statement

Farmers face several challenges:

- Lack of access to personalized **crop recommendations** based on soil type and climate
- No unified platform for **farm profile management**
- Difficulty sourcing **quality agricultural products** from verified suppliers
- Gap between farmers and **agricultural experts**

AgriAdvisory Hub bridges this gap through a single, accessible web application.

---

## 3. Objectives

| Objective | Description |
|-----------|-------------|
| Farmer Onboarding | Allow farmers to register with land details, location, and service preference |
| Crop Intelligence | Provide data-driven crop recommendations |
| Marketplace | Enable farmers to browse and purchase agricultural products |
| Advisory Access | Connect farmers to soil testing and crop consultation experts |
| Offline-Resilient | Products catalogue works even when the database is unavailable |
| Usability | Deliver a premium, accessible, mobile-friendly interface |

---

## 4. Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure across all pages |
| CSS3 (Vanilla) | Design system, animations, glassmorphism, responsiveness |
| JavaScript (ES6+) | Dynamic UI, Fetch API, LocalStorage cart, async/await |
| Google Fonts — Inter | Premium modern typography |

### Backend

| Technology | Purpose |
|------------|---------|
| PHP 8.x | Server-side processing and endpoint logic |
| MySQL | Relational database for farmer and product data |
| MySQLi (PHP Extension) | Database driver for executing queries |

### Environment

| Tool | Purpose |
|------|---------|
| XAMPP | Local Apache + MySQL + PHP development environment |
| Apache Web Server | Serves the HTML/PHP files locally |
| phpMyAdmin | GUI for managing the MySQL database |

---

## 5. Project Architecture

The project follows a classic **3-Tier Architecture**:

```
+-------------------------------------+
|         PRESENTATION LAYER          |
|   HTML + CSS + JavaScript (Browser) |
|   index.html / register.html        |
|   products.html / checkout.html     |
+------------------+------------------+
                   | HTTP Requests (Fetch API)
                   v
+-------------------------------------+
|          BUSINESS LOGIC LAYER       |
|         PHP Scripts (Server)        |
|   register.php / get_products.php   |
|   db_connect.php                    |
+------------------+------------------+
                   | MySQLi Queries
                   v
+-------------------------------------+
|           DATA LAYER                |
|       MySQL Database                |
|   Table: farmers / products         |
+-------------------------------------+
```

### Communication Flow

- The browser sends **GET/POST requests** via JavaScript's `fetch()` API
- PHP scripts process those requests and interact with MySQL
- PHP returns **JSON** (for product data) or **plain text** (for registration success/error)
- JavaScript reads the response and **updates the DOM** dynamically without a page reload
- If the server or database is unavailable, a **static product catalogue** is rendered as a fallback

---

## 6. File Structure

```
agriadvisoryhub/
|
+-- index.html           -- Landing page — home/welcome screen
+-- register.html        -- Farmer registration form page
+-- products.html        -- Agricultural products marketplace
+-- checkout.html        -- Shopping cart and order review page
|
+-- style.css            -- Complete visual design system
+-- script.js            -- All frontend logic
|
+-- db_connect.php       -- Database connection setup
+-- register.php         -- POST endpoint: saves farmer data to DB
+-- get_products.php     -- GET endpoint: returns products as JSON
+-- delete_cart.php      -- Cart item deletion helper (server-side)
|
+-- images/              -- Product photography (local PNG files)
|   +-- seeds_paddy.png
|   +-- fertilizer_npk.png
|   +-- garden_tools.png
|   +-- sprayer_pump.png
|   +-- drip_irrigation.png
|   +-- soil_tester.png
|
+-- PROJECT_REPORT.md    -- This file
+-- CODE_EXPLANATION.md  -- Line-by-line code documentation
+-- README.md            -- Quick project intro and setup guide
```

---

## 7. Product Catalogue

The site ships with a built-in static product catalogue that renders with real photography even when the database is unavailable. Database products take priority; the static list is the fallback.

| # | Product Name | Price (INR) | Image File | Description |
|---|-------------|------------|-----------|-------------|
| 1 | Premium Paddy Seeds (1 kg) | Rs. 249 | seeds_paddy.png | High-yield HYV paddy seeds suitable for Kharif season |
| 2 | NPK Fertilizer 5 kg Bag | Rs. 595 | fertilizer_npk.png | Balanced 19-19-19 granulated fertilizer for all crops |
| 3 | Stainless Steel Hand Tool Set | Rs. 385 | garden_tools.png | Trowel and cultivator set with hardwood handles |
| 4 | Knapsack Sprayer 16 L | Rs. 990 | sprayer_pump.png | HDPE backpack sprayer with adjustable brass nozzle |
| 5 | Drip Irrigation Kit (50 plants) | Rs. 1,250 | drip_irrigation.png | Complete drip kit — mainline, emitters and connectors |
| 6 | Digital Soil pH and Moisture Tester | Rs. 749 | soil_tester.png | Instant-read dual meter for soil pH and moisture levels |

---

## 8. Features and Functionality

### Farmer Registration

- Collects Full Name, Email, Phone, Password, Farm Address, Land Area (acres), and Service Needed
- Client-side validation (name min 3 chars, password min 8 chars)
- Sends data via AJAX/Fetch to `register.php` (no page reload)
- Shows a loading state on the button while submitting
- Displays a toast notification on success or error

### Product Marketplace

- Fetches product data dynamically from `get_products.php`
- Falls back to a built-in static catalogue if the server is unavailable or the table is empty
- Renders each product as a styled card with a real photograph, name, description, and price
- Cards have staggered entry animations (0.1s delay per card)
- "Add to Cart" button on each card with toast feedback

### Shopping Cart (LocalStorage)

- Cart state is stored in browser LocalStorage for persistence across pages
- Cart page (`checkout.html`) reads and renders all cart items dynamically
- Each item has a "Remove" button that deletes the item and immediately re-renders the list (no page reload)
- Displays the Total Order Amount at the bottom
- Shows an empty cart state with a link to the products page

### Toast Notification System

- Custom-built floating toast replaces all native browser `alert()` dialogs
- Auto-dismisses after 3 seconds with a smooth fade-out animation
- Used for: add to cart, remove from cart, registration success/error, network errors
- Multiple rapid calls reset the dismiss timer without stacking

### Navigation

- Sticky top navbar that stays visible on scroll
- Active page highlighting — the current page link is styled with a green gradient pill
- Hover effects with a radial glow background on each link
- Fully responsive — wraps gracefully on mobile

### Responsive Design

- Fully optimized for Desktop, Tablet (768px), and Mobile (480px)
- CSS Grid layouts adapt automatically using `auto-fit` and `minmax()`
- Font sizes scale with `clamp()` for fluid typography

---

## 9. Pages Explained

### index.html — Home / Landing Page

- **Purpose**: Welcomes the farmer and communicates the platform's value
- **Key Sections**:
  - Sticky navigation bar with active state indicators
  - Hero header with animated gradient title
  - Welcome section with platform description
  - 4 Feature Cards with SVG icons (Crop Recommendations, Farm Registration, Agri Marketplace, Expert Advisory)
  - Footer

### register.html — Farmer Registration

- **Purpose**: Collects farmer data and saves it to the database
- **Form Fields**:
  1. Full Name (text) — min 3 characters
  2. Email Address (email)
  3. Phone Number (text, allows flexible formats)
  4. Password (password) — min 8 characters
  5. Farm Address (textarea, multi-line)
  6. Land Area in Acres (number)
  7. Service Needed (dropdown: Soil Testing / Crop Consultation)
- **Submission**: Async POST via Fetch API to `register.php`
- **Feedback**: `#msg` paragraph element and toast notification

### products.html — Agriculture Marketplace

- **Purpose**: Displays products fetched from the MySQL database, or static catalogue as fallback
- **Dynamic**: Product list is empty in HTML; `script.js` populates it at runtime
- **Each Product Card Contains**: Real photograph, Name, Short description, Price (Rs.), "Add to Cart" button

### checkout.html — Shopping Cart

- **Purpose**: Shows items the user has added from the product page
- **Data Source**: Reads from `localStorage` (key: "cart")
- **Each Cart Item Shows**: Product name, price, and a "Remove" button
- **Total**: Displays the accumulated total at the bottom
- **Empty State**: Shows a message with a link back to products

---

## 10. Database Design

### Database Name: `agriadvisory`

#### Table: `farmers`

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Unique farmer ID |
| `fullname` | VARCHAR(255) | Farmer's full name |
| `email` | VARCHAR(255) | Email address |
| `phone` | VARCHAR(20) | Phone number |
| `password` | VARCHAR(255) | Account password (should be hashed in production) |
| `address` | TEXT | Farm address (village, district, state) |
| `land_area` | VARCHAR(50) | Land size in acres |
| `service` | VARCHAR(100) | Requested service type |

#### Table: `products`

| Column | Data Type | Description |
|--------|-----------|-------------|
| `id` | INT (PK, AUTO_INCREMENT) | Unique product ID |
| `name` | VARCHAR(255) | Product name |
| `price` | DECIMAL(10,2) | Product price in INR |
| `image` | VARCHAR(500) | URL or path to the product image |

---

## 11. UI/UX Design System

### Color Palette (Agriculture Dark Theme)

| Variable | Hex / RGBA | Usage |
|----------|-----------|-------|
| `--bg-primary` | `#0a1a0f` | Main page background (deep dark green) |
| `--bg-secondary` | `#0f261a` | Secondary background |
| `--bg-card` | `rgba(20,60,35,0.45)` | Card backgrounds (glassmorphism) |
| `--bg-card-hover` | `rgba(30,80,50,0.55)` | Card hover state |
| `--bg-glass` | `rgba(255,255,255,0.04)` | Subtle white transparent overlay |
| `--accent-primary` | `#34d399` | Emerald green — main CTA color |
| `--accent-secondary` | `#10b981` | Slightly darker green — gradients |
| `--accent-glow` | `rgba(52,211,153,0.25)` | Glow effects on buttons/borders |
| `--accent-dark` | `#059669` | Dark accent for depth |
| `--text-primary` | `#e8f5e9` | Main body text (near white, green tinted) |
| `--text-secondary` | `#a7c4b5` | Supporting text, labels |
| `--text-muted` | `#5f8a72` | Placeholders, captions |
| `--border-color` | `rgba(52,211,153,0.15)` | Card borders |
| `--border-glow` | `rgba(52,211,153,0.35)` | Borders on hover |

### Typography

- **Font Family**: Inter (Google Fonts) — a modern, geometric sans-serif
- **Weights Used**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- **Fluid Heading**: `clamp(2.2rem, 5vw, 3.5rem)` — scales between viewport sizes

### Spacing and Radii

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-sm` | `8px` | Inputs, small cards |
| `--radius-md` | `14px` | Product cards |
| `--radius-lg` | `20px` | Section containers |
| `--radius-xl` | `28px` | Large modals/panels |

### Glassmorphism

Cards and nav use `backdrop-filter: blur(16px–20px)` with semi-transparent dark green backgrounds, creating a frosted-glass depth effect against the dark background.

### Icons

Feature cards use inline SVG icons — no external icon library required. Every icon is from the Feather icon set geometry, re-drawn as inline SVG for zero external dependency.

---

## 12. User Flow

```
User Visits Site
      |
      v
  index.html  (Landing Page)
      |
      +------> register.html
      |              |
      |              | Fills form -> JS validates -> Fetch POST -> register.php
      |              |                                              |
      |              |                                        MySQL INSERT
      |              |                                              |
      |              +------- "Registration Successful" Toast <-----+
      |
      +------> products.html
      |              |
      |              | Fetch GET -> get_products.php -> MySQL SELECT
      |              |          (fallback: STATIC_PRODUCTS array)
      |              |
      |              | Products rendered as cards
      |              |
      |              | Click "Add to Cart" -> addToCart() -> LocalStorage
      |              |
      +------> checkout.html
                     |
                     | Reads LocalStorage -> Renders cart items
                     |
                     | Click "Remove" -> removeFromCart() -> re-renders (no reload)
                     |
                     +-- Displays Total Order Amount
```

---

## 13. Server-Side Logic (PHP)

### db_connect.php

- Uses `new mysqli()` to establish the database connection
- Host: `localhost`, User: `root`, Password: `""` (XAMPP default), DB: `agriadvisory`
- If the connection fails, `die()` terminates the script and outputs the error

### register.php

- Receives form data via `$_POST` superglobal
- Builds a raw SQL `INSERT INTO farmers(...)` query
- Executes with `$conn->query($sql)`
- Returns `"Success"` or `"Error"` as plain text back to JavaScript
- Note: Uses direct string interpolation — should use prepared statements in production

### get_products.php

- Runs `SELECT * FROM products` to fetch all product records
- Loops through results using `fetch_assoc()` into a PHP array
- Returns the array as a JSON string via `json_encode()`
- JavaScript's `fetch()` reads this JSON and renders the product cards

### delete_cart.php

- Receives a cart item `id` via POST
- Executes `DELETE FROM cart WHERE id=$id`
- Returns `"Deleted"` or `"Error"` as plain text

---

## 14. Client-Side Logic (JavaScript)

### script.js — Module Breakdown

| Function / Block | Purpose |
|-----------------|---------|
| `let cart = JSON.parse(...)` | Initializes cart from LocalStorage on every page load |
| `STATIC_PRODUCTS` array | Built-in product catalogue — 6 items with local image paths |
| `showToast(message)` | Creates/displays floating toast notification, auto-hides after 3s, resets timer on rapid calls |
| `registrationForm.onsubmit` | Validates, shows loader, POSTs to server with all fields, handles response |
| `fetch("get_products.php")` | Fetches products from DB; falls back to `STATIC_PRODUCTS` on error or empty response |
| `renderProducts(products)` | Dynamically renders product cards with image, name, description, price, and Add to Cart button |
| `addToCart(name, price)` | Pushes a product object to the cart array and saves to LocalStorage |
| `renderCart()` | Reads cart from state, renders all items to the DOM, calculates total, handles empty state |
| `removeFromCart(index)` | Splices the target item from cart array, saves, and re-renders without page reload |
| `window.addToCart/removeFromCart` | Exposes functions to global scope so HTML `onclick` attributes can call them |

---

## 15. Responsive Design

| Breakpoint | Viewport | Changes Applied |
|------------|----------|----------------|
| Default | > 768px | Full desktop layout — multi-column grids, wider sections |
| Tablet | <= 768px | Reduced padding, smaller nav links, single-column features grid |
| Mobile | <= 480px | Smaller h1 font, compressed nav links, single-column products grid |

CSS Grid's `auto-fit` + `minmax()` ensures the product grid is inherently responsive without explicit breakpoints.

---

## 16. Animations and Micro-interactions

| Animation | Description | Applied To |
|-----------|-------------|-----------|
| `fadeInUp` | Elements slide up from 30px below while fading in | Header h1, p tags |
| `slideUp` | Like fadeInUp but 40px — used for section cards | `.section`, product `li` items |
| `fadeIn` | Simple opacity 0 to 1 | Cart items, `#msg` |
| `heroFloat` | Slow 20s background radial gradient drift (translate + rotate) | `header::before` pseudo-element |
| `shimmer` | Light sweep across button background | `button::after` on hover |
| Hover: Cards | `translateY(-4px to -6px)` + enhanced border + glow shadow | Feature cards, product cards |
| Hover: Nav Links | `translateY(-1px)` + radial glow background reveal | `nav a` |
| Hover: Buttons | `translateY(-2px) scale(1.02)` + stronger glow | All `button` elements |
| Hover: Feature Icons | `scale(1.08)` + brighter glow background | `.feature-icon` in feature cards |
| Staggered Load | Products appear sequentially at 0.1s intervals | `#products li` (via js animationDelay) |

---

## 17. Security Considerations

| Issue | Status | Recommendation |
|-------|--------|---------------|
| SQL Injection | Vulnerable | Use PHP prepared statements with `bind_param()` |
| Password Storage | Plain text | Use `password_hash()` and `password_verify()` in PHP |
| Input Sanitization | Missing | Use `htmlspecialchars()` and server-side validation |
| CSRF Protection | None | Add CSRF tokens to all forms |
| HTTPS | Local only | Deploy behind HTTPS with SSL certificate in production |

---

## 18. Future Enhancements

| Feature | Description |
|---------|-------------|
| Weather API | Integrate OpenWeather API for live weather-based crop recommendations |
| Payment Gateway | Razorpay or Paytm integration for actual marketplace checkout |
| AI Crop Advisory | ML model (soil + season -> crop recommendation predictions) |
| User Authentication | Proper login/logout system with PHP session management |
| Admin Dashboard | Panel for managing products, farmers, and orders |
| PWA | Progressive Web App for offline access and mobile app installation |
| Multilingual | Support for Hindi and regional Indian languages |
| Analytics | Farm yield tracking and reporting dashboard |

---

## 19. How to Run Locally

### Prerequisites

- XAMPP (or any Apache + PHP + MySQL stack)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Steps

```bash
# 1. Place the project folder in XAMPP web root
/Applications/XAMPP/xamppfiles/htdocs/agriadvisoryhub/

# 2. Start Apache and MySQL from the XAMPP Control Panel

# 3. Open phpMyAdmin in the browser
http://localhost/phpmyadmin

# 4. Create and set up the database with this SQL

CREATE DATABASE IF NOT EXISTS agriadvisory;
USE agriadvisory;

CREATE TABLE IF NOT EXISTS farmers (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  fullname  VARCHAR(255),
  email     VARCHAR(255),
  phone     VARCHAR(20),
  password  VARCHAR(255),
  address   TEXT,
  land_area VARCHAR(50),
  service   VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255),
  price DECIMAL(10,2),
  image VARCHAR(500)
);

# 5. Open the site in the browser
http://localhost/agriadvisoryhub/
```

> The products page works without database entries — the static catalogue with 6 built-in products renders automatically as a fallback.

---

*Built for farmers, by farmers. AgriAdvisory Hub — 2026*
