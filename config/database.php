<?php

$databaseUrl = getenv('DATABASE_URL') ?: '';

if ($databaseUrl !== '') {
    $parts = parse_url($databaseUrl);
    $scheme = $parts['scheme'] ?? 'pgsql';

    return [
        'driver' => $scheme === 'postgresql' ? 'pgsql' : $scheme,
        'host' => $parts['host'] ?? '127.0.0.1',
        'port' => isset($parts['port']) ? (int) $parts['port'] : (($scheme === 'pgsql' || $scheme === 'postgresql') ? 5432 : 3306),
        'database' => isset($parts['path']) ? ltrim($parts['path'], '/') : 'agriadvisory_hub',
        'username' => $parts['user'] ?? 'postgres',
        'password' => $parts['pass'] ?? '',
        'charset' => getenv('AGRI_DB_CHARSET') ?: 'utf8mb4',
    ];
}

return [
    'driver' => getenv('AGRI_DB_DRIVER') ?: 'mysql',
    'host' => getenv('AGRI_DB_HOST') ?: '127.0.0.1',
    'port' => (int) (getenv('AGRI_DB_PORT') ?: 3306),
    'database' => getenv('AGRI_DB_NAME') ?: 'agriadvisory_hub',
    'username' => getenv('AGRI_DB_USER') ?: 'root',
    'password' => getenv('AGRI_DB_PASS') ?: '',
    'charset' => getenv('AGRI_DB_CHARSET') ?: 'utf8mb4',
];
