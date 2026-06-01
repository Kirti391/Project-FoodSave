# FoodSave - Food Waste Management & Redistribution Platform

## Overview

FoodSave is a web-based food waste management platform designed to reduce food wastage by connecting food donors, NGOs, volunteers, farms, and beneficiaries through a centralized system.

The platform enables donors to submit surplus food, NGOs to manage and distribute requests, volunteers to handle pickups and deliveries, farms to receive non-consumable food for composting or animal feed, and users to claim available food resources.

---

## Problem Statement

A significant amount of edible food is wasted daily while many people continue to face food insecurity.

FoodSave addresses this issue by:

* Reducing food waste
* Supporting NGOs and food distribution efforts
* Facilitating volunteer-driven deliveries
* Providing food access to beneficiaries
* Diverting unsuitable food to farms for sustainable reuse

---

## Objectives

* Minimize food wastage
* Connect donors with NGOs and volunteers
* Enable efficient food collection and distribution
* Track food delivery lifecycle
* Promote sustainability and social impact

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Font Awesome
* Socket.IO Client

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Real-Time Communication

* Socket.IO

---

## System Modules

### 1. Donor Dashboard

Features:

* Submit surplus food
* Enter food details
* View submission status
* Track food processing stage
* Monitor completed donations

---

### 2. NGO Dashboard

Features:

* View incoming food requests
* Accept or reject requests
* Assign volunteers
* Monitor delivery progress
* Track completed deliveries
* View daily and weekly statistics

Workflow:

Pending → Accepted → Assigned → Pickup → Delivering → Completed

---

### 3. Volunteer Dashboard

Features:

* View assigned pickups
* Start pickup process
* Update delivery status
* Mark deliveries as completed
* Track active deliveries
* View delivery history

Additional Features:

* Emergency priority indication
* Delivery duration tracking
* Live dashboard statistics

---

### 4. Farm Dashboard

Features:

* View food unsuitable for human consumption
* Accept food for:

  * Composting
  * Animal feed
  * Organic processing
* Track received food quantities

---

### 5. User Dashboard

Features:

* View available food items
* Claim food resources
* View claimed items
* Track claim history

---

## Database Design

Main Tables:

### Users

Stores:

* User information
* Login credentials
* User roles

### Food Submissions

Stores:

* Food details
* Quantity
* Location
* Status
* Assigned NGO
* Assigned Volunteer
* Delivery timestamps

### NGOs

Stores NGO registration information.

### Volunteers

Stores volunteer details and availability.

### Farms

Stores farm information and accepted food types.

### Notifications

Stores platform notifications.

### Pickup Requests

Stores pickup and delivery information.

---

## Key Features

### Food Classification

The system classifies food into:

* Human Consumption
* Farm Feed
* Composting

based on food condition and age.

### Volunteer Assignment System

NGOs can assign volunteers to accepted requests.

### Delivery Tracking

Tracks:

* Pickup start time
* Delivery completion time
* Delivery duration

### Emergency Priority System

Food requests are prioritized based on age:

* Normal
* Urgent
* Critical

### Real-Time Updates

Socket.IO provides:

* New request notifications
* Dashboard refreshes
* Live status updates

### Food Claim System

Users can claim available food items.

Claimed items are automatically removed from the available food list.

---

## Project Workflow

### Donation Flow

Donor
↓
Food Submission
↓
NGO Review
↓
Volunteer Assignment
↓
Pickup
↓
Delivery
↓
Beneficiary/User

### Farm Flow

Donor
↓
Food Submission
↓
Classification
↓
Farm Assignment
↓
Processing

---

## Installation Guide

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Configure Database

Create MySQL database:

```sql
CREATE DATABASE foodsave_db;
```

Import schema:

```bash
schema.sql
```

### Configure Environment

Update database credentials:

```javascript
host: "localhost"
user: "root"
password: ""
database: "foodsave_db"
```

### Run Server

```bash
npm start
```

or

```bash
node server.js
```

### Open Application

```text
http://localhost:5000
```

---

## Future Enhancements

* JWT Authentication
* Role-Based Access Control
* Google Maps Integration
* Route Optimization
* OTP Delivery Verification
* Image Upload Proof
* Email Notifications
* SMS Alerts
* AI-Based Food Classification
* Analytics Dashboard
* Mobile Application

---

## Expected Impact

FoodSave helps:

* Reduce food waste
* Support NGOs
* Improve food accessibility
* Promote sustainability
* Encourage community participation

---

## Academic Relevance

This project demonstrates:

* Full Stack Development
* Database Design
* REST API Development
* Real-Time Communication
* CRUD Operations
* Dashboard Management
* Software Engineering Principles

---

## Developed For

College Minor Project

### Project Title

**FoodSave – Smart Food Waste Management and Redistribution Platform**

---

## License

This project is developed for educational and academic purposes.
