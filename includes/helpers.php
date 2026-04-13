<?php

function staticProductCatalog(): array
{
    return [
        [
            'product_id' => 1,
            'name' => 'Premium Paddy Seeds (1 kg)',
            'price' => 249.00,
            'image' => 'images/seeds_paddy.png',
            'description' => 'High-yield HYV paddy seeds suitable for Kharif season.',
            'category' => 'Seeds',
            'supplier_name' => 'Green Harvest Inputs',
            'stock_status' => 'in_stock',
        ],
        [
            'product_id' => 2,
            'name' => 'NPK Fertilizer 5 kg Bag',
            'price' => 595.00,
            'image' => 'images/fertilizer_npk.png',
            'description' => 'Balanced 19-19-19 granulated fertilizer for all crops.',
            'category' => 'Fertilizer',
            'supplier_name' => 'Agro Nutrients Co.',
            'stock_status' => 'in_stock',
        ],
        [
            'product_id' => 3,
            'name' => 'Stainless Steel Hand Tool Set',
            'price' => 385.00,
            'image' => 'images/garden_tools.png',
            'description' => 'Trowel and cultivator set with hardwood handles.',
            'category' => 'Tools',
            'supplier_name' => 'Farm Essentials Depot',
            'stock_status' => 'in_stock',
        ],
        [
            'product_id' => 4,
            'name' => 'Knapsack Sprayer 16 L',
            'price' => 990.00,
            'image' => 'images/sprayer_pump.png',
            'description' => 'HDPE backpack sprayer with adjustable brass nozzle.',
            'category' => 'Equipment',
            'supplier_name' => 'Precision Spray Tech',
            'stock_status' => 'in_stock',
        ],
        [
            'product_id' => 5,
            'name' => 'Drip Irrigation Kit (50 plants)',
            'price' => 1250.00,
            'image' => 'images/drip_irrigation.png',
            'description' => 'Complete drip kit with mainline, emitters and connectors.',
            'category' => 'Irrigation',
            'supplier_name' => 'WaterWise Systems',
            'stock_status' => 'in_stock',
        ],
        [
            'product_id' => 6,
            'name' => 'Digital Soil pH and Moisture Tester',
            'price' => 749.00,
            'image' => 'images/soil_tester.png',
            'description' => 'Instant-read dual meter for soil pH and moisture levels.',
            'category' => 'Soil Testing',
            'supplier_name' => 'AgriSense Labs',
            'stock_status' => 'in_stock',
        ],
    ];
}

function normalizePhone(string $phone): string
{
    return preg_replace('/\s+/', ' ', trim($phone));
}

function validateRegistrationData(array $input): array
{
    $data = [
        'fullname' => trim((string) ($input['fullname'] ?? '')),
        'email' => strtolower(trim((string) ($input['email'] ?? ''))),
        'phone' => normalizePhone((string) ($input['phone'] ?? '')),
        'password' => (string) ($input['password'] ?? ''),
        'address' => trim((string) ($input['address'] ?? '')),
        'land_area' => trim((string) ($input['land'] ?? ($input['land_area'] ?? ''))),
        'service' => trim((string) ($input['service'] ?? '')),
        'preferred_language' => trim((string) ($input['preferred_language'] ?? 'English')),
    ];

    $errors = [];

    if (strlen($data['fullname']) < 3) {
        $errors['fullname'] = 'Full name must be at least 3 characters.';
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'A valid email address is required.';
    }

    if (strlen($data['phone']) < 6) {
        $errors['phone'] = 'A valid phone number is required.';
    }

    if (strlen($data['password']) < 8) {
        $errors['password'] = 'Password must be at least 8 characters.';
    }

    if ($data['address'] === '') {
        $errors['address'] = 'Address is required.';
    }

    if ($data['land_area'] === '' || !is_numeric($data['land_area']) || (float) $data['land_area'] <= 0) {
        $errors['land_area'] = 'Land area must be a positive number.';
    }

    if ($data['service'] === '') {
        $errors['service'] = 'Service is required.';
    }

    if ($data['preferred_language'] === '') {
        $errors['preferred_language'] = 'Preferred language is required.';
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => $data,
    ];
}

function normalizeOrderItems(array $items): array
{
    $grouped = [];

    foreach ($items as $item) {
        $name = trim((string) ($item['name'] ?? ''));
        $price = isset($item['price']) ? (float) $item['price'] : 0.0;

        if ($name === '' || $price <= 0) {
            continue;
        }

        if (!isset($grouped[$name])) {
            $grouped[$name] = [
                'name' => $name,
                'price' => $price,
                'quantity' => 0,
                'subtotal' => 0.0,
            ];
        }

        $grouped[$name]['quantity']++;
        $grouped[$name]['subtotal'] += $price;
    }

    return array_values($grouped);
}

function validateOrderPayload(array $input): array
{
    $rawItems = $input['items'] ?? '[]';
    $decodedItems = is_array($rawItems) ? $rawItems : json_decode((string) $rawItems, true);

    if (!is_array($decodedItems)) {
        $decodedItems = [];
    }

    $normalizedItems = normalizeOrderItems($decodedItems);
    $declaredTotal = isset($input['total']) ? (float) $input['total'] : 0.0;
    $calculatedTotal = 0.0;

    foreach ($normalizedItems as $item) {
        $calculatedTotal += $item['subtotal'];
    }

    $data = [
        'customer_name' => trim((string) ($input['customer_name'] ?? '')),
        'phone' => normalizePhone((string) ($input['phone'] ?? '')),
        'address' => trim((string) ($input['address'] ?? '')),
        'payment_mode' => trim((string) ($input['payment_mode'] ?? 'Cash on Delivery')),
        'payment_status' => trim((string) ($input['payment_status'] ?? 'pending')),
        'items' => $normalizedItems,
        'total' => $calculatedTotal,
    ];

    $errors = [];

    if (strlen($data['customer_name']) < 2) {
        $errors['customer_name'] = 'Customer name is required.';
    }

    if (strlen($data['phone']) < 6) {
        $errors['phone'] = 'Phone number is required.';
    }

    if ($data['address'] === '') {
        $errors['address'] = 'Address is required.';
    }

    if ($data['payment_mode'] === '') {
        $errors['payment_mode'] = 'Payment mode is required.';
    }

    if ($data['items'] === []) {
        $errors['items'] = 'At least one valid item is required.';
    }

    if ($declaredTotal > 0 && abs($declaredTotal - $calculatedTotal) > 0.01) {
        $errors['total'] = 'Submitted total does not match cart items.';
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => $data,
    ];
}

function mapPaymentGateway(string $paymentMode): string
{
    $mode = strtolower(trim($paymentMode));

    if (str_contains($mode, 'upi') || str_contains($mode, 'qr')) {
        return 'UPI';
    }

    if (str_contains($mode, 'bank')) {
        return 'BANK_TRANSFER';
    }

    return 'COD';
}

function slugifyToken(string $value): string
{
    $normalized = strtolower(trim($value));
    $normalized = preg_replace('/[^a-z0-9]+/', '-', $normalized);

    return trim((string) $normalized, '-');
}
