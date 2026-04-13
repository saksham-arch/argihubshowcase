# AgriAdvisory Hub Run and Deploy Guide

This project now supports both of these modes:

1. `XAMPP/WAMP/MAMP + MySQL`
2. `Docker or Railway + PostgreSQL`

The frontend pages stay the same in both modes:

- `index.html`
- `register.html`
- `products.html`
- `dashboard.html`
- `advisory.html`
- `admin.html`
- `checkout.html`

The backend auto-loads database configuration from `.env` if present. If `DATABASE_URL` is set, it will use that first. Otherwise it falls back to the `AGRI_DB_*` variables.

## Files to use

- MySQL schema: `database/agriadvisory_hub.sql`
- PostgreSQL schema: `database/agriadvisory_hub_postgres.sql`
- Local env template: `.env.example`
- Localhost + Railway env template: `.env.localhost.railway.example`
- Railway env template: `.env.railway.example`
- Deployment notes: `RAILWAY.md`

## Option 1: Run with XAMPP

### 1. Put the project in `htdocs`

Example:

```bash
/Applications/XAMPP/xamppfiles/htdocs/AgriAdvisory-main
```

### 2. Start Apache and MySQL

Use the XAMPP control panel and start:

- `Apache`
- `MySQL`

### 3. Create `.env`

Copy `.env.example` to `.env` and use:

```env
APP_ENV=local
AGRI_DB_DRIVER=mysql
AGRI_DB_HOST=127.0.0.1
AGRI_DB_PORT=3306
AGRI_DB_NAME=agriadvisory_hub
AGRI_DB_USER=root
AGRI_DB_PASS=
AGRI_DB_CHARSET=utf8mb4
```

### 4. Import the schema

Open phpMyAdmin and import:

- `database/agriadvisory_hub.sql`

or run the SQL manually in phpMyAdmin.

### 5. Open the project

```text
http://localhost/AgriAdvisory-main/
```

### What should work

- Farmer registration writes to `farmers` and `language_preferences`
- Products load from `products` and fall back to the built-in catalog if the database is empty or unavailable
- Checkout writes to `orders`, `order_items`, and `payments`
- Dashboard, advisory, and admin pages can be used as static demo pages
- The cart still uses browser `localStorage`, so no UI changes were introduced

## Option 1B: Run on localhost with XAMPP and use the deployed Railway PostgreSQL database

This mode is for running the website locally on `localhost` while keeping the database hosted on Railway.

### 1. Start Apache in XAMPP

You only need:

- `Apache`

You do not need local MySQL in this mode.

### 2. Create `.env`

Copy `.env.localhost.railway.example` to `.env`.

Important:

- When the project runs on your local machine, `DATABASE_URL` must use the Railway **public** PostgreSQL endpoint.
- The Railway private host works only for services deployed inside Railway.

Use this pattern:

```env
APP_ENV=local
DATABASE_URL=postgresql://postgres:SZsBokcajFtrkUbGDXjhIRCnAvkJQcxW@<railway-public-host>:<railway-public-port>/railway
```

### 3. Ensure the hosted database already has the schema

Import this into Railway PostgreSQL:

- `database/agriadvisory_hub_postgres.sql`

### 4. Open the app locally

```text
http://localhost/AgriAdvisory-main/
```

### What should work in this mode

- Local pages run through Apache on localhost
- PHP endpoints connect to Railway PostgreSQL remotely
- Products still fall back to the built-in static catalog if the remote database is unavailable
- Registration and checkout need the database connection to succeed

## Option 1C: Run fully as a static demo on XAMPP with no database connection

This is the easiest classroom/demo mode.

### 1. Put the project in `htdocs`

Example:

```bash
/Applications/XAMPP/xamppfiles/htdocs/AgriAdvisory-main
```

### 2. Start only Apache

You only need:

- `Apache`

Do not start MySQL if you want to test the no-database path.

### 3. Open the project

```text
http://localhost/AgriAdvisory-main/
```

### What works in full demo mode

- `index.html`
- `products.html` with static fallback catalog
- `register.html` with local demo registration storage
- `checkout.html` with local demo order storage
- `dashboard.html`
- `advisory.html`
- `admin.html`

### What is stored locally in demo mode

- Cart items
- Demo farmer registrations
- Demo order records

These are stored in browser `localStorage`, so the flow remains complete even without a database.

## Option 2: Run without XAMPP using Docker

### 1. Create `.env`

For local Docker + PostgreSQL:

```env
APP_ENV=local
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/agriadvisory_hub
```

### 2. Start containers

```bash
docker compose up --build
```

### 3. Import the PostgreSQL schema

In another terminal:

```bash
docker compose exec -T postgres psql -U postgres -d agriadvisory_hub < database/agriadvisory_hub_postgres.sql
```

### 4. Open the app

```text
http://localhost:8080/
```

## Option 3: Deploy on Railway with PostgreSQL

### 1. Add a Railway PostgreSQL service

Provision PostgreSQL in Railway first.

### 2. Set environment variables for the PHP app

The app only needs this one value to connect:

```env
DATABASE_URL=postgresql://postgres:<password>@<private-host>:5432/railway
```

You can also keep the full Railway variable set for operational visibility. The names from your Railway database are already reflected in `.env.railway.example`:

- `DATABASE_PUBLIC_URL`
- `DATABASE_URL`
- `PGDATA`
- `PGDATABASE`
- `PGHOST`
- `PGPASSWORD`
- `PGPORT`
- `PGUSER`
- `POSTGRES_DB`
- `POSTGRES_PASSWORD`
- `POSTGRES_USER`
- `RAILWAY_DEPLOYMENT_DRAINING_SECONDS`
- `SSL_CERT_DAYS`

### 3. Import the PostgreSQL schema

Import:

- `database/agriadvisory_hub_postgres.sql`

### 4. Deploy the PHP app

This repository includes a `Dockerfile`, so Railway can deploy it as a containerized PHP Apache app.

### 5. Open the Railway URL

After deployment, the app should serve directly from the root path.

## Running tests

### Install PHPUnit

```bash
composer install
```

### Run tests

```bash
composer test
```

or:

```bash
vendor/bin/phpunit --configuration phpunit.xml
```

## What changed to make the project deployable

- Database access is now environment-driven.
- The backend uses PDO, so it can talk to both MySQL and PostgreSQL.
- Separate SQL files are provided for MySQL and PostgreSQL.
- A Docker deployment path is included.
- Railway environment mapping is documented.
- Core backend logic is now unit-testable through PHPUnit.

## Important notes

- Do not commit a real `.env` file with live Railway passwords.
- The current visible UI still uses `localStorage` for cart state by design, so the user experience remains simple.
- Static fallback is implemented for the products page, so browsing products still works even if the database is unavailable.
- Registration and checkout also have a local demo fallback in the frontend so the showcase flow still works with no database.
- Weather, analytics, advisory, sessions, and admin are represented as active static demo pages in this version.

## If something fails to start

Check these first:

1. PHP has `pdo`, `pdo_mysql`, or `pdo_pgsql` enabled depending on your database.
2. The selected SQL file matches the selected database engine.
3. `.env` points to the correct host, port, username, password, and database.
4. The database was imported before opening the registration or checkout pages.
