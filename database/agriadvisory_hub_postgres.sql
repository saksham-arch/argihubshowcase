DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS farm_analytics CASCADE;
DROP TABLE IF EXISTS crop_advisories CASCADE;
DROP TABLE IF EXISTS weather_data CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS language_preferences CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

CREATE TABLE admin_users (
    admin_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(60) NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmers (
    farmer_id BIGSERIAL PRIMARY KEY,
    fullname VARCHAR(150) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    land_area NUMERIC(10,2) NOT NULL,
    service VARCHAR(120) NOT NULL,
    preferred_language VARCHAR(60) NOT NULL DEFAULT 'English',
    managed_by_admin_id BIGINT NULL REFERENCES admin_users(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    category VARCHAR(100) NOT NULL,
    supplier_name VARCHAR(150) NOT NULL,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    managed_by_admin_id BIGINT NULL REFERENCES admin_users(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
    cart_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted'))
);

CREATE TABLE cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NULL REFERENCES farmers(farmer_id) ON DELETE SET NULL ON UPDATE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    address TEXT NOT NULL,
    payment_mode VARCHAR(60) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    managed_by_admin_id BIGINT NULL REFERENCES admin_users(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id BIGINT NULL REFERENCES products(product_id) ON DELETE SET NULL ON UPDATE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    payment_gateway VARCHAR(80) NOT NULL,
    transaction_id VARCHAR(120) NOT NULL UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    paid_at TIMESTAMP NULL
);

CREATE TABLE weather_data (
    weather_data_id BIGSERIAL PRIMARY KEY,
    location VARCHAR(150) NOT NULL,
    temperature NUMERIC(5,2) NOT NULL,
    humidity NUMERIC(5,2) NOT NULL,
    rainfall NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    soil_moisture NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    weather_condition VARCHAR(120) NOT NULL,
    fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crop_advisories (
    advisory_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    weather_data_id BIGINT NOT NULL REFERENCES weather_data(weather_data_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    soil_type VARCHAR(100) NOT NULL,
    season VARCHAR(80) NOT NULL,
    recommended_crop VARCHAR(150) NOT NULL,
    recommendation_score NUMERIC(5,2) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(60) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farm_analytics (
    analytics_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    yield_value NUMERIC(10,2) NOT NULL,
    farm_activity VARCHAR(150) NOT NULL,
    report_period VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    session_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked'))
);

CREATE TABLE language_preferences (
    preference_id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(farmer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    language_name VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (farmer_id, language_code)
);

INSERT INTO admin_users (name, email, password, role)
VALUES ('System Administrator', 'admin@agriadvisoryhub.local', '$2y$10$4c3p6TkvE0QdxzlX7HY9zO8ut6k9wByM9kP8biZJw1M2zUaPs6r7u', 'super_admin');

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
    (1, 'session-raghav-001', CURRENT_TIMESTAMP + INTERVAL '7 days', 'active'),
    (2, 'session-asha-001', CURRENT_TIMESTAMP + INTERVAL '7 days', 'active');

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
