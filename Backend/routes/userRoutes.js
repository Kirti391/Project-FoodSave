const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   GET AVAILABLE FOOD
   (Only unclaimed / accepted food)
========================= */

router.get("/available", (req, res) => {

  const sql = `
    SELECT *
    FROM food_submissions
    WHERE claim_status = 'available'
    AND status = 'accepted'
    ORDER BY id DESC
`;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "DB Error"
            });
        }

        res.json({
            success: true,
            foods: results
        });

    });

});


/* =========================
   CLAIM FOOD
========================= */
router.put("/claim/:id", (req, res) => {

    const userId = req.body.user_id;

    const sql = `
        UPDATE food_submissions
        SET claim_status='claimed',
            user_id=?
        WHERE id=? AND claim_status='available'
    `;

    db.query(sql, [userId, req.params.id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ success: false });
        }

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                message: "Already claimed"
            });
        }

        res.json({ success: true });
    });
});

/* =========================
   GET USER CLAIMS
========================= */

router.get("/claims/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT *
        FROM food_submissions
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "DB Error"
            });
        }

        res.json({
            success: true,
            claims: results
        });

    });

});


/* =========================
   TRACK SINGLE REQUEST
   (For future tracking page)
========================= */

router.get("/track/:id", (req, res) => {

    const sql = `
        SELECT *
        FROM food_submissions
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }

        res.json({
            success: true,
            request: results[0]
        });

    });

});

module.exports = router;