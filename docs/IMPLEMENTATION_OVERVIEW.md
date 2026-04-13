# AgriAdvisory Hub Implementation Overview

## What the current project implements
- A landing page that presents the agricultural platform and its main offerings.
- A farmer registration page that collects profile details and submits them to PHP.
- A marketplace page that lists agricultural products and supports add-to-cart.
- A checkout page that reads the browser cart, collects delivery details, and places an order.
- PHP endpoints for registration, product loading, order placement, and cart-item deletion.
- A MySQL schema for both the present application and the future roadmap modules requested in the project report.

## How it is implemented

### Frontend
- `index.html`, `register.html`, `products.html`, and `checkout.html` provide the visible pages.
- `style.css` contains the full visual system and keeps the existing UI direction unchanged.
- `script.js` handles client-side validation, product rendering, LocalStorage cart behavior, toast notifications, and AJAX form submission.

### Backend
- `db_connect.php` now loads a reusable bootstrap instead of hardcoding connection logic inline.
- `includes/helpers.php` contains validation, normalization, fallback catalog data, and payment-mode mapping.
- `includes/database.php` centralizes environment loading, PDO database configuration, JSON responses, and query helpers for both MySQL and PostgreSQL.
- `register.php` validates input, hashes passwords, prevents duplicate emails, and inserts farmers safely.
- `get_products.php` tries the database first and automatically falls back to the built-in product catalog if the database is empty or unavailable.
- `place_order.php` validates the checkout payload, normalizes duplicate items, inserts into `orders`, `order_items`, and `payments`, and returns JSON to the frontend.

### Database
- `database/agriadvisory_hub.sql` creates all required entities:
  `farmers`, `products`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `weather_data`, `crop_advisories`, `admin_users`, `notifications`, `farm_analytics`, `user_sessions`, and `language_preferences`.
- The SQL file also seeds admin, farmer, product, advisory, analytics, and sample transaction data so the project can be mounted quickly in MySQL.
- `database/agriadvisory_hub_postgres.sql` mirrors the same schema for PostgreSQL so the project can be deployed on Railway without changing the UI.

### Testing
- `composer.json`, `phpunit.xml`, and `tests/ApplicationTest.php` add PHPUnit-based unit tests for the core backend rules.
- The tests focus on the business logic most likely to fail: validation, order normalization, total verification, and payment mapping.
