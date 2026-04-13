<?php

require_once __DIR__ . '/includes/bootstrap.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
    exit;
}

$validation = validateOrderPayload($_POST);

if (!$validation['valid']) {
    jsonResponse(
        [
            'status' => 'error',
            'message' => implode(' ', array_values($validation['errors'])),
            'errors' => $validation['errors'],
        ],
        422
    );
    exit;
}

$data = $validation['data'];

try {
    $conn = getDbConnection();
    beginTransaction($conn);

    $farmerId = null;
    $status = 'placed';
    $orderId = insertAndGetId(
        $conn,
        'INSERT INTO orders
        (farmer_id, customer_name, phone, address, payment_mode, payment_status, total, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            $farmerId,
            $data['customer_name'],
            $data['phone'],
            $data['address'],
            $data['payment_mode'],
            $data['payment_status'],
            $data['total'],
            $status,
        ],
        'order_id'
    );

    $orderItemStmt = $conn->prepare(
        'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)'
    );

    foreach ($data['items'] as $item) {
        $productId = findProductIdByName($conn, $item['name']);
        $quantity = (int) $item['quantity'];
        $price = (float) $item['price'];
        $subtotal = (float) $item['subtotal'];
        $orderItemStmt->execute([$orderId, $productId, $quantity, $price, $subtotal]);
    }

    $paymentGateway = mapPaymentGateway($data['payment_mode']);
    $paymentStatus = $paymentGateway === 'COD' ? 'pending' : $data['payment_status'];
    $transactionId = strtoupper($paymentGateway) . '-' . strtoupper(uniqid());
    $paymentStmt = $conn->prepare(
        'INSERT INTO payments (order_id, payment_gateway, transaction_id, amount, payment_status)
         VALUES (?, ?, ?, ?, ?)'
    );

    $paymentStmt->execute([
        $orderId,
        $paymentGateway,
        $transactionId,
        $data['total'],
        $paymentStatus,
    ]);

    commitTransaction($conn);

    jsonResponse([
        'status' => 'success',
        'message' => 'Order placed successfully.',
        'order_id' => $orderId,
        'total' => $data['total'],
    ]);
} catch (Throwable $exception) {
    if (isset($conn) && $conn instanceof PDO) {
        rollbackTransaction($conn);
    }

    jsonResponse([
        'status' => 'error',
        'message' => 'Failed to save order.',
        'details' => $exception->getMessage(),
    ], 500);
}
