-- =========================================================
--  SILKROAD-API DATABASE SCHEMA (PostgreSQL)
--  Author: Junior & GPT-5
--  Version: 2.0
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================
-- DOMAIN TABLES (ENUM MIRRORS)
-- ================================

CREATE TABLE dom_customer_status (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_customer_status (code, description) VALUES
(1, 'Active customer'),
(2, 'Inactive customer'),
(3, 'Banned customer');

-- -------------------------------

CREATE TABLE dom_product_status (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_product_status (code, description) VALUES
(1, 'Active and available for sale'),
(2, 'Out of stock'),
(3, 'Deleted from catalog'),
(4, 'Pending review before publication'),
(5, 'Archived product');

-- -------------------------------

CREATE TABLE dom_currency_type (
    code INT PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

INSERT INTO dom_currency_type (code, description) VALUES
(1, 'Ethereum'),
(2, 'Bitcoin'),
(3, 'Tether USD'),
(4, 'Brazilian Real');

-- -------------------------------

CREATE TABLE dom_delivery_method (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_delivery_method (code, description) VALUES
(1, 'Digital link delivery'),
(2, 'Shipping by mail or courier'),
(3, 'In-person pickup');

-- -------------------------------

CREATE TABLE dom_payment_status (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_payment_status (code, description) VALUES
(1, 'Awaiting payment confirmation'),
(2, 'Payment completed'),
(3, 'Payment failed'),
(4, 'Payment refunded');

-- -------------------------------

CREATE TABLE dom_shipping_status (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_shipping_status (code, description) VALUES
(1, 'Digital or non-shippable order'),
(2, 'Awaiting shipment'),
(3, 'In transit'),
(4, 'Delivered to recipient');

-- -------------------------------

CREATE TABLE dom_order_status (
    code INT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

INSERT INTO dom_order_status (code, description) VALUES
(1, 'Order created and pending processing'),
(2, 'Order under processing'),
(3, 'Order completed successfully'),
(4, 'Order cancelled by buyer or seller');

-- =========================================================
-- MAIN TABLES
-- =========================================================

-- ================================
-- CUSTOMER
-- ================================

CREATE TABLE tbl_customer (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    wallet_address VARCHAR(255),
    phone_number VARCHAR(30),
    avatar_url TEXT,
    is_seller BOOLEAN DEFAULT FALSE,
    status INT NOT NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_customer_status FOREIGN KEY (status)
        REFERENCES dom_customer_status(code)
);

-- ================================
-- PRODUCT
-- ================================

CREATE TABLE tbl_product (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    seller_id UUID NOT NULL,
    price NUMERIC(18,8) NOT NULL,
    currency INT NOT NULL,
    tags TEXT[],
    category VARCHAR(100) NOT NULL,
    status INT NOT NULL,
    images TEXT[],
    quantity INT DEFAULT 1,
    is_digital BOOLEAN DEFAULT FALSE,
    delivery_method INT,
    estimated_delivery INT,
    view_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    CONSTRAINT fk_product_seller FOREIGN KEY (seller_id)
        REFERENCES tbl_customer(customer_id),
    CONSTRAINT fk_product_currency FOREIGN KEY (currency)
        REFERENCES dom_currency_type(code),
    CONSTRAINT fk_product_status FOREIGN KEY (status)
        REFERENCES dom_product_status(code),
    CONSTRAINT fk_product_delivery_method FOREIGN KEY (delivery_method)
        REFERENCES dom_delivery_method(code)
);

-- ================================
-- ORDER
-- ================================

CREATE TABLE tbl_order (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    quantity INT DEFAULT 1,
    price NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) GENERATED ALWAYS AS (price * quantity) STORED,
    payment_method VARCHAR(50),
    payment_status INT DEFAULT 1,
    shipping_address TEXT,
    shipping_status INT DEFAULT 1,
    status INT DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_order_product FOREIGN KEY (product_id)
        REFERENCES tbl_product(product_id),
    CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id)
        REFERENCES tbl_customer(customer_id),
    CONSTRAINT fk_order_seller FOREIGN KEY (seller_id)
        REFERENCES tbl_customer(customer_id),
    CONSTRAINT fk_order_payment_status FOREIGN KEY (payment_status)
        REFERENCES dom_payment_status(code),
    CONSTRAINT fk_order_shipping_status FOREIGN KEY (shipping_status)
        REFERENCES dom_shipping_status(code),
    CONSTRAINT fk_order_status FOREIGN KEY (status)
        REFERENCES dom_order_status(code)
);

-- =========================================================
-- TRIGGER: update "updated_at" automatically
-- =========================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_customer
BEFORE UPDATE ON tbl_customer
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_product
BEFORE UPDATE ON tbl_product
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_order
BEFORE UPDATE ON tbl_order
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
