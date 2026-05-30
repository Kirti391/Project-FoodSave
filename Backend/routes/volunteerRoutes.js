const express = require("express");
const router = express.Router();

const db = require("../config/db");

/* =========================
   GET VOLUNTEER DELIVERIES
========================= */

router.get("/deliveries", async (req, res) => {

    try {

        const sql = `
            SELECT *
            FROM food_submissions
            WHERE status IN ('accepted', 'pickup', 'delivering', 'completed')
            ORDER BY id DESC
        `;

        db.query(sql, (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({
                success: true,
                deliveries: results
            });

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

});

/* =========================
   START PICKUP
========================= */

router.put("/pickup/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE food_submissions
        SET status='pickup'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true
        });

    });

});

/* =========================
   START DELIVERY
========================= */

router.put("/deliver/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE food_submissions
        SET status='delivering'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true
        });

    });

});

/* =========================
   COMPLETE DELIVERY
========================= */

router.put("/complete/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE food_submissions
        SET status='completed'
        WHERE id=?
    `;

    db.query(sql, [id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true
        });

    });

});

module.exports = router;