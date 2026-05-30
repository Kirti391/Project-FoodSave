const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
=====================================
GET WASTE FOR FARM (FROM NGO COMPLETED)
=====================================
*/
router.get("/waste", (req, res) => {

const sql = `
    SELECT *
    FROM food_submissions
    WHERE status IN ('completed','accepted','processing','pending','rejected')
    OR food_condition = 'Spoiled'
    OR hours_old > 6
    ORDER BY created_at DESC
`;
   

db.query(sql, (err, results) => {
    if (err) {
        return res.status(500).json({ success: false });
    }

    res.json({
        success: true,
        waste: results
    });
});

});
router.put("/accept/:id", (req, res) => {

    const sql = `
        UPDATE food_submissions
        SET status = 'accepted'
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });

        req.app.get("io")?.emit("farm-update");

        res.json({ success: true });
    });
});
// router.get('/waste', (req, res) => {

//     const sql = `
//         SELECT *
//         FROM food_submissions
//         WHERE status = 'rejected'
//            OR food_condition = 'Spoiled'
//            OR hours_old > 6
//         ORDER BY created_at DESC
//     `;

//     db.query(sql, (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({
//                 success: false
//             });
//         }

//         res.json({
//             success: true,
//             waste: results
//         });
//     });
// });
router.put("/start-processing/:id", (req, res) => {

    const sql = `
        UPDATE food_submissions
        SET status = 'processing'
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });

        req.app.get("io")?.emit("farm-update");

        res.json({ success: true });
    });
});
router.put("/complete/:id", (req, res) => {

    const sql = `
        UPDATE food_submissions
        SET status = 'completed'
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false });

        req.app.get("io")?.emit("farm-update");

        res.json({ success: true });
    });
});

module.exports = router;