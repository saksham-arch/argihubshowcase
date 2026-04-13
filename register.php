<?php

require_once __DIR__ . '/includes/bootstrap.php';

header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

$validation = validateRegistrationData($_POST);

if (!$validation['valid']) {
    http_response_code(422);
    echo 'Error: ' . implode(' ', array_values($validation['errors']));
    exit;
}

$data = $validation['data'];

try {
    $conn = getDbConnection();

    $existingFarmerId = findFarmerIdByEmail($conn, $data['email']);
    if ($existingFarmerId !== null) {
        http_response_code(409);
        echo 'Error: Email already registered.';
        exit;
    }

    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    $landArea = (float) $data['land_area'];
    $farmerId = insertAndGetId(
        $conn,
        'INSERT INTO farmers
        (fullname, email, phone, password, address, land_area, service, preferred_language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            $data['fullname'],
            $data['email'],
            $data['phone'],
            $hashedPassword,
            $data['address'],
            $landArea,
            $data['service'],
            $data['preferred_language'],
        ],
        'farmer_id'
    );

    $languageStmt = $conn->prepare(
        'INSERT INTO language_preferences (farmer_id, language_code, language_name) VALUES (?, ?, ?)'
    );

    $languageCode = strtoupper(substr($data['preferred_language'], 0, 2));
    $languageStmt->execute([$farmerId, $languageCode, $data['preferred_language']]);

    echo 'Success';
} catch (Throwable $exception) {
    http_response_code(500);
    echo 'Error: ' . $exception->getMessage();
}
