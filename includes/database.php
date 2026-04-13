<?php

require_once __DIR__ . '/helpers.php';

function getDatabaseConfig(): array
{
    static $config;

    if ($config === null) {
        $config = require __DIR__ . '/../config/database.php';
    }

    return $config;
}

function isPostgres(): bool
{
    return getDatabaseConfig()['driver'] === 'pgsql';
}

function getDbConnection(): PDO
{
    static $connection;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $config = getDatabaseConfig();
    $driver = $config['driver'];

    if ($driver === 'pgsql') {
        $dsn = sprintf(
            'pgsql:host=%s;port=%d;dbname=%s',
            $config['host'],
            $config['port'],
            $config['database']
        );
    } else {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['database'],
            $config['charset']
        );
    }

    try {
        $connection = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $exception) {
        throw new RuntimeException('Database connection failed: ' . $exception->getMessage());
    }

    return $connection;
}

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function loadProductsFromDatabase(PDO $conn): array
{
    $sql = 'SELECT product_id, name, price, image, description, category, supplier_name, stock_status
            FROM products
            ORDER BY product_id ASC';
    $result = $conn->query($sql);
    $products = [];

    while ($row = $result->fetch()) {
        $row['price'] = (float) $row['price'];
        $products[] = $row;
    }

    return $products;
}

function findProductIdByName(PDO $conn, string $name): ?int
{
    $stmt = $conn->prepare('SELECT product_id FROM products WHERE name = ? LIMIT 1');
    $stmt->execute([$name]);
    $productId = $stmt->fetchColumn();

    return $productId !== false ? (int) $productId : null;
}

function findFarmerIdByEmail(PDO $conn, string $email): ?int
{
    $stmt = $conn->prepare('SELECT farmer_id FROM farmers WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $farmerId = $stmt->fetchColumn();

    return $farmerId !== false ? (int) $farmerId : null;
}

function beginTransaction(PDO $conn): void
{
    if (!$conn->inTransaction()) {
        $conn->beginTransaction();
    }
}

function commitTransaction(PDO $conn): void
{
    if ($conn->inTransaction()) {
        $conn->commit();
    }
}

function rollbackTransaction(PDO $conn): void
{
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
}

function insertAndGetId(PDO $conn, string $sql, array $params, string $idColumn): int
{
    if (isPostgres()) {
        $stmt = $conn->prepare($sql . ' RETURNING ' . $idColumn);
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    return (int) $conn->lastInsertId();
}
