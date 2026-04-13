CREATE DATABASE IF NOT EXISTS agriadvisory_hub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agriadvisory_hub;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS farm_analytics;
DROP TABLE IF EXISTS crop_advisories;
DROP TABLE IF EXISTS weather_data;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS language_preferences;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS farmers;
DROP TABLE IF EXISTS admin_users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admin_users (
    admin_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(60) NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE farmers (
    farmer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    land_area DECIMAL(10,2) NOT NULL,
    service VARCHAR(120) NOT NULL,
    preferred_language VARCHAR(60) NOT NULL DEFAULT 'English',
    managed_by_admin_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farmers_admin
        FOREIGN KEY (managed_by_admin_id) REFERENCES admin_users(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE products (
    product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    stock_status ENUM('in_stock', 'low_stock', 'out_of_stock') NOT NULL DEFAULT 'in_stock',
    managed_by_admin_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_admin
        FOREIGN KEY (managed_by_admin_id) REFERENCES admin_users(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
    cart_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'abandoned', 'converted') NOT NULL DEFAULT 'active',
    CONSTRAINT fk_carts_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
    cart_item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(cart_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
    order_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NULL,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address TEXT NOT NULL,
    payment_mode VARCHAR(60) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    status ENUM('placed', 'confirmed', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'placed',
    managed_by_admin_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_admin
        FOREIGN KEY (managed_by_admin_id) REFERENCES admin_users(admin_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE order_items (
    order_item_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
    payment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL UNIQUE,
    payment_gateway VARCHAR(80) NOT NULL,
    transaction_id VARCHAR(120) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE weather_data (
    weather_data_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(150) NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    rainfall DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    soil_moisture DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    weather_condition VARCHAR(120) NOT NULL,
    fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE crop_advisories (
    advisory_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    weather_data_id INT UNSIGNED NOT NULL,
    soil_type VARCHAR(100) NOT NULL,
    season VARCHAR(80) NOT NULL,
    recommended_crop VARCHAR(150) NOT NULL,
    recommendation_score DECIMAL(5,2) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_crop_advisories_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_crop_advisories_weather
        FOREIGN KEY (weather_data_id) REFERENCES weather_data(weather_data_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE notifications (
    notification_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(60) NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE farm_analytics (
    analytics_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    yield_value DECIMAL(10,2) NOT NULL,
    farm_activity VARCHAR(150) NOT NULL,
    report_period VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farm_analytics_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_sessions (
    session_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    status ENUM('active', 'expired', 'revoked') NOT NULL DEFAULT 'active',
    CONSTRAINT fk_user_sessions_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE language_preferences (
    preference_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT UNSIGNED NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    language_name VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_language_preferences_farmer
        FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uq_farmer_language (farmer_id, language_code)
) ENGINE=InnoDB;

INSERT INTO admin_users (name, email, password, role)
VALUES
    ('System Administrator', 'admin@agriadvisoryhub.local', '$2y$10$4c3p6TkvE0QdxzlX7HY9zO8ut6k9wByM9kP8biZJw1M2zUaPs6r7u', 'super_admin');

INSERT INTO farmers (fullname, email, phone, password, address, land_area, service, preferred_language, managed_by_admin_id)
VALUES
    ('Raghav Patil', 'raghav.patil@example.com', '+91 9876543210', '$2y$10$4c3p6TkvE0QdxzlX7HY9zO8ut6k9wByM9kP8biZJw1M2zUaPs6r7u', 'Nashik, Maharashtra', 6.50, 'Crop Consultation', 'English', 1),
    ('Asha More', 'asha.more@example.com', '+91 9123456780', '$2y$10$4c3p6TkvE0QdxzlX7HY9zO8ut6k9wByM9kP8biZJw1M2zUaPs6r7u', 'Satara, Maharashtra', 3.00, 'Soil Testing', 'Hindi', 1);

INSERT INTO language_preferences (farmer_id, language_code, language_name)
VALUES
    (1, 'EN', 'English'),
    (2, 'HI', 'Hindi');

INSERT INTO products (name, price, image, description, category, supplier_name, stock_status, managed_by_admin_id)
VALUES
    ('Premium Paddy Seeds (1 kg)', 249.00, 'images/seeds_paddy.png', 'High-yield HYV paddy seeds suitable for Kharif season.', 'Seeds', 'Green Harvest Inputs', 'in_stock', 1),
    ('NPK Fertilizer 5 kg Bag', 595.00, 'images/fertilizer_npk.png', 'Balanced 19-19-19 granulated fertilizer for all crops.', 'Fertilizer', 'Agro Nutrients Co.', 'in_stock', 1),
    ('Stainless Steel Hand Tool Set', 385.00, 'images/garden_tools.png', 'Trowel and cultivator set with hardwood handles.', 'Tools', 'Farm Essentials Depot', 'in_stock', 1),
    ('Knapsack Sprayer 16 L', 990.00, 'images/sprayer_pump.png', 'HDPE backpack sprayer with adjustable brass nozzle.', 'Equipment', 'Precision Spray Tech', 'in_stock', 1),
    ('Drip Irrigation Kit (50 plants)', 1250.00, 'images/drip_irrigation.png', 'Complete drip kit with mainline, emitters and connectors.', 'Irrigation', 'WaterWise Systems', 'in_stock', 1),
    ('Digital Soil pH and Moisture Tester', 749.00, 'images/soil_tester.png', 'Instant-read dual meter for soil pH and moisture levels.', 'Soil Testing', 'AgriSense Labs', 'in_stock', 1);

INSERT INTO carts (farmer_id, status)
VALUES
    (1, 'active');

INSERT INTO cart_items (cart_id, product_id, quantity, price, subtotal)
VALUES
    (1, 1, 1, 249.00, 249.00),
    (1, 2, 1, 595.00, 595.00);

INSERT INTO weather_data (location, temperature, humidity, rainfall, soil_moisture, weather_condition)
VALUES
    ('Nashik, Maharashtra', 29.50, 58.00, 2.00, 31.00, 'Partly Cloudy'),
    ('Satara, Maharashtra', 26.10, 66.00, 12.50, 42.00, 'Light Rain');

INSERT INTO crop_advisories (farmer_id, weather_data_id, soil_type, season, recommended_crop, recommendation_score)
VALUES
    (1, 1, 'Loamy', 'Kharif', 'Paddy', 92.50),
    (2, 2, 'Black Soil', 'Rabi', 'Wheat', 88.00);

INSERT INTO notifications (farmer_id, message, type)
VALUES
    (1, 'Your advisory report for Kharif season is ready.', 'advisory'),
    (2, 'A new soil testing slot is available in your area.', 'service');

INSERT INTO farm_analytics (farmer_id, yield_value, farm_activity, report_period)
VALUES
    (1, 21.40, 'Paddy cultivation', 'Q1 2026'),
    (2, 14.10, 'Wheat cultivation', 'Q1 2026');

INSERT INTO user_sessions (farmer_id, session_token, expires_at, status)
VALUES
    (1, 'session-raghav-001', DATE_ADD(NOW(), INTERVAL 7 DAY), 'active'),
    (2, 'session-asha-001', DATE_ADD(NOW(), INTERVAL 7 DAY), 'active');

INSERT INTO orders (farmer_id, customer_name, phone, address, payment_mode, payment_status, total, status, managed_by_admin_id)
VALUES
    (1, 'Raghav Patil', '+91 9876543210', 'Nashik, Maharashtra | Payment: Cash on Delivery', 'Cash on Delivery', 'pending', 844.00, 'placed', 1);

INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
VALUES
    (1, 1, 1, 249.00, 249.00),
    (1, 2, 1, 595.00, 595.00);

INSERT INTO payments (order_id, payment_gateway, transaction_id, amount, payment_status, paid_at)
VALUES
    (1, 'COD', 'COD-SEED-0001', 844.00, 'pending', NULL);
