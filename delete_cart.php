<?php

require_once __DIR__ . '/includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed.'], 405);
    exit;
}

$cartItemId = isset($_POST['id']) ? (int) $_POST['id'] : 0;

if ($cartItemId <= 0) {
    jsonResponse(['status' => 'error', 'message' => 'Invalid cart item id.'], 422);
    exit;
}

try {
    $conn = getDbConnection();
    $stmt = $conn->prepare('DELETE FROM cart_items WHERE cart_item_id = ?');
    $stmt->execute([$cartItemId]);
    $deleted = $stmt->rowCount() > 0;

    jsonResponse([
        'status' => $deleted ? 'success' : 'error',
        'message' => $deleted ? 'Cart item deleted.' : 'Cart item not found.',
    ], $deleted ? 200 : 404);
} catch (Throwable $exception) {
    jsonResponse([
        'status' => 'error',
        'message' => $exception->getMessage(),
    ], 500);
}
