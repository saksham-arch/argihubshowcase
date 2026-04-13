# Railway Deployment Notes

## Environment variables

Use Railway's PostgreSQL connection URL in `DATABASE_URL`. The PHP app reads this automatically.

```env
APP_ENV=production
DATABASE_URL=postgresql://postgres:<password>@<host>:5432/railway
```

## About the values you shared

- `DATABASE_PUBLIC_URL` is useful from outside Railway.
- `DATABASE_URL` should be used by the deployed app inside Railway.
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE` are already represented inside `DATABASE_URL`, so the app can rely on the single URL.

## Running on localhost with the deployed Railway database

If the PHP app runs locally through XAMPP or Apache on your laptop, use the Railway public connection string, not the private one.

```env
DATABASE_URL=postgresql://postgres:SZsBokcajFtrkUbGDXjhIRCnAvkJQcxW@<railway-public-host>:<railway-public-port>/railway
```

That lets the app open at `http://localhost/AgriAdvisory-main/` while the database stays hosted on Railway.

## Database bootstrap

Import `database/agriadvisory_hub_postgres.sql` into the Railway PostgreSQL service before opening the app.
