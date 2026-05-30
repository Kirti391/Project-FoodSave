-- FOODSAVE DATABASE SCHEMA
CREATE DATABASE IF NOT EXISTS foodsave_db;

USE foodsave_db;
-- USERS TABLE

CREATE TABLE IF NOT EXISTS users1(

    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'donor',
        'ngo',
        'farm',
        'admin'
    ) DEFAULT 'donor',

    phone VARCHAR(20),

    address TEXT,

    city VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- FOOD SUBMISSIONS TABLE

CREATE TABLE IF NOT EXISTS food_submissions (

    id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT,

    food_type VARCHAR(255) NOT NULL,

    quantity VARCHAR(100) NOT NULL,

    hours_old INT NOT NULL,

    food_condition VARCHAR(100),

    location TEXT,

    food_category VARCHAR(100),

    storage_condition VARCHAR(255),

    pickup_availability VARCHAR(255),

    classification VARCHAR(50),

    action_required VARCHAR(255),

    status ENUM(
        'pending',
        'accepted',
        'completed',
        'rejected'
    ) DEFAULT 'pending',

    ngo_assigned VARCHAR(255),

    donor_name VARCHAR(255),

    donor_phone VARCHAR(20),

    latitude DECIMAL(10,8),

    longitude DECIMAL(11,8),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL

);

-- NOTIFICATIONS TABLE

CREATE TABLE IF NOT EXISTS notifications (

    id INT PRIMARY KEY AUTO_INCREMENT,

    submission_id INT,

    recipient_email VARCHAR(255),

    recipient_type VARCHAR(100),

    message TEXT,

    sent_status BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id)
    REFERENCES food_submissions(id)
    ON DELETE CASCADE

);

-- =====================================================
-- NGO TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ngos (

    id INT PRIMARY KEY AUTO_INCREMENT,

    ngo_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE,

    phone VARCHAR(20),

    address TEXT,

    city VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(20),

    food_capacity VARCHAR(100),

    availability_status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- FARM TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS farms (

    id INT PRIMARY KEY AUTO_INCREMENT,

    farm_name VARCHAR(255),

    owner_name VARCHAR(255),

    email VARCHAR(255),

    phone VARCHAR(20),

    address TEXT,

    city VARCHAR(100),

    accepted_food_types TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- PICKUP REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS pickup_requests (

    id INT PRIMARY KEY AUTO_INCREMENT,

    submission_id INT,

    ngo_id INT,

    pickup_status ENUM(
        'pending',
        'assigned',
        'picked',
        'delivered'
    ) DEFAULT 'pending',

    pickup_time DATETIME,

    volunteer_name VARCHAR(255),

    volunteer_phone VARCHAR(20),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id)
    REFERENCES food_submissions(id)
    ON DELETE CASCADE,

    FOREIGN KEY (ngo_id)
    REFERENCES ngos(id)
    ON DELETE CASCADE

);

-- =====================================================
-- VOLUNTEERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS volunteers (

    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255),

    email VARCHAR(255),

    phone VARCHAR(20),

    city VARCHAR(100),

    availability_status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- ADMIN TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (

    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255),

    email VARCHAR(255) UNIQUE,

    password VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================================
-- SAMPLE ADMIN
-- PASSWORD SHOULD BE HASHED IN REAL PROJECT
-- =====================================================

INSERT INTO admins (

    name,
    email,
    password

)

VALUES (

    'Super Admin',
    'admin@foodsave.com',
    'admin123'

);

-- =====================================================
-- SHOW ALL TABLES
-- =====================================================

SHOW TABLES;
ALTER TABLE food_submissions
ADD ngo_assigned VARCHAR(255);

ALTER TABLE food_submissions
ADD volunteer_assigned VARCHAR(255);

ALTER TABLE food_submissions
ADD pickup_status VARCHAR(100)
DEFAULT 'Pending';
ALTER TABLE users1
ADD status VARCHAR(50)
DEFAULT 'active';
ALTER TABLE food_submissions
ADD pickup_started_at DATETIME NULL,
ADD delivered_at DATETIME NULL;