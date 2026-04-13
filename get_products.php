<?php

require_once __DIR__ . '/includes/bootstrap.php';

try {
    $conn = getDbConnection();
    $products = loadProductsFromDatabase($conn);

    if ($products === []) {
        $products = staticProductCatalog();
    }

    jsonResponse($products);
} catch (Throwable $exception) {
    jsonResponse(staticProductCatalog());
}
