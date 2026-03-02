# Ecobazar — E-Commerce Platform

> A full-featured, client-side e-commerce web application built with **vanilla JavaScript**, **HTML5**, **CSS3**, and **Bootstrap 5**. All data is persisted in `localStorage` / `sessionStorage` — no backend required.

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
9. [JavaScript Modules Reference](#9-javascript-modules-reference)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Cart & Checkout Flow](#11-cart--checkout-flow)
12. [Order Lifecycle](#12-order-lifecycle)
13. [Product Reviews System](#13-product-reviews-system)
14. [Wishlist System](#14-wishlist-system)
15. [Seller Dashboard](#15-seller-dashboard)
16. [Admin Dashboard](#16-admin-dashboard)
17. [Customer Dashboard](#17-customer-dashboard)
18. [Order Management (Seller)](#18-order-management-seller)
19. [Search & Filtering](#19-search--filtering)
20. [Responsive Design](#20-responsive-design)
21. [JSON Seed Data](#21-json-seed-data)
22. [Known Limitations](#22-known-limitations)
23. [Contributors](#23-contributors)

---

## 1. Project Overview

**Ecobazar** is an organic grocery e-commerce platform supporting three user roles:

| Role       | Capabilities |
|------------|-------------|
| **Customer** | Browse products, add to cart/wishlist, place orders, review products, manage profile |
| **Seller**   | List products, manage inventory, confirm/cancel orders, view revenue charts |
| **Admin**    | Manage all users, oversee all orders, platform-level controls |

The entire application runs in the browser with **no server or API** — all state is stored in `localStorage` and `sessionStorage`.

---

## 2. Tech Stack

| Layer       | Technology |
|------------|-----------|
| Markup      | HTML5, semantic elements |
| Styling     | CSS3, Bootstrap 5.3.8, Font Awesome 6, Bootstrap Icons |
| Logic       | Vanilla JavaScript (ES6 Modules), OOP with classes |
| Storage     | `localStorage` (persistent), `sessionStorage` (session-scoped) |
| Charts      | Chart.js (order management analytics) |
| Fonts       | Google Fonts — Poppins |
| Avatars     | ui-avatars.com API (auto-generated initials) |

---

## 3. Folder Structure

```
CST-E-commerce-Project/
│
├── README.md                  ← This file
├── logic structure.txt        ← Original planning notes
│
├── Assets/
│   └── Assest.text            ← Asset references
│
├── Css/                       ← Page-specific stylesheets
│   ├── Admin.css
│   ├── Cart.css
│   ├── Checkout.css
│   ├── Footer.css
│   ├── Forgetpassword.css
│   ├── Home.css               ← Global/shared styles + CSS variables
│   ├── Login.css
│   ├── NavBar.css
│   ├── orderManagment.css
│   ├── Product.css
│   ├── ProductDetails.css
│   ├── Register.css
│   ├── Seller.css
│   ├── userDashboard.css
│   └── WishList.css
│
├── Data/
│   ├── ecobazar.json          ← Seed product data (7 categories, 50+ products)
│   └── Seller.json            ← Seller seed data
│
├── Js/
│   ├── Cart.js                ← Cart page logic (table, quantity, totals, checkout)
│   ├── Checkout.js            ← Order class, form validation, order completion
│   ├── Footer.js              ← (empty — footer is static HTML)
│   ├── ForgetPassword.js      ← Password reset by verifying user info
│   ├── Home.js                ← Home page: load data, render sections, countdown
│   ├── Login.js               ← Login form, remember-me, role-based redirect
│   ├── NavBar.js              ← Navbar auth, search auto-suggest, cart badge, role hiding
│   ├── orderManagment.js      ← Order management charts & table (seller view)
│   ├── ProductDetails.js      ← Product detail page, reviews, related products
│   ├── Register.js            ← Registration form with full validation
│   ├── Toast.js               ← Global toast notification utility
│   ├── userDashboard.js       ← Customer dashboard: orders, settings, reviews
│   ├── WishList.js            ← Wishlist page: add/remove/display
│   │
│   ├── Classes/               ← Simplified class wrappers used by some pages
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── controllers/           ← Page-level controllers
│   │   ├── productController.js  ← Product listing: filters, sort, pagination
│   │   └── sellerController.js   ← Seller dashboard controller
│   │
│   ├── models/                ← Domain models with private fields (OOP)
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── Customer.js
│   │   ├── idGenerator.js     ← UUID generator using crypto.randomUUID()
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Product.js
│   │   ├── Seller.js
│   │   └── User.js            ← Base class for all user types
│   │
│   └── services/              ← Shared service layer
│       ├── authService.js     ← register() & login() logic
│       ├── Login.js           ← Login form event binding
│       ├── Register.js        ← Register form event binding
│       └── storageService.js  ← Central CRUD for products, orders, cart, wishlist
│
└── Pages/                     ← HTML pages
    ├── AboutUs.html
    ├── Admin.html
    ├── Cart.html
    ├── Checkout.html
    ├── ContactUs.html
    ├── Customer.html
    ├── Footer.html            ← Reusable footer component (loaded via fetch)
    ├── Forgetpassword.html
    ├── Home.html              ← Landing page
    ├── Login.html
    ├── NavBar.html            ← Reusable navbar component (loaded via fetch)
    ├── orderManagment.html
    ├── Product.html           ← Product catalog with filtering
    ├── ProductDetails.html    ← Single product view with tabs
    ├── Register.html
    ├── Seller.html            ← Seller dashboard
    ├── userdashboard.html     ← Customer dashboard
    └── WishList.html
```

---

## 4. Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (required for ES6 module `import` statements)

### Running the Project

**Option A — VS Code Live Server:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `Pages/Home.html` → **Open with Live Server**

**Option B — Python HTTP Server:**
```bash
cd "CST-E-commerce-Project"
python -m http.server 8080
# Open http://localhost:8080/Pages/Home.html
```

**Option C — Node.js:**
```bash
npx serve .
# Open the provided URL + /Pages/Home.html
```

### First-Time Setup

On first load, the app checks if `localStorage` has product data. If empty, it fetches from `Data/ecobazar.json` and seeds `localStorage`. You can register a new account or use any seeded user data.

---

## 5. Architecture & Design Patterns

### Component-Based HTML Loading
The Navbar and Footer are stored as separate HTML files (`NavBar.html`, `Footer.html`) and loaded dynamically via `fetch()` into placeholder `<div>` elements on each page. After loading, initialization functions are called:

```javascript
fetch('NavBar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
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
- `window.initNavBarAuth` — Refresh navbar auth state
- `window.updateCartBadge` — Update cart count/total in navbar
- `window.showBootstrapToast(message, type)` — Show global toast
- `window.isSellerOrAdmin()` — Check if current user is seller/admin
- `window.addToCartData(event, id, name, price, image)` — Add to cart from any page
- `window.addToWishlistData(event, id)` — Toggle wishlist from any page

### Storage as Database
Since there is no backend, `localStorage` acts as the database:
- All CRUD operations go through `storageService.js`
- `sessionStorage` holds the current user session
- Cross-tab sync is handled via `storage` events

---

## 6. Data Models (OOP)

### Class Hierarchy

```
User (base)
├── Customer
├── Seller
└── Admin
```

### User (Base Class) — `Js/models/User.js`
| Field      | Type   | Access   | Description |
|-----------|--------|----------|-------------|
| `#id`     | string | readonly | UUID via `crypto.randomUUID()` |
| `#email`  | string | get/set  | User email address |
| `#name`   | string | get/set  | Full name |
| `#password` | string | get/set | Plain-text password |
| `#role`   | string | get/set  | `"customer"`, `"seller"`, or `"admin"` |
| `#status` | string | get/set  | `"active"` (default) |

### Customer — `Js/models/Customer.js`
Extends `User`. Adds:
| Field           | Type    | Description |
|----------------|---------|-------------|
| `#orderHistory` | Array   | List of past orders |

**`toJSON()`** returns: `{ id, name, email, password, role, status, orderHistory }`

### Seller — `Js/models/Seller.js`
Extends `User`. Adds:
| Field              | Type   | Description |
|-------------------|--------|-------------|
| `#sellerID`       | string | Separate seller UUID |
| `#storeName`      | string | Defaults to `"NO STORE NAME"` |
| `#storeDescription` | string | Store description |
| `#products`       | Array  | Product IDs managed by seller |
| `#salesHistory`   | Array  | Order IDs |
| `#totalRevenue`   | number | Running total |

**`toJSON()`** returns: `{ id, name, email, password, role, status, sellerID, storeName, storeDescription, products, salesHistory, totalRevenue }`

### Admin — `Js/models/Admin.js`
Extends `User` with no additional fields.

**`toJSON()`** returns: `{ id, name, email, password, role, status }`

### Product — `Js/models/Product.js`
| Field               | Type   | Description |
|---------------------|--------|-------------|
| `#productID`        | string | UUID |
| `#productName`      | string | Product name |
| `#procuctCategory`  | string | Category |
| `#productDescription` | string | Description |
| `#productPrice`     | number | Price in EGP |
| `#sellerID`         | string | Seller who listed it |
| `#imageUrl`         | string | Product image URL |
| `#stockQuantity`    | number | Available stock |
| `#createdDate`      | Date   | When created |

### Cart — `Js/models/Cart.js`
| Field        | Type   | Description |
|-------------|--------|-------------|
| `#cartID`   | string | UUID |
| `#customerID` | string | Owner |
| `#cartItems` | Array  | Array of `CartItem` |

### CartItem — `Js/models/CartItem.js`
| Field       | Type   | Description |
|------------|--------|-------------|
| `#productId` | string | Product reference |
| `#quantity`  | number | Quantity |

### Order — `Js/models/Order.js`
| Field         | Type   | Description |
|--------------|--------|-------------|
| `#id`        | string | UUID |
| `#customerId` | string | Customer who placed order |
| `#items`     | Array  | Array of `OrderItem` |
| `#totalPrice` | number | Calculated total |
| `#createdDate` | Date | Creation timestamp |

### OrderItem — `Js/models/OrderItem.js`
| Field             | Type   | Description |
|------------------|--------|-------------|
| `#productId`     | string | Product reference |
| `#quantity`      | number | Quantity ordered |
| `#priceAtPurchase` | number | Price snapshot |

### ID Generator — `Js/models/idGenerator.js`
```javascript
export function generateID() {
    return crypto.randomUUID();
}
```

---

## 7. Storage Layer

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `products` | `Array<Product>` | All products in the platform |
| `orders` | `Array<Order>` | All orders from all users |
| `users` | `Array<User>` | All registered users |
| `cart` | `Array<{userid, items[]}>` | Shopping carts for all users |
| `WishLists` | `Object<userId: Product[]>` | Wishlists keyed by user ID |
| `currentUser` | `Object` | Extended profile data (address, etc.) |
| `RememberedUser` | `Object` | Remember-me login data |
| `reviewPromptShown_<userId>` | `Array<orderId>` | Tracks which orders have shown review prompts |
| `cartUpdated` | `timestamp` | Trigger for cart cross-tab sync |
| `wishUpdated` | `timestamp` | Trigger for wishlist cross-tab sync |

### sessionStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `currentUser` | `Object` | Logged-in customer data |
| `currentSeller` | `Object` | Logged-in seller data |
| `currentAdmin` | `Object` | Logged-in admin data |
| `MyCart` | `Object` | Current user's cart (quick access) |
| `showLoginToast` | `"true"` | Flag to show welcome toast on Home |

### storageService.js — Exported Functions

| Function | Description |
|----------|-------------|
| `getCurrentUser()` | Get current user from session |
| `getCurrentSeller()` | Get current seller from session |
| `getAllProducts()` | Get all products from localStorage |
| `getAllOrders()` | Get all orders from localStorage |
| `getAllUsers()` | Get all users from localStorage |
| `getProductById(id)` | Find product by ID |
| `addProductToStorage(product)` | Add new product |
| `updateProduct(product)` | Update existing product |
| `removeProductFromStorage(id)` | Delete product |
| `saveProducts(products)` | Overwrite products array |
| `saveOrders(orders)` | Overwrite orders array |
| `getSellerProducts(sellerId)` | Get products for a seller |
| `getSellerOrders(sellerId)` | Get order items for a seller |
| `getSellerTotalRevenue(sellerId)` | Calculate seller revenue |
| `loadProductsForSeller(sellerId)` | Render seller products table |
| `loadOrdersForSeller()` | Render seller orders table |
| `getWishlist()` | Get all wishlists |
| `isInWishlist(productId)` | Check if product is wishlisted |
| `addToWishlist(product)` | Add product to wishlist |
| `removeFromWishlist(productId)` | Remove from wishlist |
| `toggleWishlist(product)` | Toggle wishlist state |
| `getCart()` | Get all carts |
| `getUserCart()` | Get current user's cart |
| `getUserCartItems()` | Get current user's cart items |
| `addToCart(product)` | Add product to cart |
| `removeFromCart(productId)` | Remove from cart |
| `updateCartItemQuantity(productId, qty)` | Update quantity |
| `clearCart()` | Empty current user's cart |
| `getCartCount()` | Total item count in cart |

---

## 8. Pages & Features

### 8.1 Home Page (`Home.html` → `Home.js`)
- **Hero Banner** with featured products
- **Category Grid** — Browse by Fruits, Vegetables, Meat & Fish, Dairy, Bakery, Beverages, Snacks
- **Featured Products** — Carousel/grid of top products
- **Daily/Monthly Sales** — Countdown timer to end of month
- **Popular & Top-Rated** sections
- Auto-loads products from `localStorage` or seeds from `ecobazar.json`

### 8.2 Product Catalog (`Product.html` → `productController.js`)
- **Grid/List View** toggle
- **Category Sidebar** with item counts
- **Search** — Real-time text filter
- **Filters** — Price range slider, Rating checkboxes, Organic toggle, In-Stock toggle
- **Sorting** — Price (low/high), Name (A-Z/Z-A), Rating, Discount
- **Pagination** — 9 products per page
- **URL Params** — `?category=Fruits`, `?search=banana`
- **Add to Cart / Wishlist** — Inline buttons per product card

### 8.3 Product Details (`ProductDetails.html` → `ProductDetails.js`)
- **Image Gallery** with main image display
- **Product Info** — Name, price, old price, discount badge, stock status, SKU, brand, category, tags
- **Quantity Selector** — +/- buttons with stock limit
- **Add to Cart** button with visual success feedback
- **Tabs:**
  - **Descriptions** — Product description with feature list
  - **Additional Information** — Weight, type, category, stock, tags
  - **Customer Feedback** — Reviews with star ratings and review form
- **Related Products** — Up to 4 products from same category
- **Social Sharing** links

### 8.4 Login (`Login.html` → `Login.js`)
- Email & password fields
- **Show/Hide Password** toggle
- **Remember Me** checkbox (persists to localStorage)
- Role-based redirect after login:
  - Customer → `Home.html`
  - Seller → `Seller.html`
  - Admin → `Admin.html`
- Toast notification for successful registration redirect

### 8.5 Registration (`Register.html` → `Register.js`)
- Fields: First Name, Last Name, Email, Password, Confirm Password, Phone, Street, City, Country, Role
- **Real-Time Validation**:
  - Name: letters only
  - Email: valid email format, uniqueness check
  - Password: min 7 chars, 1 uppercase, 1 lowercase, 1 digit
  - Phone: Egyptian format `01[0125]XXXXXXXX`
- Creates `Customer` or `Seller` instance depending on role selection
- Redirects to Login page with success toast

### 8.6 Forget Password (`Forgetpassword.html` → `ForgetPassword.js`)
- User provides: First Name, Last Name, Email, Phone
- Verifies all 4 fields match stored user data
- On success: resets password to the user's email value
- Shows modal with result (success/failure)

### 8.7 Shopping Cart (`Cart.html` → `Cart.js`)
- **Cart Table** — Product image, name, price, quantity (+/- buttons), subtotal, delete button
- **Cart Summary** — Subtotal, shipping (free), total
- **Proceed to Checkout** — Requires login (shows login modal if not authenticated)
- **Return to Shop** button
- **Toast Notifications** — Out of stock, minimum quantity, empty cart
- Cart syncs between `localStorage` and `sessionStorage`

### 8.8 Checkout (`Checkout.html` → `Checkout.js`)
- **Order Summary** — List of products with quantities and subtotals
- **Billing Form** — First Name, Last Name, City, Country, Email, Phone, Street Address
- **Form Validation** — All fields required with regex validation
- **Auto-Fill** — Populates form from current user profile
- **Login Guard** — Shows modal if not logged in
- **Confirm Order** — Validates stock, decrements inventory, marks order as `Processing`, clears cart
- **Return to Cart** button

### 8.9 Wishlist (`WishList.html` → `WishList.js`)
- **Product List** — Image, name, price, stock status
- **Add to Cart** button per item
- **Remove** button per item
- **Empty State** — Message when wishlist is empty
- **Login Guard** — Shows modal for guests
- Cross-tab sync via `storage` event

### 8.10 Customer Dashboard (`userdashboard.html` → `userDashboard.js`)
- **Sidebar Navigation:** Dashboard, Order History, Wishlist, Shopping Cart, Settings, Logout
- **Dashboard Section:**
  - Profile card with avatar, name, role
  - Billing address card
- **Order History Section:**
  - Table with Order ID, Date, Total, Status, Actions
  - **View Details** — Modal with order items, quantities, per-item status
  - **Cancel Order** — Confirmation modal, restores product stock
  - **Review Order** — Available for completed orders (see Reviews section)
- **Settings Section:**
  - Account Settings form (name, email, phone)
  - Address form (street, city, country)
  - Change Password form (current, new, confirm)
- **Auto-detect completed orders** — Shows review modal prompt

### 8.11 Seller Dashboard (`Seller.html` → `sellerController.js` + `storageService.js`)
- **Product Management** — Add, edit, delete products
- **Orders Table** — View all orders for seller's products per-product
- **Order Actions** — Confirm (mark completed), Cancel (restore stock)
- **Revenue Tracking** — Total revenue from completed orders
- **Delete Confirmation Modal** — Prevents accidental deletions
- **Cancel Order Item Modal** — Confirm before cancelling

### 8.12 Order Management (`orderManagment.html` → `orderManagment.js`)
- **Line Chart** (Chart.js) — Order totals, product counts, completed products
- **Orders Table** — All orders with pagination (10 per page)
- **Order Status Badges** — Pending, Processing, Completed, Cancelled, User Cancelled
- **Pagination Controls** — Prev/Next with page info

### 8.13 Admin Dashboard (`Admin.html`)
- Admin-level user and order management interface

### 8.14 Static Pages
- **About Us** (`AboutUs.html`) — Company information
- **Contact Us** (`ContactUs.html`) — Contact form/details

---

## 9. JavaScript Modules Reference

### Page Scripts (loaded directly by HTML pages)

| Script | Page | Responsibility |
|--------|------|---------------|
| `Home.js` | Home.html | Load data, render categories/products, countdown timer |
| `Login.js` | Login.html | Login form handling, remember-me, redirects |
| `Register.js` | Register.html | Registration form validation & submission |
| `ForgetPassword.js` | Forgetpassword.html | Password reset verification |
| `Cart.js` | Cart.html | Cart table rendering, quantity management, checkout |
| `Checkout.js` | Checkout.html | Order class, summary, form validation, order completion |
| `ProductDetails.js` | ProductDetails.html | Product details rendering, reviews, related products |
| `WishList.js` | WishList.html | Wishlist display & management |
| `userDashboard.js` | userdashboard.html | Customer dashboard: orders, settings, reviews |
| `orderManagment.js` | orderManagment.html | Charts & paginated order table |
| `NavBar.js` | All pages (module) | Navbar auth, search, cart badge, role-based UI |
| `Toast.js` | All pages | Global toast notification system |
| `Footer.js` | — | Empty (footer is static) |

### Service Layer (`Js/services/`)

| Module | Exports | Purpose |
|--------|---------|---------|
| `storageService.js` | 30+ functions | Central CRUD layer for all localStorage data |
| `authService.js` | `register()`, `login()` | User authentication logic |
| `Login.js` | — | Login form event binding |
| `Register.js` | — | Register form event binding |

### Controllers (`Js/controllers/`)

| Module | Purpose |
|--------|---------|
| `productController.js` | Product catalog page: filtering, sorting, pagination, rendering |
| `sellerController.js` | Seller dashboard: product CRUD, order management, revenue |

### Models (`Js/models/`)

| Module | Class | Description |
|--------|-------|-------------|
| `User.js` | `User` | Base user class with private fields |
| `Customer.js` | `Customer` | Extends User, adds order history |
| `Seller.js` | `Seller` | Extends User, adds store info & revenue |
| `Admin.js` | `Admin` | Extends User |
| `Product.js` | `Product` | Product with private fields |
| `Cart.js` | `Cart` | Cart container |
| `CartItem.js` | `CartItem` | Single cart item |
| `Order.js` | `Order` | Order container |
| `OrderItem.js` | `OrderItem` | Single order item |
| `idGenerator.js` | `generateID()` | UUID generation |

---

## 10. Authentication & Authorization

### Registration Flow
```
Register.html → Register.js
   ↓ validate all fields
   ↓ check email uniqueness against localStorage["users"]
   ↓ create Customer or Seller instance
   ↓ save to localStorage["users"] via .toJSON()
   ↓ redirect to Login.html?registered=true
```

### Login Flow
```
Login.html → Login.js
   ↓ find user by email + password in localStorage["users"]
   ↓ store in sessionStorage:
      • currentUser (customer)
      • currentSeller (seller)
      • currentAdmin (admin)
   ↓ set showLoginToast flag
   ↓ redirect by role:
      • customer → Home.html
      • seller  → Seller.html
      • admin   → Admin.html
```

### Session Management
- **Login:** User object stored in `sessionStorage` (cleared on tab close)
- **Remember Me:** Stores credentials in `localStorage["RememberedUser"]`
- **Logout:** Clears all `sessionStorage` keys, reloads page
- **Auth Guards:** Pages like `userdashboard.html` redirect to `Login.html` if no session

### Role-Based UI
- `window.isSellerOrAdmin()` — Returns `true` if seller or admin is logged in
- Navbar hides cart/wishlist buttons for sellers and admins
- Product cards hide "Add to Cart" and "Wishlist" buttons for sellers/admins
- Footer hides cart/wishlist links for sellers/admins

---

## 11. Cart & Checkout Flow

### Adding to Cart
```
User clicks "Add to Cart" (Product page / Catalog / Home)
   ↓ storageService.addToCart(product)
   ↓ finds user's cart in localStorage["cart"] array
   ↓ if product exists → increment quantity (respects stock limit)
   ↓ if new → push product with quantity
   ↓ sync to localStorage["cart"] + sessionStorage["MyCart"]
   ↓ fire cartUpdated event → navbar badge updates
```

### Cart Page Behavior
- Renders cart items from `sessionStorage["MyCart"]`
- Quantity buttons sync to both `localStorage` and `sessionStorage`
- Delete button removes item and reloads
- Total is calculated from all subtotals
- **"Proceed to Checkout"** checks login:
  - If not logged in → shows login required modal
  - If cart empty → shows empty cart toast
  - If OK → creates/updates pending Order in `localStorage["orders"]` → redirects to `Checkout.html`

### Checkout Completion
```
User fills billing form → clicks "Confirm Order"
   ↓ form validated (name, email, phone, city, street)
   ↓ Order.compelteOrder() called:
      ↓ find pending order for user
      ↓ verify stock for each product
      ↓ if any out of stock → show error toast, abort
      ↓ decrement stock in localStorage["products"]
      ↓ set order status to "Processing"
      ↓ clear cart in session + localStorage
      ↓ show success toast
      ↓ redirect to Home.html after 1.5s
```

---

## 12. Order Lifecycle

```
┌─────────┐     ┌────────────┐     ┌───────────┐     ┌───────────┐
│ Pending  │ ──► │ Processing │ ──► │ Completed │     │ Cancelled │
└─────────┘     └────────────┘     └───────────┘     └───────────┘
    │                  │                                    ▲
    │                  │         (seller cancels)           │
    │                  └────────────────────────────────────┘
    │                                                       ▲
    │              (user cancels)                           │
    └──────────────────────────────────────────────────────┘
```

### Status Definitions
| Status | Set By | Meaning |
|--------|--------|---------|
| `pending` | System | Order created, awaiting checkout completion |
| `Processing` | System | Checkout completed, awaiting seller confirmation |
| `completed` | Seller | Seller confirmed delivery |
| `cancelled` | Seller | Seller cancelled the order |
| `userCancelled` | Customer | Customer cancelled before completion |

### Product-Level Status
Each product within an order can have its own status, allowing partial fulfillment. The overall order status is recalculated:
- All products completed → `completed`
- All products cancelled → `cancelled`
- Mixed → `processing`

### Stock Management
- **On Order Completion:** Stock decremented for each product
- **On Cancellation (user or seller):** Stock restored for cancelled items

---

## 13. Product Reviews System

### Data Structure
Reviews are stored inside each product object in `localStorage["products"]`:
```json
{
    "product_id": 1,
    "name": "Fresh Organic Bananas",
    "reviews": [
        {
            "user_id": "USR-123",
            "rating": 5,
            "comment": "Always fresh and perfectly ripe!",
            "date": "2026-03-01T12:00:00.000Z"
        }
    ],
    "rating": 5
}
```

### Review Features
- **Product Details Page** — Displays all reviews with reviewer name, avatar, stars, comment, and date
- **Review Form** — Logged-in customers can submit star rating (1-5) and comment
- **Duplicate Prevention** — Users can only review a product once
- **Auto-Recalculation** — Average rating updates when new review is submitted
- **Guest Prompt** — Non-logged-in users see "Please login to write a review"
- **Role Restriction** — Sellers/admins cannot write reviews

### Review from Dashboard
Completed orders show a **"Review" button** in the user dashboard:
- Opens modal with all order products
- Each product has interactive star selector + comment textarea
- Products already reviewed show "Already Reviewed" badge
- Reviews saved to product data in localStorage
- Auto-prompt: on dashboard load, if any completed order has unreviewed products, the review modal opens automatically

---

## 14. Wishlist System

### Storage
Wishlists are stored as an object keyed by user ID:
```json
{
    "USR-123": [ { product_id: 1, name: "...", ... }, ... ],
    "USR-456": [ ... ]
}
```

### Features
- **Add/Remove Toggle** — Click heart icon on product card to toggle
- **Wishlist Page** — Full list with product details, stock status, add-to-cart
- **Cross-Page Sync** — Heart icon updates across all pages via `wishlistChanged` custom event
- **Cross-Tab Sync** — `storage` event listener triggers page reload
- **Login Required** — Guest users see a login modal
- **Role Hidden** — Sellers/admins don't see wishlist UI

---

## 15. Seller Dashboard

### Product Management
- **Add Product Form** — Name, category, description, price, stock, image URL
- **Edit Product** — Click edit button → form pre-fills with product data
- **Delete Product** — Confirmation modal → removes from localStorage
- **Products Table** — Image, name, price, stock badge, edit/delete actions

### Order Management
- **Orders Table** — Date, buyer email, product name, quantity, status, actions
- **Confirm Order** — Sets product status to `completed`, recalculates order status
- **Cancel Order** — Confirmation modal, sets product status to `cancelled`, restores stock
- **Status Badges** — Color-coded: pending (warning), processing (info), completed (success), cancelled (danger)

---

## 16. Admin Dashboard

The admin dashboard (`Admin.html`) provides platform-level management capabilities for overseeing all users, orders, and system operations.

---

## 17. Customer Dashboard

### Sections
| Section | Features |
|---------|----------|
| **Dashboard** | Profile card, billing address, quick links |
| **Order History** | All orders table, view details, cancel order, review completed orders |
| **Wishlist** | Redirects to dedicated wishlist page |
| **Shopping Cart** | Link to cart page |
| **Settings** | Account info, address, password change |

### Order Detail Modal
Clicking "View Details" shows a comprehensive modal with:
- Order ID, date, overall status
- Each product with image, name, quantity, price, per-product status
- Order total

### Order Cancellation
- Confirmation modal with warning text
- Sets status to `userCancelled`
- Restores product stock
- Updates order list immediately

---

## 18. Order Management (Seller)

### Analytics Chart (Chart.js)
- **Line 1** — Order Total (completed products only) in EGP
- **Line 2** — Total products per order
- **Line 3** — Completed products per order

### Orders Table
- Paginated (10 per page)
- Prev/Next navigation
- All orders displayed regardless of status

---

## 19. Search & Filtering

### Navbar Search (All Pages)
- **Auto-Suggest Dropdown** — Shows top 5 matching products by name or category
- Each suggestion shows: image, name, price
- Enter key or Search button → redirects to `Product.html?search=query`
- **Mobile Search** — Collapsible search row for mobile devices

### Product Catalog Filters
| Filter | Type | Description |
|--------|------|-------------|
| Category | Sidebar clicks | 7 categories + "All" |
| Search | Text input | Filters by name and description |
| Price Range | Slider | Max price filter |
| Rating | Radio buttons | Minimum star rating |
| Organic | Checkbox | Show only organic products |
| In Stock | Checkbox | Show only in-stock items |
| Sort | Dropdown | Price, name, rating, discount |

### URL Parameters
- `Product.html?category=Fruits` — Pre-select category
- `Product.html?search=banana` — Pre-fill search
- `ProductDetails.html?id=1` — View specific product

---

## 20. Responsive Design

The application uses **Bootstrap 5's grid system** with custom CSS for full responsiveness:

| Breakpoint | Layout |
|-----------|--------|
| **Mobile** (< 768px) | Single column, hamburger menu, mobile search toggle, stacked cards |
| **Tablet** (768px - 992px) | Two-column grids, collapsible sidebar |
| **Desktop** (> 992px) | Full multi-column layout, mega menu, side-by-side panels |

### Key Responsive Features
- Navbar collapses to hamburger menu on mobile
- Search bar moves to a toggleable row on mobile
- Product grid adapts: 1 col (mobile) → 2 cols (tablet) → 3–4 cols (desktop)
- Cart/checkout forms stack vertically on small screens
- Dashboard sidebar becomes full-width on mobile

---

## 21. JSON Seed Data

### `Data/ecobazar.json`
Contains initial product data organized by category:

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

### Product Object Shape
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
    "dailySale": true,
    "monthSale": false,
    "reviews": [
        { "user_id": 1, "rating": 5, "comment": "Always fresh!" },
        { "user_id": 2, "rating": 4, "comment": "Great quality." }
    ]
}
```

---

## 22. Known Limitations

| Area | Limitation |
|------|-----------|
| **Security** | Passwords stored in plain text in localStorage (client-side only) |
| **Storage** | localStorage has a ~5-10MB limit per origin |
| **Multi-device** | Data is local to the browser — no cloud sync |
| **Images** | Products use external URLs (Unsplash, etc.) — require internet |
| **Payments** | No real payment integration — order completes on form submit |
| **Email** | No email notifications for orders or password reset |
| **Concurrency** | No locking mechanism — simultaneous tabs may cause race conditions |
| **SEO** | Single-page dynamic content is not crawlable |

---

## 23. Contributors

This project was developed as part of the **ITI (Information Technology Institute) 4-Month Program — Client-Side Technologies (CST)** track.

---

> **License:** This project is for educational purposes as part of the ITI CST program.
