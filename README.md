# AgriAdvisory Hub

AgriAdvisory Hub is a PHP mini project for farmer registration, agricultural product browsing, cart-based checkout, and future-ready advisory features such as weather insights, analytics, multilingual preferences, sessions, notifications, and admin oversight.

## What is implemented

- Landing page for the platform overview
- Farmer registration form with backend validation and secure password hashing
- Marketplace page with database-backed products and static fallback products
- Checkout page with LocalStorage cart and backend order placement
- Normalized relational schema for current and future modules
- PHPUnit test cases for core backend validation and order logic
- Deployment paths for XAMPP, Docker, and Railway

## Main files

- Run and deployment guide: [RUN_AND_DEPLOY.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/RUN_AND_DEPLOY.md)
- MySQL schema: [database/agriadvisory_hub.sql](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/database/agriadvisory_hub.sql)
- PostgreSQL schema: [database/agriadvisory_hub_postgres.sql](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/database/agriadvisory_hub_postgres.sql)
- Localhost + Railway env template: [.env.localhost.railway.example](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/.env.localhost.railway.example)
- Implementation overview: [docs/IMPLEMENTATION_OVERVIEW.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/docs/IMPLEMENTATION_OVERVIEW.md)
- Test experiment write-up: [docs/TEST_EXPERIMENT.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/docs/TEST_EXPERIMENT.md)
- ER diagram critique: [docs/ER_DIAGRAM_CRITIQUE.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/docs/ER_DIAGRAM_CRITIQUE.md)
- Railway notes: [RAILWAY.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/RAILWAY.md)

## Database support

The application supports:

- `MySQL` for XAMPP/WAMP/MAMP
- `PostgreSQL` for Docker and Railway

It reads configuration from `.env`. If `DATABASE_URL` is present, that is used first. Otherwise it falls back to `AGRI_DB_*` variables.

## Quick start

For full instructions, use [RUN_AND_DEPLOY.md](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/RUN_AND_DEPLOY.md).

### XAMPP

1. Put the project under `htdocs`
2. Start Apache and MySQL
3. Create `.env` from `.env.example`
4. Import [database/agriadvisory_hub.sql](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/database/agriadvisory_hub.sql)
5. Open `http://localhost/AgriAdvisory-main/`

### Railway

1. Provision PostgreSQL
2. Set `DATABASE_URL`
3. Import [database/agriadvisory_hub_postgres.sql](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/database/agriadvisory_hub_postgres.sql)
4. Deploy using the included `Dockerfile`

### Localhost using the Railway DB

1. Start Apache in XAMPP
2. Copy [.env.localhost.railway.example](/Users/sakshamtyagi/Downloads/AgriAdvisory-main/.env.localhost.railway.example) to `.env`
3. Set `DATABASE_URL` to the Railway public PostgreSQL URL
4. Open `http://localhost/AgriAdvisory-main/`

## Testing

```bash
composer install
composer test
```

## Notes

- The UI/UX was kept aligned with the existing project structure and behavior.
- The cart remains frontend-local through browser LocalStorage to avoid unnecessary UI complexity.
- Future modules are represented in the schema and documentation, even if their UI screens are not yet exposed in this version.

# argihubshowcase
