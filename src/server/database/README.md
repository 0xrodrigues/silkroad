# Database Schema Documentation

## Overview
This directory contains the database schema and configuration for the Silkroad API.

## Schema Version 2.0

### Database Setup

To initialize the database with the new schema:

```bash
psql -U silkroad-api-user -d silk-road-api -f src/server/database/schema.sql
```

Or using environment variables:

```bash
psql -U $DB_USER -d $DB_NAME -f src/server/database/schema.sql
```

## Schema Structure

### Domain Tables (Enums)

Domain tables act as reference tables for enumerated values:

- **dom_customer_status**: Customer account statuses (Active, Inactive, Banned)
- **dom_product_status**: Product availability statuses (Active, Sold Out, Deleted, Pending Review, Archived)
- **dom_currency_type**: Supported currencies (ETH, BTC, USDT, BRL)
- **dom_delivery_method**: Delivery methods (Digital Link, Physical Shipping, Pickup)
- **dom_payment_status**: Payment statuses (Pending, Completed, Failed, Refunded)
- **dom_shipping_status**: Shipping statuses (Digital, Awaiting Shipment, In Transit, Delivered)
- **dom_order_status**: Order statuses (Created, Processing, Completed, Cancelled)

### Main Tables

#### tbl_customer
Stores customer/user information.

**Key Fields:**
- `customer_id` (UUID, PK): Unique customer identifier
- `fullname`: Customer's full name
- `username`: Optional username
- `email`: Unique email address
- `wallet_address`: Cryptocurrency wallet address
- `is_seller`: Boolean flag indicating if user can sell
- `status`: Reference to dom_customer_status

#### tbl_product
Stores product listings.

**Key Fields:**
- `product_id` (UUID, PK): Unique product identifier
- `seller_id` (UUID, FK): Reference to tbl_customer
- `title`: Product title
- `description`: Product description
- `price`: Product price (NUMERIC 18,8)
- `currency`: Reference to dom_currency_type
- `status`: Reference to dom_product_status
- `delivery_method`: Reference to dom_delivery_method
- `tags`: JSONB array of tags
- `images`: JSONB array of image URLs
- `is_digital`: Boolean flag for digital products
- `view_count`: Number of views
- `sold_count`: Number of items sold

#### tbl_order
Stores order transactions.

**Key Fields:**
- `order_id` (UUID, PK): Unique order identifier
- `product_id` (UUID, FK): Reference to tbl_product
- `buyer_id` (UUID, FK): Reference to tbl_customer (buyer)
- `seller_id` (UUID, FK): Reference to tbl_customer (seller)
- `quantity`: Number of items ordered
- `price`: Price per item
- `total_amount`: Computed column (price × quantity)
- `payment_status`: Reference to dom_payment_status
- `shipping_status`: Reference to dom_shipping_status
- `status`: Reference to dom_order_status
- `shipping_address`: Delivery address (if applicable)
- `notes`: Additional order notes

## Status Code Mappings

### Customer Status
- `1` → ACTIVE
- `2` → INACTIVE
- `3` → BANNED

### Product Status
- `1` → ACTIVE
- `2` → SOLD_OUT
- `3` → DELETED
- `4` → PENDING_REVIEW
- `5` → ARCHIVED

### Currency Type
- `1` → ETH (Ethereum)
- `2` → BTC (Bitcoin)
- `3` → USDT (Tether USD)
- `4` → BRL (Brazilian Real)

### Delivery Method
- `1` → DIGITAL_LINK
- `2` → PHYSICAL_SHIPPING
- `3` → PICKUP

### Payment Status
- `1` → PENDING
- `2` → COMPLETED
- `3` → FAILED
- `4` → REFUNDED

### Shipping Status
- `1` → DIGITAL (non-shippable)
- `2` → AWAITING_SHIPMENT
- `3` → IN_TRANSIT
- `4` → DELIVERED

### Order Status
- `1` → CREATED
- `2` → PROCESSING
- `3` → COMPLETED
- `4` → CANCELLED

## Automatic Triggers

The schema includes triggers to automatically update the `updated_at` timestamp on all main tables when records are modified:

- `trg_update_customer` on tbl_customer
- `trg_update_product` on tbl_product
- `trg_update_order` on tbl_order

## Migration from Previous Schema

### Key Changes in v2.0:

1. **Table Naming**: All main tables now use `tbl_` prefix
   - `orders` → `tbl_order`
   - `products` → `tbl_product`
   - Added `tbl_customer`

2. **Status Fields**: Changed from VARCHAR enums to INT with foreign key references to domain tables

3. **Product ID**: Removed `external_id`, now using `product_id` as the only UUID identifier

4. **Order Fields**: 
   - Added `shipping_status` field
   - Added computed `total_amount` column
   - Changed status fields to INT

5. **Domain Tables**: Added reference tables for all enum values

## Notes

- All UUID fields use PostgreSQL's `gen_random_uuid()` function (requires pgcrypto extension)
- JSONB is used for flexible array storage (tags, images)
- Timestamps are automatically managed by triggers
- Foreign key constraints ensure referential integrity
