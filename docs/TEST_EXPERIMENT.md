# Design Test Cases for the PHP Mini Project

## Title
Design test cases for a PHP application to ensure code functionality and robustness.

## Aim of the Experiment
To validate and enhance the functionality and reliability of the AgriAdvisory Hub PHP application through effective test-case design and execution.

## Objectives
- Understand the PHPUnit framework and its role in PHP application testing.
- Design unit tests for form validation, cart normalization, payment mapping, and catalog logic.
- Execute tests to identify failures or unsafe assumptions in the code.
- Analyze results to improve application robustness and reliability.
- Refactor the code based on test outcomes so the backend becomes safer and easier to maintain.

## Course Outcomes Addressed
1. Design dynamic web pages using HTML pages already present in the mini project.
2. Use CSS to prepare web-page layout through the existing `style.css`.
3. Apply JavaScript for client-side validation in `script.js`.
4. Integrate server-side pages using PHP endpoints such as `register.php`, `get_products.php`, `place_order.php`, and `delete_cart.php`.
5. Apply database operations using MySQL schema design, prepared statements, and session-ready tables.

## Software / Tools Required
- XAMPP, WAMP, or MAMP
- PHP 8.1 or later
- MySQL 8 or MariaDB 10.5 or later
- Composer
- phpMyAdmin
- VS Code or any code editor
- Web browser

## Problem Statement
Develop and test a mini-project web application named AgriAdvisory Hub that allows farmers to register, browse agricultural products, place marketplace orders, and support future weather-based advisory features. The application must be verified using test cases that confirm correctness, handle invalid input safely, and support reliable database integration.

## Methodology
1. Identify modules with direct user or database impact.
2. Convert validation and normalization logic into reusable PHP functions.
3. Create PHPUnit test cases covering normal, boundary, and invalid scenarios.
4. Run the tests after refactoring.
5. Analyze failures and modify the code until the assertions match expected behavior.
6. Document the outcomes and residual testing opportunities.

## Theory
Unit testing is the process of verifying the smallest testable pieces of software independently so defects can be isolated early and regressions can be prevented during later changes. In PHP projects, PHPUnit is the de facto standard framework for writing assertions, organizing repeatable tests, and producing deterministic evidence of software behavior. For a mini project like AgriAdvisory Hub, unit testing is especially useful because it validates business rules such as form input validation, order total verification, and data normalization without depending on manual browser checks alone. These tests improve maintainability, reduce the risk of invalid database writes, and create a clear bridge between frontend actions and backend correctness.

Prepared statements and defensive validation are closely tied to robustness. When the application validates length, format, and numeric boundaries before storing data, it reduces runtime failures and rejects malformed submissions consistently. When those same rules are covered by tests, the application becomes easier to refactor because behavior is documented in executable form.

## PHPUnit Test Cases Implemented

| Test ID | Module | Scenario | Expected Result |
|---|---|---|---|
| TC-01 | Product catalog | Load static fallback catalog | 6 default products are available |
| TC-02 | Registration validation | Submit valid farmer details | Validation passes |
| TC-03 | Registration validation | Submit invalid email, short password, negative land | Validation fails with field errors |
| TC-04 | Order normalization | Duplicate product lines in cart | Items are grouped and subtotal is recalculated |
| TC-05 | Order validation | Tampered total amount sent from client | Validation rejects payload |
| TC-06 | Order validation | Valid checkout payload | Validation passes and correct total is derived |
| TC-07 | Payment mapping | Different payment modes | Correct gateway label is generated |

## Result Analysis
- The backend is now testable because the validation and normalization logic has been separated from direct request handling.
- Registration no longer writes raw passwords or raw SQL strings directly.
- Checkout verifies that the submitted total matches the actual cart items, which prevents client-side tampering from silently creating invalid orders.
- The test suite covers the highest-risk business logic in the current implementation. Database integration, HTTP integration, and browser-flow testing can be added next as integration tests.

## Refactoring Done Based on Testability
- Introduced shared helpers in `includes/helpers.php`.
- Replaced vulnerable inline SQL in `register.php` with prepared statements and password hashing.
- Refactored `place_order.php` to validate input, normalize cart items, and write into normalized `orders`, `order_items`, and `payments` tables.
- Updated `get_products.php` so it uses the database first and falls back to the built-in catalog if needed.

## Suggested Further Testing
- Add integration tests against a disposable MySQL database.
- Add browser tests for registration and checkout.
- Add tests for duplicate registration prevention and out-of-stock behavior.
- Add tests for future modules such as weather ingestion, crop advisory generation, analytics reporting, and multilingual preferences.

## References
- Beck, K. (2002). *Test driven development: By example*. Addison-Wesley.
- Bergmann, S. (2024). *PHPUnit manual*. [https://phpunit.de/documentation.html](https://phpunit.de/documentation.html)
- Nixon, R. (2021). *Learning PHP, MySQL & JavaScript* (6th ed.). O'Reilly Media.
- Welling, L., & Thomson, L. (2017). *PHP and MySQL web development* (5th ed.). Addison-Wesley.
