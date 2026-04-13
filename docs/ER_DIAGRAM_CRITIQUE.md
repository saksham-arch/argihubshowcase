# ER Diagram Critique

## What is strong in this schema
- The design is normalized around clear transactional entities: `carts`, `cart_items`, `orders`, `order_items`, and `payments`.
- Many-to-many relationships are resolved correctly through associative entities: `cart_items` and `order_items`.
- The model supports both current functionality and future roadmap modules such as advisory, weather, analytics, multilingual preferences, and admin management.
- `payments.order_id` is unique, which correctly enforces the requested `ORDER` to `PAYMENT` cardinality of `1` to `0..1`.
- `language_preferences` uses a composite uniqueness rule on `(farmer_id, language_code)` so duplicate preferences are not stored.

## Limitations to note
- The prompt asks for `FARMER` to have many `LANGUAGE_PREFERENCE` records. In a production product, this is often modeled as exactly one active preference plus optional translation settings. The current schema follows the prompt but is more permissive than many real systems need.
- `ADMIN_USER` managing farmers, products, and orders is conceptual. The schema models this with nullable `managed_by_admin_id` foreign keys, which is practical but still a simplification of a full audit workflow.
- `WEATHER_DATA` and `CROP_ADVISORY` are represented as stored records, but actual recommendation generation logic is not yet implemented in the application UI.
- The frontend cart remains browser-local for simplicity, so the `carts` and `cart_items` tables are part of the deployable schema but not yet used in the visible cart flow.

## Recommended next improvements
- Add a true login flow so `farmers`, `user_sessions`, and `language_preferences` are surfaced in the running app.
- Add stock decrement and inventory checks before creating `order_items`.
- Add integration tests that validate inserts against MySQL using this schema file.
- Add an `advisory_requests` table if advisory history should distinguish manual requests from generated recommendations.
