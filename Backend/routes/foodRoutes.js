const express = require('express');
const router = express.Router();
const db = require('../config/db');
const classifyFood = require('../services/classifier');
const sendEmail = require('../services/notificationService');

router.post('/submit', async (req, res) => {
    try {
        console.log("Incoming Request:", req.body);

        // CLASSIFY FOOD
        const result = classifyFood(req.body);
        console.log("Classification Result:", result);

        // SQL QUERY
        const sql = `
        INSERT INTO food_submissions(
            food_type,
            quantity,
            hours_old,
            food_condition,
            location,
            food_category,
            storage_condition,
            pickup_availability,
            classification,
            action_required,
            donor_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // VALUES
        const values = [
            req.body.food_type,
            req.body.quantity,
            req.body.hours_old,
            req.body.food_condition,
            req.body.location,
            req.body.food_category,
            req.body.storage_condition || '',
            req.body.pickup_availability || '',
            result.classification,
            result.action,
            req.body.donor_email
        ];

        // SAVE TO DATABASE
        db.query(sql, values, async (err, dbResult) => {
            if (err) {
                console.log("Database Error:", err);
                return res.status(500).json({
                    success: false,
                    message: 'Database Error'
                });
            }

            // =========================
            // ✅ REAL-TIME SOCKET UPDATE (EXISTING)
            // =========================
            const io = req.app.get('io');

            if (io) {
                io.emit("donationUpdated", {
                    message: "Donation updated",
                    id: dbResult.insertId
                });

                // 🔥 NEW ADDITION (NOTIFICATION EVENT)
                io.emit("notification", {
                    type: "success",
                    title: "New Donation",
                    message: `${req.body.food_type} donation submitted`,
                    timestamp: new Date()
                });
            }
               // SOCKET EVENT
        // const io = req.app.get("io");

        io.emit("new-waste-request", {
            food_type: food_type
        });


            // =========================
            // EMAIL SYSTEM (UNCHANGED)
            // =========================
            try {

                if (result.classification === 'human') {
                    await sendEmail(
                        'ngo@gmail.com',
                        'Food Donation Alert',
                        `Fresh food available for donation.
Food Type: ${req.body.food_type}
Quantity: ${req.body.quantity}
Location: ${req.body.location}
Please arrange pickup.`
                    );
                }

                else if (result.classification === 'animal') {
                    await sendEmail(
                        'farm@gmail.com',
                        'Animal Feed Alert',
                        `Food suitable for animal feed.
Food Type: ${req.body.food_type}
Quantity: ${req.body.quantity}
Location: ${req.body.location}
Please arrange collection.`
                    );
                }

                else if (result.classification === 'waste') {
                    await sendEmail(
                        'compost@gmail.com',
                        'Compost Collection Alert',
                        `Food waste available for composting.
Food Type: ${req.body.food_type}
Quantity: ${req.body.quantity}
Location: ${req.body.location}
Please arrange compost pickup.`
                    );
                }

            } catch (emailError) {
                console.log("Email Error:", emailError);
            }

            // =========================
            // RESPONSE
            // =========================
            res.json({
                success: true,
                message: 'Food submitted successfully',
                result
            });

        });

    } catch (error) {
        console.log("Server Error:", error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

module.exports = router;