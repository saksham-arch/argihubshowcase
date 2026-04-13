<?php

require_once __DIR__ . '/includes/bootstrap.php';

try {
    $conn = getDbConnection();
} catch (RuntimeException $exception) {
    die('Connection Failed: ' . $exception->getMessage());
}
