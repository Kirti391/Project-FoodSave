const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   GET REQUESTS
========================= */

router.get("/requests", (req, res) => {

    const sql = `
        SELECT * FROM food_submissions
        ORDER BY id DESC
    `;

    const statsSql = `
        SELECT 
            COUNT(*) AS total,

            SUM(CASE 
                WHEN status='pending' THEN 1 ELSE 0 
            END) AS incoming,

            SUM(CASE 
                WHEN DATE(created_at) = CURDATE() 
                THEN 1 ELSE 0 
            END) AS today,

            SUM(CASE 
                WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                THEN 1 ELSE 0 
            END) AS this_week

        FROM food_submissions;
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({ success: false });
        }

        db.query(statsSql, (err2, statsResult) => {

            if (err2) {
                return res.status(500).json({ success: false });
            }

            res.json({
                success: true,
                requests: results,
                stats: statsResult[0]
            });

        });

    });

});

/* =========================
   ACCEPT
========================= */

router.put("/accept/:id", (req, res) => {

    db.query(
        `UPDATE food_submissions SET status='accepted' WHERE id=?`,
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        }
    );
});

/* =========================
   REJECT
========================= */

router.put("/reject/:id", (req, res) => {

    db.query(
        `UPDATE food_submissions SET status='rejected' WHERE id=?`,
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        }
    );
});

/* =========================
   ASSIGN VOLUNTEER
========================= */

router.put("/assign/:id", (req, res) => {

    const { volunteer } = req.body;

    const sql = `
        UPDATE food_submissions 
        SET status='assigned',
            assigned_volunteer=?
        WHERE id=?
    `;

    db.query(sql, [volunteer, req.params.id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ success: false });
        }
        io.emit("ngo-update");

        res.json({ success: true });
    });
});
module.exports = router;