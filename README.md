# eCommerce App Documentation

## Overview
This project is a full-stack eCommerce application built using **Node.js**, **Express**, and **MongoDB**. It includes features like user authentication, product management, shopping cart, order processing, coupon validation, and payment integration. The app is designed to be scalable, secure, and user-friendly.

---

## Features
### 1. User & Admin Roles
- **Authentication**: JWT (JSON Web Tokens) is used for secure user authentication.
- **Authorization**: Different roles (User & Admin) are implemented to restrict access to specific endpoints.
- **Email Verification**: Users receive a verification email upon registration to confirm their account.

### 2. Product Management
- **Categories & Subcategories**: Products are organized into categories and subcategories.
- **Brands**: Brands are associated with products for better filtering.
- **Validation Schemas**: All product-related data is validated using schemas to ensure data integrity.

### 3. Shopping Cart & Orders
- **Cart System**: Users can add, update, and remove products from their cart.
- **Order Management**: Users can place orders, and admins can manage orders.
- **Rollback Mechanism**: In case of errors, document and image uploads are rolled back to maintain data consistency.

### 4. Coupon System
- **Cron Jobs**: A cron job automatically validates and expires coupons based on their expiration dates.
- **Coupon Validation**: Coupons are validated during checkout to ensure they are active and applicable.

### 5. Payment Integration
- **Tap Payment Gateway**: Secure payment processing is integrated using Tap Payment.

### 6. API Features
- **Sorting, Filtering, and Searching**: Users can sort, filter, and search for products.
- **Pagination**: Large datasets are paginated for better performance and user experience.

### 7. Email Service
- **Nodemailer**: Used to send verification emails and other notifications.

---

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Gateway**: Tap Payment
- **Cron Jobs**: Node-cron
- **Email Service**: Nodemailer
- **Validation**: Joi (for schema validation)

---

## API Endpoints
### User Routes

| Method  | Endpoint                                      | Description |
|---------|----------------------------------------------|-------------|
| **POST** | `/api/v1/auth/signup`                      | User registration with email verification. |
| **POST** | `/api/v1/auth/login`                       | User login. |
| **GET**  | `/api/v1/auth/verify-email`               | Verify email address. |
| **POST** | `/api/v1/auth/forgotPassword`              | Request a password reset link. |
| **POST** | `/api/v1/auth/resetPassword`               | Reset password using a token. |
| **PUT** | `/api/v1/user/updateLoggedInUser`         | Update logged-in user details. |
| **PUT** | `/api/v1/user/updateLoggedInUserPassword` | Update logged-in user's password. |
| **DELETE** | `/api/v1/user/deleteLoggedInUser`        | Delete logged-in user's account. |
| **GET**  | `/api/v1/user/getUserById/:id`            | Get user details by ID (Admin only). |

## Category Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/category/addCategory`                            | Add a new category (Admin only). |
| **PUT**   | `/api/v1/category/updateCategory/:id`                     | Update an existing category (Admin only). |
| **DELETE** | `/api/v1/category/deleteCategory/:id`                    | Delete a category (Admin only). |
| **GET**   | `/api/v1/category/getAllCategories?page=1&size=10&sortBy=createdAt:asc&name=Category` | Retrieve all categories with optional pagination (`page` & `size`), sorting (`sortBy`), and filtering by name (`name`). |
| **GET**   | `/api/v1/category/getSingleCategory/:id`                  | Get a single category by ID. |

## Sub Category Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/subCategory/addSubCategory`                      | Add a new sub-category (Admin only). |
| **PUT**   | `/api/v1/subCategory/updateSubCategory/:id`               | Update an existing sub-category (Admin only). |
| **DELETE** | `/api/v1/subCategory/deleteSubCategory/:id`              | Delete a sub-category (Admin only). |
| **GET**   | `/api/v1/subCategory/getAllSubCategories?page=1&size=10&sortBy=createdAt:asc&name=SubCategory` | Retrieve all sub-categories with optional pagination (`page` & `size`), sorting (`sortBy`), and filtering by name (`name`). |
| **GET**   | `/api/v1/subCategory/getSingleSubCategory/:id`            | Get a single sub-category by ID. |

## Brand Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/brand/addBrand?subCategoryId=id`                 | Add a new brand to a specific sub-category (Admin only). |
| **PUT**   | `/api/v1/brand/updateBrand/:id`                            | Update an existing brand (Admin only). |
| **DELETE** | `/api/v1/brand/deleteBrand/:id`                           | Delete a brand (Admin only). |
| **GET**   | `/api/v1/brand/getAllBrands?page=1&size=10&sortBy=createdAt:asc&name=brand` | Retrieve all brands with optional pagination (`page` & `size`), sorting (`sortBy`), and filtering by name (`name`). |
| **GET**   | `/api/v1/brand/getBrandById/:id`                           | Get a single brand by ID. |

## Product Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/product/addProduct?brandId=id`                    | Add a new product to a specific brand (Admin only). |
| **PUT**   | `/api/v1/product/updateProduct/:id`                         | Update an existing product (Admin only). |
| **DELETE** | `/api/v1/product/deleteProduct/:id`                        | Delete a product (Admin only). |
| **GET**   | `/api/v1/product/getAllProducts?page=1&size=10&sortBy=createdAt:asc&title=iphone2` | Retrieve all products with optional pagination (`page` & `size`), sorting (`sortBy`), and filtering by title (`title`). |
| **GET**   | `/api/v1/product/getProductById/:id`                       | Get a single product by ID. |

## Cart Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/cart/add-to-cart`                                | Add a product to the cart (User only). |
| **POST**  | `/api/v1/cart/clear-cart`                                  | Clear all items from the cart (User only). |
| **DELETE** | `/api/v1/cart/remove-from-cart/:id`                       | Remove a product from the cart (User only). |
| **GET**   | `/api/v1/cart/get-cart`                                    | Get the current user's cart. |

## Coupon Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/coupon/addCoupon`                                | Add a new coupon (Admin only). |
| **PUT**   | `/api/v1/coupon/updateCoupon/:id`                         | Update an existing coupon (Admin only). |
| **DELETE** | `/api/v1/coupon/deleteCoupon/:id`                        | Delete a coupon (Admin only). |
| **GET**   | `/api/v1/coupon/getCoupon/:id`                            | Get a single coupon by ID. |
| **GET**   | `/api/v1/coupon/getCoupons`                               | Retrieve all coupons. |
| **GET**   | `/api/v1/coupon/validateCoupon`                            | Validate a coupon's validity (e.g., expiration, usage limits). |

## Order Routes

| Method   | Endpoint                                                   | Description |
|----------|------------------------------------------------------------|-------------|
| **POST**  | `/api/v1/order/create-order-for-product`                   | Create a new order for a product (User only). |
| **POST**  | `/api/v1/order/convert-cart-to-order`                      | Convert the current cart into an order (User only). |
| **PUT**   | `/api/v1/order/deliverOrder/:id`                           | Mark an order as delivered (Admin only). |
| **GET**   | `/api/v1/order/getMyOrders`                                | Get all orders placed by the current user. |
| **POST**  | `/api/v1/order/pay-with-tap/:id`                           | Process the payment for an order using Tap (User only). |

---

## How to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmed-Hussieny/Ecommerce_Back-End
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
Create a .env file and add the following variables:
   ```bash
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   HASH_SALT = <your-jwt-salt>
   JWT_EXPIRATION = <your-expiration-time>
   TOKEN_PREFIX = <your-token-prefix>
   TAP_URL=<your-tap-url>
   TAP_SECRET_KEY=<your-tap-payment-api-key>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-password>
   CLOUDINARY_CLOUD_NAME = <your-cloudinary-api-name>
   CLOUDINARY_API_KEY = <your-cloudinary-api-key>
   CLOUDINARY_API_SECRET = <your-cloudinary-api-secret>
   MAIN_CLOUDINARY_FOLDER = <your-cloudinary-main-folder>
   ```
4. Start the server:
   ```bash
   npm start
   ```
   
## Postman Collection
You can test the API endpoints using the Postman collection linked below:
🔗 https://shorturl.at/2Ii7Z

## Future Improvements
- Add a frontend interface using Next.
- Implement a review and rating system for products.
- Integrate more payment gateways like Stripe or PayPal.
- Add a wishlist feature for users.

## Conclusion 
This eCommerce app is a robust and scalable solution for online shopping. It demonstrates my ability to build complex backend systems with Node.js, Express, and MongoDB. I’m excited to continue improving this project and exploring new features!
