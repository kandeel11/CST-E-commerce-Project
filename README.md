# Ecobazar  E-Commerce Platform

> A full-featured, client-side e-commerce web application built with **vanilla JavaScript**, **HTML5**, **CSS3**, and **Bootstrap 5**. All data is persisted in `localStorage` / `sessionStorage`  no backend required.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Getting Started](#4-getting-started)
5. [Architecture & Design Patterns](#5-architecture--design-patterns)
6. [Data Models (OOP)](#6-data-models-oop)
7. [Storage Layer](#7-storage-layer)
8. [Pages & Features](#8-pages--features)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Cart & Checkout Flow](#10-cart--checkout-flow)
11. [Order Lifecycle](#11-order-lifecycle)
12. [Product Reviews System](#12-product-reviews-system)
13. [Wishlist System](#13-wishlist-system)
14. [Seller Dashboard](#14-seller-dashboard)
15. [Admin Dashboard](#15-admin-dashboard)
16. [Customer Dashboard](#16-customer-dashboard)
17. [Search & Filtering](#17-search--filtering)
18. [Responsive Design](#18-responsive-design)
19. [JSON Seed Data](#19-json-seed-data)
20. [Contributors](#20-contributors)

---

## 1. Project Overview

**Ecobazar** is an organic grocery e-commerce platform supporting three user roles:

| Role         | Capabilities                                                                         |
| ------------ | ------------------------------------------------------------------------------------ |
| **Customer** | Browse products, add to cart/wishlist, place orders, review products, manage profile |
| **Seller**   | List products, manage inventory, confirm/cancel orders, view revenue charts          |
| **Admin**    | Manage all users & sellers, oversee all orders, analytics dashboard                  |

The entire application runs in the browser  all state is stored in `localStorage` and `sessionStorage`, providing a seamless single-page experience.

---

## 2. Tech Stack

| Layer   | Technology                                                     |
| ------- | -------------------------------------------------------------- |
| Markup  | HTML5, semantic elements                                       |
| Styling | CSS3, Bootstrap 5.3.8, Font Awesome 6, Bootstrap Icons         |
| Logic   | Vanilla JavaScript (ES6 Modules), OOP with classes             |
| Storage | `localStorage` (persistent), `sessionStorage` (session-scoped) |
| Charts  | Chart.js (analytics & dashboards)                              |
| Fonts   | Google Fonts  Poppins                                         |
| Avatars | ui-avatars.com API (auto-generated initials)                   |

---

## 3. Folder Structure

```
CST-E-commerce-Project/
|
|-- index.html                 <- Root entry point (auto-redirects to Home)
|
|-- index.html                 <- Root entry point (auto-redirects to Home)
|-- README.md
|
|-- Css/                       <- Page-specific stylesheets
|   |-- Admin.css
|   |-- Cart.css
|   |-- Checkout.css
|   |-- Footer.css
|   |-- Forgetpassword.css
|   |-- Home.css               <- Global/shared styles + CSS variables
|   |-- Login.css
|   |-- manageSeller.css
|   |-- NavBar.css
|   |-- orderManagment.css
|   |-- Product.css
|   |-- ProductDetails.css
|   |-- Register.css
|   |-- Seller.css
|   |-- userDashboard.css
|   +-- WishList.css
|
|-- Data/
|   |-- ecobazar.json          <- Seed product data (7 categories, 50+ products)
|   +-- Seller.json            <- Seller seed data
|
|-- Js/
|   |-- Cart.js                <- Cart page logic (table, quantity, totals)
|   |-- Checkout.js            <- Order creation, form validation, stock management
|   |-- ForgetPassword.js      <- Password reset by verifying user info
|   |-- Home.js                <- Home page: load data, render sections, countdown
|   |-- Login.js               <- Login form, remember-me, role-based redirect
|   |-- NavBar.js              <- Navbar auth, search auto-suggest, cart badge
|   |-- orderManagment.js      <- Order management charts & table
|   |-- ProductDetails.js      <- Product detail page, reviews, related products
|   |-- Register.js            <- Registration form with full validation
|   |-- seedData.js            <- Default users / sellers seed (runs once)
|   |-- Toast.js               <- Global toast notification utility
|   |-- userDashboard.js       <- Customer dashboard: orders, settings, reviews
|   |-- WishList.js            <- Wishlist page: add/remove/add-to-cart
|   |
|   |-- controllers/           <- Page-level controllers
|   |   |-- manageSellersController.js
|   |   |-- productController.js  <- Product listing: filters, sort, pagination
|   |   +-- sellerController.js   <- Seller dashboard controller
|   |
|   |-- models/                <- Domain models with private fields (OOP)
|   |   |-- Admin.js
|   |   |-- Cart.js
|   |   |-- CartItem.js
|   |   |-- Customer.js
|   |   |-- idGenerator.js     <- UUID generator
|   |   |-- Order.js
|   |   |-- OrderItem.js
|   |   |-- Product.js
|   |   |-- Seller.js
|   |   +-- User.js            <- Base class for all user types
|   |
|   +-- services/              <- Shared service layer
|       |-- authService.js     <- register() & login() logic
|       |-- Login.js           <- Login form event binding
|       |-- Register.js        <- Register form event binding
|       +-- storageService.js  <- Central CRUD for products, orders, cart, wishlist
|
+-- Pages/                     <- HTML pages
    |-- AboutUs.html
    |-- Admin.html
    |-- Cart.html
    |-- Checkout.html
    |-- ContactUs.html
    |-- Customer.html
    |-- Footer.html            <- Reusable footer component (loaded via fetch)
    |-- Forgetpassword.html
    |-- Home.html              <- Landing page
    |-- Login.html
    |-- manageSellers.html
    |-- NavBar.html            <- Reusable navbar component (loaded via fetch)
    |-- orderManagment.html
    |-- Product.html           <- Product catalog with filtering
    |-- ProductDetails.html    <- Single product view with tabs
    |-- Register.html
    |-- Seller.html            <- Seller dashboard
    |-- userdashboard.html     <- Customer dashboard
    +-- WishList.html
```

---

## 4. Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (required for ES6 module `import` statements)

### Running the Project

**Option A -- VS Code Live Server (recommended):**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click **`index.html`** (in the project root) -> **Open with Live Server**
3. The app will automatically redirect to the Home page

**Option B -- Open directly:**

1. Open `index.html` in your browser (note: ES6 modules require a local server)

### First-Time Setup

On first load, `Home.js` automatically seeds `localStorage` with:
- **16 default accounts** (1 admin, 3 customers, 12 sellers — see table below)
- **50+ products** fetched from `Data/ecobazar.json`

You can also register a new account manually.

---

### Default Test Accounts

These accounts are seeded automatically on first run and can be used to test each role:

#### Admin

| Email | Password |
| ----- | -------- |
| `admin@ecobazar.com` | `Admin@1234` |

#### Customers

| Email | Password |
| ----- | -------- |
| `customer1@ecobazar.com` | `Customer@1234` |
| `customer2@ecobazar.com` | `Customer@1234` |
| `customer3@ecobazar.com` | `Customer@1234` |

#### Sellers (IDs: SLR-001 through SLR-012)

| Email | Password |
| ----- | -------- |
| `seller01@ecobazar.com` | `Seller@1234` |
| `seller02@ecobazar.com` | `Seller@1234` |
| `seller03@ecobazar.com` | `Seller@1234` |
| `seller04@ecobazar.com` | `Seller@1234` |
| `seller05@ecobazar.com` | `Seller@1234` |
| `seller06@ecobazar.com` | `Seller@1234` |
| `seller07@ecobazar.com` | `Seller@1234` |
| `seller08@ecobazar.com` | `Seller@1234` |
| `seller09@ecobazar.com` | `Seller@1234` |
| `seller10@ecobazar.com` | `Seller@1234` |
| `seller11@ecobazar.com` | `Seller@1234` |
| `seller12@ecobazar.com` | `Seller@1234` |

> **Tip:** The Login page shows a quick reference panel with sample credentials for each role.

---

## 5. Architecture & Design Patterns

### Component-Based HTML Loading

The Navbar and Footer are stored as separate HTML files and loaded dynamically via `fetch()` into placeholder `<div>` elements on each page:

```javascript
fetch("NavBar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-placeholder").innerHTML = data;
    if (window.initNavBarAuth) window.initNavBarAuth();
    if (window.updateCartBadge) window.updateCartBadge();
  });
```

### ES6 Module System

JavaScript files use ES6 `import`/`export` syntax. Scripts are loaded with `type="module"` in HTML:

```html
<script type="module" src="../Js/NavBar.js"></script>
```

### Global Window Functions

For cross-module communication, key functions are exposed on `window`:

- `window.initNavBarAuth` -- Refresh navbar auth state
- `window.updateCartBadge` -- Update cart count/total in navbar
- `window.showBootstrapToast(message, type)` -- Show global toast notification
- `window.isSellerOrAdmin()` -- Check if current user is seller/admin

### Storage as Database

`localStorage` acts as the persistent data store:

- All CRUD operations go through `storageService.js`
- `sessionStorage` holds the current user session
- Cross-tab sync is handled via `storage` events

---

## 6. Data Models (OOP)

### Class Hierarchy

```
User (base)
|-- Customer
|-- Seller
+-- Admin
```

### User (Base Class)

| Field       | Type   | Access   | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| `#id`       | string | readonly | UUID via `crypto.randomUUID()`         |
| `#email`    | string | get/set  | User email address                     |
| `#name`     | string | get/set  | Full name                              |
| `#password` | string | get/set  | Password                               |
| `#role`     | string | get/set  | `"customer"`, `"seller"`, or `"admin"` |
| `#status`   | string | get/set  | `"active"` (default)                   |

### Customer

Extends `User`. Adds:

| Field            | Type  | Description        |
| ---------------- | ----- | ------------------ |
| `#orderHistory`  | Array | List of past orders |

### Seller

Extends `User`. Adds:

| Field               | Type   | Description                   |
| ------------------- | ------ | ----------------------------- |
| `#sellerID`         | string | Separate seller UUID          |
| `#storeName`        | string | Store display name            |
| `#storeDescription` | string | Store description             |
| `#products`         | Array  | Product IDs managed by seller |
| `#salesHistory`     | Array  | Order IDs                     |
| `#totalRevenue`     | number | Running revenue total         |

### Admin

Extends `User` with no additional fields.

### Product

| Field                 | Type   | Description          |
| --------------------- | ------ | -------------------- |
| `#productID`          | string | UUID                 |
| `#productName`        | string | Product name         |
| `#procuctCategory`    | string | Category             |
| `#productDescription` | string | Description          |
| `#productPrice`       | number | Price                |
| `#sellerID`           | string | Seller who listed it |
| `#imageUrl`           | string | Product image URL    |
| `#stockQuantity`      | number | Available stock      |
| `#createdDate`        | Date   | Creation date        |

### Cart & Order Models

| Model       | Key Fields                            | Description      |
| ----------- | ------------------------------------- | ---------------- |
| `Cart`      | cartID, customerID, cartItems[]       | Shopping cart     |
| `CartItem`  | productId, quantity                   | Single cart item  |
| `Order`     | id, customerId, items[], total        | Customer order    |
| `OrderItem` | productId, quantity, priceAtPurchase  | Single order item |

---

## 7. Storage Layer

### localStorage Keys

| Key              | Type                        | Description                          |
| ---------------- | --------------------------- | ------------------------------------ |
| `products`       | `Array<Product>`            | All products in the platform         |
| `orders`         | `Array<Order>`              | All orders from all users            |
| `users`          | `Array<User>`               | All registered users                 |
| `cart`           | `Array<{userid, items[]}>`  | Shopping carts for all users         |
| `WishLists`      | `Object<userId: Product[]>` | Wishlists keyed by user ID           |
| `RememberedUser` | `Object`                    | Remember-me login data               |
| `cartUpdated`    | `timestamp`                 | Trigger for cart cross-tab sync      |
| `wishUpdated`    | `timestamp`                 | Trigger for wishlist cross-tab sync  |

### sessionStorage Keys

| Key              | Type     | Description                        |
| ---------------- | -------- | ---------------------------------- |
| `currentUser`    | `Object` | Logged-in customer data            |
| `currentSeller`  | `Object` | Logged-in seller data              |
| `currentAdmin`   | `Object` | Logged-in admin data               |
| `MyCart`         | `Object` | Current user's cart (quick access) |

### storageService.js -- Key Functions

| Function                          | Description                   |
| --------------------------------- | ----------------------------- |
| `getCurrentUser()`                | Get current user from session |
| `getAllProducts()`                | Get all products              |
| `getAllOrders()`                  | Get all orders                |
| `getAllUsers()`                   | Get all users                 |
| `addProductToStorage(product)`    | Add new product               |
| `updateProduct(product)`          | Update existing product       |
| `removeProductFromStorage(id)`    | Delete product                |
| `getSellerProducts(sellerId)`     | Get seller's products         |
| `getSellerOrders(sellerId)`       | Get seller's order items      |
| `getSellerTotalRevenue(sellerId)` | Calculate seller revenue      |
| `addToCart(product)`              | Add product to cart           |
| `removeFromCart(productId)`       | Remove from cart              |
| `clearCart()`                     | Empty current user's cart     |
| `toggleWishlist(product)`         | Toggle wishlist state         |
| `getCartCount()`                  | Total item count in cart      |

---

## 8. Pages & Features

### 8.1 Home Page

- **Hero Banner** with featured products
- **Category Grid** -- Fruits, Vegetables, Meat & Fish, Dairy, Bakery, Beverages, Snacks
- **Featured Products** carousel/grid
- **Daily/Monthly Sales** with countdown timer
- **Popular & Top-Rated** product sections
- Auto-seeds products from `ecobazar.json` on first load

### 8.2 Product Catalog

- **Grid/List View** toggle
- **Category Sidebar** with item counts
- **Real-time Search** filter
- **Advanced Filters** -- Price range, rating, organic, in-stock
- **Sorting** -- Price, name, rating, discount
- **Pagination** -- 9 products per page
- **URL Parameters** -- `?category=Fruits`, `?search=banana`
- **Add to Cart / Wishlist** buttons per product card

### 8.3 Product Details

- **Image Gallery** with thumbnails
- **Product Info** -- Price, discount badge, stock status, brand, category
- **Quantity Selector** with stock limit
- **Tabbed Content:** Description, additional info, customer reviews
- **Related Products** from same category
- **Review System** -- Star rating + comment (customers only)

### 8.4 Login

- Email & password with show/hide toggle
- **Remember Me** checkbox
- Role-based redirect: Customer -> Home, Seller -> Dashboard, Admin -> Admin Panel

### 8.5 Registration

- **Fields:** Name, Email, Password, Phone, Address, Role
- **Real-Time Validation:** Email uniqueness, password strength, phone format
- Creates Customer or Seller based on role

### 8.6 Forgot Password

- Verify identity with name, email, and phone
- Resets password on successful verification

### 8.7 Shopping Cart

- Product table with quantity controls
- Cart summary with subtotal and total
- **Proceed to Checkout** (login required)
- Cross-session cart sync

### 8.8 Checkout

- Order summary with product details
- Billing form with validation (auto-fills from profile)
- Stock verification and inventory management
- Redirects to Home after successful order

### 8.9 Wishlist

- Product list with stock status
- **Add to Cart** and **Remove** buttons
- Cross-tab sync via `storage` events
- Login required for access

### 8.10 Customer Dashboard

- **Profile** -- Avatar, name, billing address
- **Order History** -- View details, cancel orders, review completed orders
- **Settings** -- Edit account info, address, change password
- **Auto Review Prompt** for completed orders

### 8.11 Seller Dashboard

- **Product Management** -- Add, edit, delete products
- **Orders Table** -- View orders per product with status
- **Order Actions** -- Confirm (complete) or cancel
- **Revenue Tracking** -- Total revenue from completed sales

### 8.12 Order Management

- **Charts** (Chart.js): Orders overview line chart, popular products bar chart
- **Orders Table** -- Paginated with status badges

### 8.13 Admin Dashboard

- **Overview** -- Total Users, Sellers, Orders, Revenue stats
- **Charts** -- Orders overview, popular products, users/sellers distribution
- **Manage Users** -- View, search, toggle status, delete, reset password
- **Manage Sellers** -- KPIs, filter, toggle active/inactive, delete
- **Products** -- Browse all products with category filter, search, pagination
- **All Orders** -- View all orders with detail modal, pagination

### 8.14 Static Pages

- **About Us** -- Company information and team
- **Contact Us** -- Contact form and details

---

## 9. Authentication & Authorization

### Registration Flow

```
Register Page
  -> Validate all fields (format, uniqueness)
  -> Create Customer or Seller instance
  -> Save to localStorage
  -> Redirect to Login
```

### Login Flow

```
Login Page
  -> Find user by email + password
  -> Store in sessionStorage
  -> Redirect by role
```

### Session Management

- **Login:** User stored in `sessionStorage` (cleared on tab close)
- **Remember Me:** Credentials persisted in `localStorage`
- **Logout:** Clears session, reloads page
- **Auth Guards:** Protected pages redirect to Login if no session

### Role-Based UI

- Navbar hides cart/wishlist for sellers and admins
- Product cards hide "Add to Cart" / "Wishlist" for sellers/admins
- Admin pages are restricted to admin role

---

## 10. Cart & Checkout Flow

### Adding to Cart

```
User clicks "Add to Cart"
  -> Find/create user's cart in localStorage
  -> If product exists -> increment quantity (respects stock)
  -> If new -> add product with quantity 1
  -> Sync localStorage + sessionStorage
  -> Update navbar cart badge
```

### Checkout Completion

```
User fills billing form -> Confirm Order
  -> Validate form fields
  -> Verify stock for each product
  -> Decrement stock in localStorage
  -> Set order status to "Processing"
  -> Clear cart
  -> Redirect to Home
```

---

## 11. Order Lifecycle

```
+---------+     +------------+     +-----------+
| Pending | --> | Processing | --> | Completed |
+---------+     +------------+     +-----------+
    |                  |
    | (user cancels)   | (seller cancels)
    v                  v
+----------------+  +-----------+
| User Cancelled |  | Cancelled |
+----------------+  +-----------+
```

| Status          | Set By   | Meaning                              |
| --------------- | -------- | ------------------------------------ |
| `Pending`       | System   | Order created, awaiting checkout     |
| `Processing`    | System   | Checkout completed, awaiting seller  |
| `Completed`     | Seller   | Seller confirmed delivery            |
| `Cancelled`     | Seller   | Seller cancelled the order           |
| `UserCancelled` | Customer | Customer cancelled before completion |

Each product within an order can have its own status, enabling partial fulfillment. Stock is restored automatically on cancellation.

---

## 12. Product Reviews System

- Star rating (1-5) with comment for each product
- One review per user per product
- Average rating auto-recalculates on new review
- Reviews displayed on product detail page with reviewer info
- Completed orders prompt review from customer dashboard
- Only customers can write reviews

---

## 13. Wishlist System

- **Toggle** -- Click heart icon on any product card to add/remove
- **Wishlist Page** -- Full product list with stock status and add-to-cart
- **Cross-Page Sync** -- Heart icons update via custom events
- **Cross-Tab Sync** -- Automatic updates via `storage` events
- **Login Required** -- Guest users see a login prompt

---

## 14. Seller Dashboard

### Product Management

- **Add/Edit Product** -- Name, category, description, price, stock, image URL
- **Delete Product** -- Confirmation modal before removal
- **Products Table** -- Image, name, price, stock with edit/delete actions

### Order Management

- **Orders Table** -- Buyer, product, quantity, status, actions
- **Confirm** -- Marks product as completed
- **Cancel** -- Restores stock, updates status
- **Status Badges** -- Color-coded by status

---

## 15. Admin Dashboard

### Overview

- **Stats Cards** -- Total Users, Sellers, Orders, Revenue
- **Charts:** Orders overview (line), popular products (bar), users/sellers (doughnut)

### Management Sections

| Section            | Features                                                             |
| ------------------ | -------------------------------------------------------------------- |
| **Manage Users**   | Search, view details, toggle active/inactive, delete, reset password |
| **Manage Sellers** | KPI cards, status filter, search, toggle active, delete              |
| **Products**       | Browse all products, category filter, search, pagination             |
| **All Orders**     | View all orders, order detail modal, pagination                      |

---

## 16. Customer Dashboard

| Section           | Features                                                            |
| ----------------- | ------------------------------------------------------------------- |
| **Dashboard**     | Profile card, billing address                                       |
| **Order History** | All orders with view details, cancel order, review completed orders |
| **Settings**      | Edit account info, address, change password                         |

---

## 17. Search & Filtering

### Navbar Search

- **Auto-Suggest** -- Top 5 matching products by name or category
- Each suggestion shows image, name, and price
- Redirects to Product page with search query
- **Mobile Search** -- Collapsible search row

### Product Catalog Filters

| Filter      | Type           | Description                     |
| ----------- | -------------- | ------------------------------- |
| Category    | Sidebar clicks | 7 categories + "All"            |
| Search      | Text input     | Filters by name and description |
| Price Range | Slider         | Max price filter                |
| Rating      | Radio buttons  | Minimum star rating             |
| Organic     | Checkbox       | Organic products only           |
| In Stock    | Checkbox       | In-stock items only             |
| Sort        | Dropdown       | Price, name, rating, discount   |

---

## 18. Responsive Design

Built with **Bootstrap 5's grid system** and custom media queries:

| Breakpoint             | Layout                                        |
| ---------------------- | --------------------------------------------- |
| **Mobile** (< 768px)   | Single column, hamburger menu, stacked cards  |
| **Tablet** (768-992px)  | Two-column grids, collapsible sidebar         |
| **Desktop** (> 992px)  | Full multi-column layout, side-by-side panels |

### Key Features

- Navbar collapses to hamburger menu on mobile
- Product grid adapts: 1 col -> 2 cols -> 3-4 cols
- Cart and checkout forms stack on small screens
- Dashboard sidebar becomes full-width on mobile

---

## 19. JSON Seed Data

### `Data/ecobazar.json`

Product data organized by 7 categories:

```json
{
    "Fruits": [ ... ],
    "Vegetables": [ ... ],
    "Meat & Fish": [ ... ],
    "Dairy": [ ... ],
    "Bread & Bakery": [ ... ],
    "Beverages": [ ... ],
    "Snacks": [ ... ]
}
```

### Product Shape

```json
{
  "product_id": 1,
  "name": "Fresh Organic Bananas",
  "images": ["url1", "url2", "url3", "url4"],
  "price": 1.99,
  "oldPrice": 2.99,
  "discount": 33,
  "rating": 5,
  "brand": "Nature's Best",
  "description": "Sweet and ripe organic bananas...",
  "category": "Fruits",
  "unit": "Bunch",
  "weight": "1 kg",
  "organic": true,
  "stock": 150,
  "seller_id": "SLR-1",
  "reviews": [
    { "user_id": 1, "rating": 5, "comment": "Always fresh!" }
  ]
}
```

---

## 20. Contributors

This project was developed as part of the **ITI (Information Technology Institute) 4-Month Program -- Client-Side Technologies (CST)** track.

---

> **License:** This project is for educational purposes as part of the ITI CST program.
